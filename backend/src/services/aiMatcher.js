const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// ── Score a worker against a job using weighted signals ──
function scoreWorker(worker, jobDetails) {
  const signals = {};

  // Skill match (30%) — keyword overlap between job description and worker skills
  const jobWords  = (jobDetails.title + " " + jobDetails.description).toLowerCase().split(/\W+/);
  const skills    = (worker.skills || []).map(s => s.toLowerCase());
  const matches   = skills.filter(s => jobWords.some(w => w.includes(s) || s.includes(w)));
  signals.skillMatch = Math.min(100, (matches.length / Math.max(skills.length, 1)) * 100 + (matches.length > 0 ? 40 : 0));

  // Trust score (20%) — normalized 0-100
  signals.trustScore = Math.min(100, ((worker.trustScore || 50) / 1000) * 100);

  // Past performance (20%) — based on completed jobs and response time
  const jobs = worker.completedJobs || 0;
  signals.pastPerformance = Math.min(100, jobs > 100 ? 95 : jobs > 50 ? 85 : jobs > 20 ? 70 : jobs > 5 ? 55 : 35);

  // Rate compatibility (15%) — how well rate fits budget
  const budget = parseBudget(jobDetails.budget);
  const rate   = worker.hourlyRate || 75;
  if (budget > 0) {
    const budgetRate = budget / 160; // assume 160 hrs/month
    const diff = Math.abs(rate - budgetRate) / budgetRate;
    signals.rateCompatibility = Math.max(0, 100 - diff * 100);
  } else {
    signals.rateCompatibility = 75;
  }

  // Availability (10%)
  signals.availability = worker.availability ? 100 : 0;

  // Location (5%) — always 70 for now (remote-first)
  signals.location = 70;

  // Weighted total
  const total =
    signals.skillMatch      * 0.30 +
    signals.trustScore      * 0.20 +
    signals.pastPerformance * 0.20 +
    signals.rateCompatibility * 0.15 +
    signals.availability    * 0.10 +
    signals.location        * 0.05;

  return { score: Math.round(total), signals };
}

function parseBudget(budget) {
  if (!budget) return 0;
  const s = String(budget).replace(/[,$]/g, "");
  if (s.includes("–") || s.includes("-")) {
    const parts = s.split(/[–-]/);
    return (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
  }
  return parseFloat(s) || 0;
}

// ── Use Claude to rank and explain the top workers ──
async function rankWithClaude(jobDetails, candidates) {
  if (!ANTHROPIC_KEY || candidates.length === 0) return candidates.slice(0, 3);

  try {
    const prompt = `You are Veritas AI, an expert job-worker matching system.

Job Details:
- Title: ${jobDetails.title}
- Description: ${jobDetails.description}
- Budget: ${jobDetails.budget || "Not specified"}
- Timeline: ${jobDetails.timeline || "Flexible"}

Top Candidates (pre-scored):
${candidates.slice(0, 8).map((c, i) => `
${i+1}. ${c.name || c.email} (@${c.username})
   - Skills: ${(c.skills || []).join(", ") || "Not specified"}
   - Trust Score: ${c.trustScore}/1000
   - Rate: $${c.hourlyRate}/hr
   - Jobs Completed: ${c.completedJobs}
   - Pre-score: ${c._score}
`).join("")}

Select the TOP 3 workers best suited for this job. Consider skill alignment, trust, rate fit, and experience.

Respond in JSON only — no markdown, no explanation:
{"rankings":[{"rank":1,"username":"...","matchScore":99,"reason":"...","strengths":["...","..."]},{"rank":2,"username":"...","matchScore":97,"reason":"...","strengths":["...","..."]},{"rank":3,"username":"...","matchScore":94,"reason":"...","strengths":["...","..."]}]}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role:"user", content: prompt }],
      }),
    });

    const data  = await res.json();
    const text  = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Map Claude rankings back to full worker objects
    return parsed.rankings.map((r, i) => {
      const worker = candidates.find(c => c.username === r.username) || candidates[i];
      return { ...worker, _matchScore: r.matchScore, _reason: r.reason, _strengths: r.strengths, _rank: r.rank };
    });
  } catch (err) {
    console.error("[AI] Claude ranking failed, using score fallback:", err.message);
    return candidates.slice(0, 3).map((w, i) => ({ ...w, _matchScore: w._score, _rank: i+1, _reason:"Strong skill and trust match", _strengths:w.skills?.slice(0,2) || [] }));
  }
}

// ── MAIN: Match workers to job ──
exports.matchWorkersToJob = async (jobDetails) => {
  // Pull available workers from DB
  const workers = await prisma.user.findMany({
    where: { role:"WORKER", availability:true },
    select: {
      id:true, name:true, email:true, username:true,
      skills:true, trustScore:true, hourlyRate:true,
      completedJobs:true, availability:true, responseTime:true,
    },
    take: 50,
    orderBy: { trustScore: "desc" },
  });

  if (workers.length === 0) {
    // Return demo workers if DB is empty
    return getDemoMatches(jobDetails);
  }

  // Score all workers
  const scored = workers.map(w => {
    const { score, signals } = scoreWorker(w, jobDetails);
    return { ...w, _score: score, _signals: signals };
  }).sort((a, b) => b._score - a._score);

  // Rank top 8 with Claude
  const top3 = await rankWithClaude(jobDetails, scored);
  return top3;
};

// ── Demo matches when DB is empty ──
function getDemoMatches(jobDetails) {
  return [
    { id:"demo1", name:"Alex Chen",    username:"alexchen.dev",  skills:["React","TypeScript","Next.js"], trustScore:990, hourlyRate:150, completedJobs:247, _matchScore:99, _rank:1, _reason:"Perfect skill alignment with extensive full-stack experience", _strengths:["React/TypeScript expert","247 completed jobs"] },
    { id:"demo2", name:"Priya Sharma", username:"priyadev",      skills:["Node.js","AWS","PostgreSQL"],   trustScore:960, hourlyRate:140, completedJobs:156, _matchScore:97, _rank:2, _reason:"Strong backend match with excellent trust score",          _strengths:["Backend architecture","Cloud infrastructure"] },
    { id:"demo3", name:"Marcus J.",    username:"mjohnson.dev",  skills:["React","Node.js","MongoDB"],    trustScore:910, hourlyRate:135, completedJobs:198, _matchScore:94, _rank:3, _reason:"Solid full-stack developer with competitive rate",           _strengths:["Full-stack generalist","Fast delivery track record"] },
  ];
}

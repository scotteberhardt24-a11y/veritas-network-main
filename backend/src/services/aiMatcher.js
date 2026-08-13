const Anthropic = require("@anthropic-ai/sdk");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Veritas AI Match Engine v2
 * 
 * Algorithm:
 * 1. Pull all eligible workers from DB
 * 2. Score each worker across 8 dimensions
 * 3. Claude re-ranks top 20 with deep reasoning
 * 4. Return exactly 3 workers with confidence scores
 *
 * Scoring dimensions:
 * - Trust Score (30%) — primary signal
 * - Skill match (25%) — keyword + semantic match
 * - Job type history (15%) — has done this before?
 * - Response rate (10%) — reliability signal
 * - Recency (8%) — active recently?
 * - Dispute rate (7%) — clean history?
 * - Budget fit (3%) — rate in range?
 * - Availability (2%) — currently available?
 */

const JOB_TYPE_WEIGHTS = {
  development: { trustScore:0.25, skillMatch:0.30, history:0.20, responseRate:0.10, recency:0.07, disputeRate:0.05, budget:0.02, availability:0.01 },
  design:      { trustScore:0.20, skillMatch:0.35, history:0.18, responseRate:0.10, recency:0.07, disputeRate:0.05, budget:0.03, availability:0.02 },
  writing:     { trustScore:0.22, skillMatch:0.32, history:0.18, responseRate:0.12, recency:0.06, disputeRate:0.05, budget:0.03, availability:0.02 },
  marketing:   { trustScore:0.25, skillMatch:0.28, history:0.20, responseRate:0.10, recency:0.08, disputeRate:0.05, budget:0.02, availability:0.02 },
  web3:        { trustScore:0.30, skillMatch:0.30, history:0.15, responseRate:0.08, recency:0.07, disputeRate:0.07, budget:0.02, availability:0.01 },
  consulting:  { trustScore:0.35, skillMatch:0.25, history:0.15, responseRate:0.10, recency:0.05, disputeRate:0.07, budget:0.02, availability:0.01 },
  default:     { trustScore:0.30, skillMatch:0.25, history:0.15, responseRate:0.10, recency:0.08, disputeRate:0.07, budget:0.03, availability:0.02 },
};

function detectJobType(description) {
  const d = description.toLowerCase();
  if (/react|node|python|typescript|solidity|api|backend|frontend|fullstack|developer|code|software/.test(d)) return "development";
  if (/figma|design|ui|ux|logo|brand|illustration|graphic/.test(d)) return "design";
  if (/write|content|blog|copy|article|technical writing|documentation/.test(d)) return "writing";
  if (/marketing|seo|ads|social media|growth|email|campaign/.test(d)) return "marketing";
  if (/web3|blockchain|smart contract|nft|defi|crypto|polygon|ethereum/.test(d)) return "web3";
  if (/consult|strategy|advise|audit|analysis|research/.test(d)) return "consulting";
  return "default";
}

function scoreSkillMatch(workerSkills, jobDescription) {
  if (!workerSkills || workerSkills.length === 0) return 0;
  const desc = jobDescription.toLowerCase();
  const matches = workerSkills.filter(skill => desc.includes(skill.toLowerCase()));
  return Math.min(1, matches.length / Math.max(1, workerSkills.length * 0.5));
}

function scoreRecency(lastJobAt) {
  if (!lastJobAt) return 0.3;
  const daysSince = (Date.now() - new Date(lastJobAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince <= 7)  return 1.0;
  if (daysSince <= 30) return 0.8;
  if (daysSince <= 90) return 0.5;
  return 0.2;
}

function scoreDisputeRate(won, lost, total) {
  if (total < 5) return 0.8; // Not enough data — neutral
  const rate = lost / total;
  if (rate === 0)    return 1.0;
  if (rate <= 0.02)  return 0.9;
  if (rate <= 0.05)  return 0.7;
  if (rate <= 0.10)  return 0.4;
  return 0.1;
}

function scoreBudgetFit(workerRate, jobBudgetMin, jobBudgetMax) {
  if (!workerRate || !jobBudgetMax) return 0.5;
  if (workerRate >= jobBudgetMin && workerRate <= jobBudgetMax) return 1.0;
  if (workerRate < jobBudgetMin) return 0.7; // Under budget — still good
  const overage = (workerRate - jobBudgetMax) / jobBudgetMax;
  return Math.max(0, 1 - overage * 2);
}

function computeWorkerScore(worker, jobDescription, jobType, budgetMin, budgetMax, weights) {
  const trustNorm     = (worker.trustScore || 0) / 1000;
  const skillMatch    = scoreSkillMatch(worker.skills, jobDescription);
  const historyScore  = Math.min(1, (worker.completedJobs || 0) / 100);
  const responseRate  = (worker.responseRate || 0.7);
  const recency       = scoreRecency(worker.lastJobAt);
  const disputeRate   = scoreDisputeRate(worker.disputesWon || 0, worker.disputesLost || 0, worker.completedJobs || 0);
  const budgetFit     = scoreBudgetFit(worker.hourlyRate, budgetMin, budgetMax);
  const availability  = worker.availability ? 1 : 0.2;

  const score =
    trustNorm    * weights.trustScore   +
    skillMatch   * weights.skillMatch   +
    historyScore * weights.history      +
    responseRate * weights.responseRate +
    recency      * weights.recency      +
    disputeRate  * weights.disputeRate  +
    budgetFit    * weights.budget       +
    availability * weights.availability;

  return {
    ...worker,
    _matchScore: Math.round(score * 100),
    _breakdown: { trustNorm, skillMatch, historyScore, responseRate, recency, disputeRate, budgetFit, availability }
  };
}

async function runAIRanking(topWorkers, jobDescription, jobType) {
  const workerSummaries = topWorkers.map((w, i) => ({
    rank: i + 1,
    id: w.id,
    username: w.username,
    trustScore: w.trustScore,
    completedJobs: w.completedJobs,
    skills: w.skills?.slice(0, 8),
    hourlyRate: w.hourlyRate,
    algoScore: w._matchScore,
    disputeRate: w.completedJobs > 0 ? ((w.disputesLost || 0) / w.completedJobs * 100).toFixed(1) + "%" : "N/A",
    availability: w.availability,
  }));

  const prompt = `You are the Veritas AI Match Engine. Your job is to select exactly 3 workers for a job posting.

JOB DESCRIPTION:
${jobDescription}

JOB TYPE: ${jobType}

TOP 20 CANDIDATES (pre-scored by algorithm):
${JSON.stringify(workerSummaries, null, 2)}

SELECTION CRITERIA:
1. Best skill match for this specific job
2. Proven track record in this job type
3. Trust Score — higher is always better (reflects verified history)
4. Clean dispute history
5. Currently available
6. Rate fits the work

Select exactly 3 workers. For each explain WHY they are the best fit. Be specific about which skills match.

Respond ONLY in this JSON format, no other text:
{
  "selections": [
    {
      "id": "worker_id_here",
      "rank": 1,
      "confidence": 97,
      "reason": "Specific reason this worker is the best fit",
      "keyStrengths": ["strength1", "strength2", "strength3"]
    },
    {
      "id": "worker_id_here",
      "rank": 2,
      "confidence": 94,
      "reason": "Specific reason",
      "keyStrengths": ["strength1", "strength2"]
    },
    {
      "id": "worker_id_here",
      "rank": 3,
      "confidence": 91,
      "reason": "Specific reason",
      "keyStrengths": ["strength1", "strength2"]
    }
  ],
  "jobAnalysis": "Brief analysis of what this job needs"
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  });

  const text = response.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function matchWorkers(jobDescription, options = {}) {
  const {
    budgetMin = 0,
    budgetMax = 99999,
    minTrustScore = 0,
    requiredSkills = [],
    limit = 20
  } = options;

  // 1. Pull workers from DB
  const workers = await prisma.user.findMany({
    where: {
      role: "WORKER",
      availability: true,
      trustScore: { gte: minTrustScore },
    },
    select: {
      id: true, username: true, trustScore: true, skills: true,
      hourlyRate: true, availability: true, completedJobs: true,
      lastJobAt: true, disputesWon: true, disputesLost: true,
      responseRate: true,
    },
    orderBy: { trustScore: "desc" },
    take: 200, // Pull top 200 for algorithmic scoring
  });

  if (workers.length === 0) {
    return { workers: [], jobAnalysis: "No eligible workers found.", totalScanned: 0 };
  }

  // 2. Detect job type and get weights
  const jobType = detectJobType(jobDescription);
  const weights = JOB_TYPE_WEIGHTS[jobType] || JOB_TYPE_WEIGHTS.default;

  // 3. Score all workers algorithmically
  const scored = workers
    .map(w => computeWorkerScore(w, jobDescription, jobType, budgetMin, budgetMax, weights))
    .sort((a, b) => b._matchScore - a._matchScore)
    .slice(0, limit); // Top 20 go to Claude

  // 4. Claude re-ranks and selects final 3
  if (!process.env.ANTHROPIC_API_KEY || scored.length < 3) {
    // Fallback: return top 3 from algorithm
    return {
      workers: scored.slice(0, 3).map((w, i) => ({
        ...w,
        rank: i + 1,
        confidence: w._matchScore,
        reason: "Selected by algorithmic scoring",
        keyStrengths: w.skills?.slice(0, 3) || [],
      })),
      jobAnalysis: `Top ${Math.min(3, scored.length)} workers selected algorithmically.`,
      jobType,
      totalScanned: workers.length,
    };
  }

  const aiResult = await runAIRanking(scored, jobDescription, jobType);

  // 5. Merge AI selections with full worker data
  const finalWorkers = aiResult.selections.map(sel => {
    const worker = scored.find(w => w.id === sel.id);
    return {
      ...worker,
      rank: sel.rank,
      confidence: sel.confidence,
      reason: sel.reason,
      keyStrengths: sel.keyStrengths,
    };
  }).filter(Boolean);

  return {
    workers: finalWorkers,
    jobAnalysis: aiResult.jobAnalysis,
    jobType,
    totalScanned: workers.length,
    algorithmiScore: scored.slice(0, 3).map(w => ({ id: w.id, score: w._matchScore })),
  };
}

module.exports = { matchWorkers, detectJobType };

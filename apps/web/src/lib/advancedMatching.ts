/**
 * Advanced AI Matching Engine
 * Uses Claude API to intelligently match workers to jobs
 * 
 * This is the SECRET SAUCE that makes Veritas better than Upwork
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

interface Worker {
  worker_id: string;
  name: string;
  bio: string;
  skills: string[];
  experience_level: 'entry' | 'intermediate' | 'expert';
  hourly_rate: number;
  past_projects: Array<{
    title: string;
    description: string;
    rating: number;
  }>;
  badges: string[];
  truscore: number;
  response_rate: number;
  on_time_rate: number;
  verification_status: {
    email: boolean;
    identity: boolean;
    phone: boolean;
  };
}

interface Job {
  job_id: string;
  title: string;
  description: string;
  detailed_description: string;
  skills_required: string[];
  experience_level: 'entry' | 'intermediate' | 'expert';
  budget: number;
  budget_max: number;
  category: string;
  timeline: string;
  deliverables: string[];
  client_verification_status: {
    verified: boolean;
    rating: number;
  };
}

interface MatchResult {
  worker_id: string;
  worker_name: string;
  match_score: number;
  match_reasons: string[];
  fit_analysis: string;
  risk_factors: string[];
  estimated_success_rate: number;
  communication_fit: number;
  budget_alignment: number;
  timeline_alignment: number;
}

/**
 * Main matching function - uses Claude to analyze compatibility
 */
export async function findBestWorkerMatches(
  job: Job,
  workers: Worker[],
  topN: number = 3
): Promise<MatchResult[]> {
  try {
    // Prepare the prompt for Claude
    const workersJson = JSON.stringify(
      workers.map((w) => ({
        id: w.worker_id,
        name: w.name,
        bio: w.bio,
        skills: w.skills,
        level: w.experience_level,
        rate: w.hourly_rate,
        projects: w.past_projects,
        badges: w.badges,
        truscore: w.truscore,
        metrics: {
          response_rate: w.response_rate,
          on_time_rate: w.on_time_rate,
        },
        verified: w.verification_status,
      })),
      null,
      2
    );

    const jobJson = JSON.stringify(
      {
        title: job.title,
        description: job.description,
        skills_needed: job.skills_required,
        level: job.experience_level,
        budget: `$${job.budget}-$${job.budget_max}`,
        category: job.category,
        timeline: job.timeline,
        deliverables: job.deliverables,
        client_verified: job.client_verification_status.verified,
      },
      null,
      2
    );

    const prompt = `You are an expert talent matcher for a Web3 freelance platform called Veritas.
Your job is to analyze which workers are best suited for a specific job posting.

IMPORTANT: Return a valid JSON array with NO markdown formatting, NO code blocks, and NO additional text.

Job Details:
${jobJson}

Available Workers:
${workersJson}

Analyze each worker carefully considering:
1. Skill match (exact matches score highest)
2. Experience level alignment (must match or exceed job requirements)
3. Budget alignment (worker's rate vs job budget)
4. Past project success (look at ratings and relevance)
5. Reliability metrics (response rate, on-time rate)
6. Trust score (TruScore should be 800+ for quality jobs)
7. Badges earned (indicates specialization)
8. Communication fit (based on past project descriptions)
9. Timeline feasibility (can they deliver on time)
10. Risk factors (any red flags)

For each worker, provide:
- match_score (0-100): Overall compatibility score
- match_reasons: 3-4 specific reasons why they're a good fit
- fit_analysis: 1-2 sentences on why they match
- risk_factors: Any potential concerns
- estimated_success_rate (0-100): Likelihood of successful completion
- communication_fit (0-100): How well they can handle this type of work
- budget_alignment (0-100): How well their rate fits the budget
- timeline_alignment (0-100): Confidence they can meet the timeline

Return ONLY a JSON array with this structure, sorted by match_score descending:
[
  {
    "worker_id": "string",
    "worker_name": "string",
    "match_score": number,
    "match_reasons": ["string", "string", "string"],
    "fit_analysis": "string",
    "risk_factors": ["string"],
    "estimated_success_rate": number,
    "communication_fit": number,
    "budget_alignment": number,
    "timeline_alignment": number
  }
]`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the text response
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the JSON response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response');
    }

    const matches: MatchResult[] = JSON.parse(jsonMatch[0]);

    // Return top N matches
    return matches.slice(0, topN);
  } catch (error) {
    console.error('AI Matching Error:', error);
    // Fallback to basic matching
    return fallbackMatching(job, workers, topN);
  }
}

/**
 * Fallback matching when Claude API fails
 */
function fallbackMatching(
  job: Job,
  workers: Worker[],
  topN: number
): MatchResult[] {
  return workers
    .map((worker) => {
      // Simple skill matching
      const skillMatch = job.skills_required.filter((skill) =>
        worker.skills.some((ws) =>
          ws.toLowerCase().includes(skill.toLowerCase())
        )
      ).length;
      const skillScore = (skillMatch / job.skills_required.length) * 40;

      // Experience level matching
      const levelScore =
        worker.experience_level === job.experience_level ? 30 : 15;

      // Budget alignment
      const budgetFit =
        worker.hourly_rate >= job.budget &&
        worker.hourly_rate <= job.budget_max;
      const budgetScore = budgetFit ? 20 : 10;

      // Trust score
      const trustScore = worker.truscore >= 800 ? 10 : 5;

      const totalScore = skillScore + levelScore + budgetScore + trustScore;

      return {
        worker_id: worker.worker_id,
        worker_name: worker.name,
        match_score: Math.min(100, Math.round(totalScore)),
        match_reasons: [
          `Has ${skillMatch}/${job.skills_required.length} required skills`,
          `Experience level: ${worker.experience_level}`,
          `Rate: $${worker.hourly_rate}/hr vs $${job.budget}-$${job.budget_max}`,
        ],
        fit_analysis: `${worker.name} is a ${worker.experience_level} level developer with relevant skills.`,
        risk_factors: [],
        estimated_success_rate: 75,
        communication_fit: worker.response_rate,
        budget_alignment: budgetFit ? 90 : 40,
        timeline_alignment: 80,
      };
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, topN);
}

/**
 * Get matching jobs for a worker
 */
export async function findBestJobMatches(
  worker: Worker,
  jobs: Job[],
  topN: number = 5
): Promise<MatchResult[]> {
  try {
    const jobsJson = JSON.stringify(
      jobs.map((j) => ({
        id: j.job_id,
        title: j.title,
        description: j.description,
        skills: j.skills_required,
        level: j.experience_level,
        budget: `$${j.budget}-$${j.budget_max}`,
        category: j.category,
      })),
      null,
      2
    );

    const workerJson = JSON.stringify(
      {
        name: worker.name,
        skills: worker.skills,
        level: worker.experience_level,
        rate: worker.hourly_rate,
        category: 'Specializations: ' + worker.skills.slice(0, 3).join(', '),
        truscore: worker.truscore,
      },
      null,
      2
    );

    const prompt = `You are a job recommendation system for a Web3 freelance platform.
Recommend the best jobs for a worker based on their skills and experience.

Worker Profile:
${workerJson}

Available Jobs:
${jobsJson}

For each job, analyze:
1. Skill alignment (does worker have required skills?)
2. Experience level match
3. Budget fit (is pay acceptable?)
4. Category alignment
5. Growth opportunity

Return ONLY a JSON array (no markdown, no code blocks):
[
  {
    "worker_id": "constant",
    "worker_name": "worker name",
    "match_score": number 0-100,
    "match_reasons": ["reason1", "reason2", "reason3"],
    "fit_analysis": "brief analysis",
    "risk_factors": [],
    "estimated_success_rate": number,
    "communication_fit": number,
    "budget_alignment": number,
    "timeline_alignment": number
  }
]`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Failed to parse response');
    }

    const matches: MatchResult[] = JSON.parse(jsonMatch[0]);
    return matches.slice(0, topN);
  } catch (error) {
    console.error('Job matching error:', error);
    return [];
  }
}

/**
 * Analyze job-worker compatibility with detailed feedback
 */
export async function analyzeMatchQuality(
  job: Job,
  worker: Worker
): Promise<{
  score: number;
  analysis: string;
  recommendations: string[];
  communicationTips: string[];
}> {
  try {
    const prompt = `As a workplace compatibility expert, analyze how well this worker would perform on this job.

Job: ${job.title}
Worker: ${worker.name} (${worker.experience_level})

Skills needed: ${job.skills_required.join(', ')}
Worker skills: ${worker.skills.join(', ')}

Provide:
1. Overall compatibility score (0-100)
2. Detailed analysis (2-3 sentences)
3. 3 recommendations for success
4. 2 communication tips

Format response as JSON with keys: score, analysis, recommendations (array), communicationTips (array)`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      score: 75,
      analysis: 'Good match based on skills and experience',
      recommendations: ['Review past projects', 'Start with milestone-based payment'],
      communicationTips: ['Clear requirements', 'Regular check-ins'],
    };
  } catch (error) {
    console.error('Analysis error:', error);
    return {
      score: 0,
      analysis: 'Unable to analyze',
      recommendations: [],
      communicationTips: [],
    };
  }
}

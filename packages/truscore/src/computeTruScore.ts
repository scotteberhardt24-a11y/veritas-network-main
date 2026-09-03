import type {
  TruScoreEvent,
  TruScoreEventType,
  AttestationKind,
  JobBand,
  TruScoreResult,
} from "./types";

const S0 = 500;
const GMAX_30D = 80;
const ALGORITHM = "truscore-v1" as const;

function isPenalty(type: TruScoreEventType): boolean {
  return type === "dispute_lost" || type === "policy_slash";
}

function halfLifeDays(type: TruScoreEventType): number | null {
  switch (type) {
    case "job_completed":
    case "job_rating":
      return 270;
    case "skill_credential":
      return 540;
    case "vouch":
      return 180;
    case "dispute_won":
      return 365;
    case "dispute_lost":
    case "policy_slash":
      return null; // no decay
  }
}

function baseValue(e: TruScoreEvent): number {
  switch (e.type) {
    case "job_completed": {
      const band: JobBand = e.jobBand ?? "standard";
      if (band === "micro") return 8;
      if (band === "high") return 15;
      return 12;
    }
    case "job_rating": {
      const s = e.stars ?? 0;
      if (s >= 4) return 3;
      if (s === 3) return 1;
      return 0;
    }
    case "skill_credential":
      return 5;
    case "vouch":
      return 2;
    case "dispute_won":
      return 5;
    case "dispute_lost":
      return -35;
    case "policy_slash":
      return -150;
  }
}

function attestationWeight(kind: AttestationKind): number {
  switch (kind) {
    case "dual_human":
      return 1.0;
    case "oracle_plus_one":
      return 0.85;
    case "issuer_only":
      return 0.5;
    case "self":
      return 0.0;
  }
}

function timeDecay(atIso: string, now: Date, type: TruScoreEventType): number {
  const hl = halfLifeDays(type);
  if (hl == null) return 1;
  const at = new Date(atIso).getTime();
  const ageDays = Math.max(0, (now.getTime() - at) / (1000 * 60 * 60 * 24));
  return Math.pow(2, -ageDays / hl);
}

function bandForScore(score: number): string {
  if (score <= 199) return "Restricted";
  if (score <= 399) return "New";
  if (score <= 599) return "Emerging";
  if (score <= 749) return "Established";
  if (score <= 899) return "Strong";
  return "Exemplary";
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * TruScore v1 — pure function, deterministic for a given event list + asOf.
 * Events should be pre-sorted ascending by time for correct farming logic.
 */
export function computeTruScore(
  events: TruScoreEvent[],
  asOf: Date = new Date()
): TruScoreResult {
  const sorted = [...events].sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()
  );

  let positiveSum = 0;
  let penaltySum = 0;

  // Track prior completions per counterparty (for λ_cp)
  const priorJobsWithCp = new Map<string, number>();

  // Rolling positive contributions for velocity (store {at, contrib})
  const recentPositives: { at: number; contrib: number }[] = [];

  for (const e of sorted) {
    const v = baseValue(e);
    const w = attestationWeight(e.attestation);
    if (w === 0 || v === 0) {
      if (e.type === "job_completed" && e.counterpartyId) {
        priorJobsWithCp.set(
          e.counterpartyId,
          (priorJobsWithCp.get(e.counterpartyId) ?? 0) + 1
        );
      }
      continue;
    }

    const decay = timeDecay(e.at, asOf, e.type);
    const raw = v * w * decay;

    if (isPenalty(e.type)) {
      penaltySum += Math.abs(raw);
      continue;
    }

    // λ_cp
    let lambdaCp = 1;
    if (
      (e.type === "job_completed" || e.type === "job_rating") &&
      e.counterpartyId
    ) {
      const n = priorJobsWithCp.get(e.counterpartyId) ?? 0;
      lambdaCp = 1 / (1 + 0.35 * Math.max(0, n));
    }

    // λ_vel — positives in last 30 days
    const t = new Date(e.at).getTime();
    const windowStart = t - 30 * 24 * 60 * 60 * 1000;
    const g30 = recentPositives
      .filter((r) => r.at >= windowStart && r.at < t)
      .reduce((s, r) => s + r.contrib, 0);
    const room = Math.max(0, GMAX_30D - g30);
    const lambdaVel =
      raw <= 0 ? 1 : Math.min(1, room / Math.max(1e-9, raw));

    // λ_u
    const u = e.uniquenessConfidence;
    const lambdaU = u == null ? 1 : 0.5 + 0.5 * clamp(u, 0, 1);

    const lambda = lambdaCp * lambdaVel * lambdaU;
    const contrib = raw * lambda;

    positiveSum += contrib;
    recentPositives.push({ at: t, contrib });

    if (e.type === "job_completed" && e.counterpartyId) {
      priorJobsWithCp.set(
        e.counterpartyId,
        (priorJobsWithCp.get(e.counterpartyId) ?? 0) + 1
      );
    }
  }

  const score = Math.round(clamp(S0 + positiveSum - penaltySum, 0, 1000));

  return {
    score,
    band: bandForScore(score),
    algorithm: ALGORITHM,
    eventCount: events.length,
    asOf: asOf.toISOString(),
    breakdown: {
      prior: S0,
      positiveSum: Math.round(positiveSum * 100) / 100,
      penaltySum: Math.round(penaltySum * 100) / 100,
    },
  };
}

export { S0, GMAX_30D, ALGORITHM };

export type TruScoreEventType =
  | "job_completed"
  | "job_rating"
  | "skill_credential"
  | "vouch"
  | "dispute_won"
  | "dispute_lost"
  | "policy_slash";

export type AttestationKind = "dual_human" | "oracle_plus_one" | "issuer_only" | "self";

export type JobBand = "micro" | "standard" | "high";

export interface TruScoreEvent {
  id: string;
  type: TruScoreEventType;
  at: string; // ISO timestamp
  /** Counterparty passport/user id for jobs & vouches */
  counterpartyId?: string;
  attestation: AttestationKind;
  /** For job_completed */
  jobBand?: JobBand;
  /** For job_rating: 1–5 */
  stars?: number;
  /** Optional uniqueness confidence 0–1 */
  uniquenessConfidence?: number;
}

export interface TruScoreResult {
  score: number;
  band: string;
  algorithm: "truscore-v1";
  eventCount: number;
  asOf: string;
  breakdown: {
    prior: number;
    positiveSum: number;
    penaltySum: number;
  };
}

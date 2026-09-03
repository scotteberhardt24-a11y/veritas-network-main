import { computeTruScore } from "./computeTruScore";
import type { TruScoreEvent } from "./types";

const events: TruScoreEvent[] = [
  {
    id: "1",
    type: "job_completed",
    at: "2026-06-01T00:00:00.000Z",
    counterpartyId: "client-a",
    attestation: "dual_human",
    jobBand: "standard",
    uniquenessConfidence: 1,
  },
  {
    id: "2",
    type: "job_rating",
    at: "2026-06-02T00:00:00.000Z",
    counterpartyId: "client-a",
    attestation: "dual_human",
    stars: 5,
  },
  {
    id: "3",
    type: "dispute_lost",
    at: "2026-07-01T00:00:00.000Z",
    attestation: "dual_human",
  },
];

console.log(computeTruScore(events));

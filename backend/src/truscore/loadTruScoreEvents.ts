/**
 * TruScore event loader — schema-exact for Veritas prisma models.
 * Sources: Contract (completed), Escrow (released), Review (reviewee).
 import { computeTruScore } from "@veritas/truscore";
import type { TruScoreEvent } from "@veritas/truscore";* Disputes: skipped 
until winnerId exists on Dispute.
 */

import { prisma } from "../database/prisma.js";
import type { TruScoreEvent, JobBand } from "./types.js";

function jobBandFromAmount(amount: number | null | undefined): JobBand {
  if (amount == null || !Number.isFinite(amount)) return "standard";
  if (amount < 100) return "micro";
  if (amount >= 1000) return "high";
  return "standard";
}

function asIso(d: Date | null | undefined): string {
  if (d instanceof Date && !Number.isNaN(d.getTime())) return d.toISOString();
  return new Date().toISOString();
}

/** Contract statuses that mean work finished (adjust if your enum differs) */
const CONTRACT_DONE = new Set([
  "COMPLETED",
  "COMPLETE",
  "DONE",
  "FINISHED",
  "CLOSED",
  "RELEASED",
]);

/** Escrow statuses that mean funds released to worker */
const ESCROW_RELEASED = new Set([
  "RELEASED",
  "COMPLETED",
  "COMPLETE",
  "PAID",
  "SETTLED",
]);

export async function loadTruScoreEvents(
  passportUserId: string
): Promise<TruScoreEvent[]> {
  if (!passportUserId) return [];

  const events: TruScoreEvent[] = [];
  const seen = new Set<string>();

  const push = (e: TruScoreEvent) => {
    if (seen.has(e.id)) return;
    seen.add(e.id);
    events.push(e);
  };

  // -------------------------------------------------------------------------
  // 1) Contracts where this user is the worker and contract is done
  // -------------------------------------------------------------------------
  const contracts = await prisma.contract.findMany({
    where: { workerId: passportUserId },
    select: {
      id: true,
      amount: true,
      status: true,
      clientId: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  for (const c of contracts) {
    const st = String(c.status).toUpperCase();
    if (!CONTRACT_DONE.has(st)) continue;

    push({
      id: `job_completed:contract:${c.id}`,
      type: "job_completed",
      at: asIso(c.updatedAt ?? c.createdAt),
      counterpartyId: c.clientId,
      attestation: "dual_human",
      jobBand: jobBandFromAmount(c.amount),
      uniquenessConfidence: 1,
    });
  }

  // -------------------------------------------------------------------------
  // 2) Escrows released to this worker (strong completion signal)
  // -------------------------------------------------------------------------
  const escrows = await prisma.escrow.findMany({
    where: { workerId: passportUserId },
    select: {
      id: true,
      amount: true,
      status: true,
      clientId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  for (const e of escrows) {
    const st = String(e.status).toUpperCase();
    if (!ESCROW_RELEASED.has(st)) continue;

    push({
      id: `job_completed:escrow:${e.id}`,
      type: "job_completed",
      at: asIso(e.createdAt),
      counterpartyId: e.clientId,
      attestation: "dual_human",
      jobBand: jobBandFromAmount(e.amount),
      uniquenessConfidence: 1,
    });
  }

  // -------------------------------------------------------------------------
  // 3) Reviews received (reviewee = this user)
  // -------------------------------------------------------------------------
  const reviews = await prisma.review.findMany({
    where: { revieweeId: passportUserId },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      reviewerId: true,
    },
    orderBy: { createdAt: "asc" },
  });

  for (const r of reviews) {
    if (r.rating < 1) continue;
    push({
      id: `job_rating:${r.id}`,
      type: "job_rating",
      at: asIso(r.createdAt),
      counterpartyId: r.reviewerId,
      attestation: "dual_human",
      stars: r.rating,
    });
  }

  // -------------------------------------------------------------------------
  // 4) Disputes — NOT scored in v1 (no winnerId on Dispute model)
  // resolvedById is the admin/judge, not the winning party.
  // Add Dispute.winnerId later, then map dispute_won / dispute_lost here.
  // -------------------------------------------------------------------------

  events.sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()
  );

  return events;
}

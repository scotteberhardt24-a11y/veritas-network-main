import { Router, Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { loadTruScoreEvents } from "../truscore/loadTruScoreEvents.js";
import { computeTruScore } from "../truscore/computeTruScore.js";

const router = Router();

function bandFromScore(score: number): string {
  if (score <= 199) return "Restricted";
  if (score <= 399) return "New";
  if (score <= 599) return "Emerging";
  if (score <= 749) return "Established";
  if (score <= 899) return "Strong";
  return "Exemplary";
}

async function buildPassportV1(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      role: true,
      trustScore: true,
      completedJobs: true,
      createdAt: true,
      flagged: true,
    },
  });
  if (!user) return null;

  const events = await loadTruScoreEvents(user.id);
  const tru = computeTruScore(events);

  return {
    schema: "veritas.passport.v1",
    id: user.id,
    subject: {
      userId: user.id,
      username: user.username,
      displayName: null,
      role: user.role,
    },
    trust: {
      score: tru.score,
      band: tru.band ?? bandFromScore(tru.score),
      algorithm: "truscore-v1",
      asOf: tru.asOf,
      breakdown: tru.breakdown,
    },
    stats: {
      completedJobs: user.completedJobs,
      memberSince: user.createdAt.toISOString(),
    },
    verification: {
      level: "UNVERIFIED",
      categories: {
        RELIABILITY: null,
        COMMUNICATION: null,
        DELIVERY: null,
        PAYMENT: null,
        PROFESSIONALISM: null,
      },
    },
    chain: {
      network: "polygon",
      contractAddress: process.env.CONTRACT_ADDRESS || null,
      tokenId: null,
      soulbound: true,
    },
    meta: {
      version: 1,
      issuedAt: new Date().toISOString(),
      expiresAt: null,
      issuer: "veritas-network",
      revoked: !!user.flagged,
    },
  };
}

function buildMetadata(passport: NonNullable<Awaited<ReturnType<typeof buildPassportV1>>>) {
  return {
    name: `Veritas Trust Passport — ${passport.subject.username}`,
    description: `Veritas Network Trust Passport for ${passport.subject.username}. Score ${passport.trust.score} (${passport.trust.band}).`,
    external_url: `${process.env.PUBLIC_APP_URL || "https://veritas.network"}/passport/${passport.subject.username}`,
    attributes: [
      { trait_type: "Trust Score", value: passport.trust.score },
      { trait_type: "Band", value: passport.trust.band },
      { trait_type: "Completed Jobs", value: passport.stats.completedJobs },
      { trait_type: "Algorithm", value: passport.trust.algorithm },
      { trait_type: "Role", value: passport.subject.role },
    ],
    properties: {
      schema: passport.schema,
      username: passport.subject.username,
      trustScore: passport.trust.score,
      soulbound: true,
      network: "Polygon",
    },
  };
}

/** GET /api/passport/:username */
router.get("/:username", async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username || "").trim();
    if (!username) return res.status(400).json({ error: "username required" });
    const passport = await buildPassportV1(username);
    if (!passport) return res.status(404).json({ error: "User not found" });
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.json(passport);
  } catch (err) {
    console.error("[passport] GET error:", err);
    return res.status(500).json({ error: "Failed to load passport" });
  }
});

/** GET /api/passport/:username/metadata */
router.get("/:username/metadata", async (req: Request, res: Response) => {
  try {
router.get("/:username/metadata", ...);
router.get("/:username", ...);
 
   const username = String(req.params.username || "").trim();
    const passport = await buildPassportV1(username);
    if (!passport) return res.status(404).json({ error: "User not found" });
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.json(buildMetadata(passport));
  } catch (err) {
    console.error("[passport] metadata error:", err);
    return res.status(500).json({ error: "Failed to load metadata" });
  }
});

export default router;

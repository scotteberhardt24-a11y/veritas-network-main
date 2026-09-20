import { Router, Request, Response } from "express";
import { SignJWT } from "jose";
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

  let tru: {
    score: number;
    band: string;
    algorithm: string;
    asOf: string;
    breakdown: { prior: number; positiveSum: number; penaltySum: number };
  };

  try {
    const events = await loadTruScoreEvents(user.id);
    const result = computeTruScore(events);
    tru = {
      score: result.score,
      band: result.band ?? bandFromScore(result.score),
      algorithm: result.algorithm ?? "truscore-v1",
      asOf: result.asOf,
      breakdown: result.breakdown,
    };
  } catch {
    // Fallback if events loader fails
    tru = {
      score: user.trustScore,
      band: bandFromScore(user.trustScore),
      algorithm: "truscore-v1",
      asOf: new Date().toISOString(),
      breakdown: { prior: 0, positiveSum: 0, penaltySum: 0 },
    };
  }

  return {
    schema: "veritas.passport.v1" as const,
    id: user.id,
    subject: {
      userId: user.id,
      username: user.username,
      displayName: null as string | null,
      role: user.role,
    },
    trust: {
      score: tru.score,
      band: tru.band,
      algorithm: tru.algorithm,
      asOf: tru.asOf,
      breakdown: tru.breakdown,
    },
    stats: {
      completedJobs: user.completedJobs,
      memberSince: user.createdAt.toISOString(),
    },
    verification: {
      level: "UNVERIFIED" as const,
      categories: {
        RELIABILITY: null,
        COMMUNICATION: null,
        DELIVERY: null,
        PAYMENT: null,
        PROFESSIONALISM: null,
      },
    },
    chain: {
      network: "polygon" as const,
      contractAddress: process.env.CONTRACT_ADDRESS || null,
      tokenId: null as string | null,
      soulbound: true,
    },
    meta: {
      version: 1,
      issuedAt: new Date().toISOString(),
      expiresAt: null as string | null,
      issuer: "veritas-network",
      revoked: !!user.flagged,
    },
  };
}

function buildMetadata(
  passport: NonNullable<Awaited<ReturnType<typeof buildPassportV1>>>
) {
  const appUrl = process.env.PUBLIC_APP_URL || "https://veritas.network";
  return {
    name: `Veritas Trust Passport — ${passport.subject.username}`,
    description: `Veritas Network Trust Passport for 
${passport.subject.username}. Score ${passport.trust.score} 
(${passport.trust.band}).`,
    external_url: `${appUrl}/passport/${passport.subject.username}`,
    attributes: [
      { trait_type: "Trust Score", value: passport.trust.score },
      { trait_type: "Band", value: passport.trust.band },
      { trait_type: "Completed Jobs", value: passport.stats.completedJobs 
},
      { trait_type: "Algorithm", value: passport.trust.algorithm },
      { trait_type: "Role", value: String(passport.subject.role) },
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

/** Legacy: GET /api/passport/metadata/:username */
router.get("/metadata/:username", async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username || "").trim();
    if (!username) return res.status(400).json({ error: "username 
required" });
    const passport = await buildPassportV1(username);
    if (!passport) return res.status(404).json({ error: "User not found" 
});
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.json(buildMetadata(passport));
  } catch (err) {
    console.error("[passport] legacy metadata error:", err);
    return res.status(500).json({ error: "Failed to load metadata" });
  }
});

/** GET /api/passport/:username/metadata */
router.get("/:username/metadata", async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username || "").trim();
    if (!username) return res.status(400).json({ error: "username 
required" });
    const passport = await buildPassportV1(username);
    if (!passport) return res.status(404).json({ error: "User not found" 
});
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.json(buildMetadata(passport));
  } catch (err) {
    console.error("[passport] metadata error:", err);
    return res.status(500).json({ error: "Failed to load metadata" });
  }
});

/** GET /api/passport/:username  (?signed=1 for JWS) */
router.get("/:username", async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username || "").trim();
    if (!username) return res.status(400).json({ error: "username 
required" });

    const passport = await buildPassportV1(username);
    if (!passport) return res.status(404).json({ error: "User not found" 
});

    res.setHeader("Cache-Control", "public, max-age=60");

    if (String(req.query.signed) === "1") {
      const secret = process.env.PASSPORT_SIGNING_SECRET;
      if (!secret || secret.length < 32) {
        return res.status(503).json({ error: "Signing not configured" });
      }
      const jws = await new SignJWT(passport as unknown as Record<string, 
unknown>)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setIssuer("veritas-network")
        .setExpirationTime("7d")
        .sign(new TextEncoder().encode(secret));
      return res.json({ passport, jws });
    }

    return res.json(passport);
  } catch (err) {
    console.error("[passport] GET error:", err);
    return res.status(500).json({ error: "Failed to load passport" });
  }
});

export default router;

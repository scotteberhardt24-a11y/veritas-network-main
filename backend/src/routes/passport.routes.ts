import { Router, Request, Response } from "express";
import { prisma } from "../database/prisma.js";

const router = Router();

function bandFromScore(score: number): string {
  if (score <= 199) return "Restricted";
  if (score <= 399) return "New";
  if (score <= 599) return "Emerging";
  if (score <= 749) return "Established";
  if (score <= 899) return "Strong";
  return "Exemplary";
}

router.get("/:username/metadata", async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username || "").trim();
    if (!username) {
      return res.status(400).json({ error: "username required" });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        trustScore: true,
        role: true,
        completedJobs: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=300");

    return res.json({
      name: "Veritas Trust Passport — " + user.username,
      description:
        "Veritas Network Trust Passport for " +
        user.username +
        ". Score " +
        user.trustScore +
        ".",
      attributes: [
        { trait_type: "Trust Score", value: user.trustScore },
        { trait_type: "Completed Jobs", value: user.completedJobs },
        { trait_type: "Role", value: String(user.role) },
      ],
      properties: {
        schema: "veritas.passport.v1",
        username: user.username,
        trustScore: user.trustScore,
        soulbound: true,
        network: "Polygon",
      },
    });
  } catch (err) {
    console.error("[passport] metadata error:", err);
    return res.status(500).json({ error: "Failed to load metadata" });
  }
});

router.get("/:username", async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username || "").trim();
    if (!username) {
      return res.status(400).json({ error: "username required" });
    }

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

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const score = user.trustScore;
    const contractAddress = process.env.CONTRACT_ADDRESS
      ? process.env.CONTRACT_ADDRESS
      : null;

    res.setHeader("Cache-Control", "public, max-age=60");

    return res.json({
      schema: "veritas.passport.v1",
      id: user.id,
      subject: {
        userId: user.id,
        username: user.username,
        displayName: null,
        role: user.role,
      },
      trust: {
        score: score,
        band: bandFromScore(score),
        algorithm: "truscore-v1",
        asOf: new Date().toISOString(),
        breakdown: { prior: 0, positiveSum: 0, penaltySum: 0 },
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
        contractAddress: contractAddress,
        tokenId: null,
        soulbound: true,
      },
      meta: {
        version: 1,
        issuedAt: new Date().toISOString(),
        expiresAt: null,
        issuer: "veritas-network",
        revoked: Boolean(user.flagged),
      },
    });
  } catch (err) {
    console.error("[passport] GET error:", err);
    return res.status(500).json({ error: "Failed to load passport" });
  }
});

export default router;

const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const { PrismaClient } = require("@prisma/client");
const prisma  = new PrismaClient();
const { mintPassport, buildMetadata } = require("../services/passportService");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const POLYGON_SCAN     = "https://polygonscan.com/token";

// ── POST /api/passport/mint ──
// Mint an NFT Trust Passport for the authenticated user
router.post("/mint", auth, async (req, res) => {
  try {
    const userId       = req.user.userId;
    const { walletAddress } = req.body;

    if (!walletAddress || !walletAddress.startsWith("0x")) {
      return res.status(400).json({ success:false, message:"Valid Ethereum wallet address required" });
    }
    if (!CONTRACT_ADDRESS) {
      return res.status(503).json({ success:false, message:"NFT contract not yet deployed. Coming soon!" });
    }

    const result = await mintPassport(userId, walletAddress);
    return res.json({
      success:  true,
      message:  "Trust Passport minted on Polygon!",
      tokenId:  result.tokenId,
      txHash:   result.txHash,
      scanUrl:  `${POLYGON_SCAN}/${CONTRACT_ADDRESS}?a=${result.walletAddress}`,
      walletAddress: result.walletAddress,
    });
  } catch (err) {
    console.error("[PASSPORT] Mint error:", err);
    return res.status(500).json({ success:false, message: err.message || "Mint failed" });
  }
});

// ── GET /api/passport/metadata/:username ──
// Returns OpenSea-compatible NFT metadata JSON
router.get("/metadata/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id:true, email:true, username:true, trustScore:true, role:true, completedJobs:true, createdAt:true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const metadata = buildMetadata(user, []);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=300"); // 5 min cache
    return res.json(metadata);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── GET /api/passport/status ──
// Check if the authenticated user has a minted passport
router.get("/status", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user   = await prisma.user.findUnique({
      where: { id: userId },
      select: { username:true, trustScore:true, completedJobs:true },
    });
    if (!user) return res.status(404).json({ success:false, message:"User not found" });

    return res.json({
      success:         true,
      contractAddress: CONTRACT_ADDRESS || null,
      contractDeployed:!!CONTRACT_ADDRESS,
      polygonScan:     CONTRACT_ADDRESS ? `${POLYGON_SCAN}/${CONTRACT_ADDRESS}` : null,
      username:        user.username,
      trustScore:      user.trustScore,
      message:         CONTRACT_ADDRESS ? "Contract live on Polygon" : "Contract not yet deployed",
    });
  } catch (err) {
    return res.status(500).json({ success:false, message: err.message });
  }
});

// ── GET /api/passport/badge-image/:username ──
// Returns SVG badge image for NFT metadata
router.get("/badge-image/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: { username },
      select: { trustScore:true },
    });
    const score = user?.trustScore || 500;
    const tier  = score >= 950 ? "ELITE" : score >= 850 ? "EXPERT" : score >= 700 ? "PRO" : "VERIFIED";
    const color = score >= 950 ? "#D4AF37" : score >= 850 ? "#4da6ff" : score >= 700 ? "#a78bfa" : "#00e676";

    const svg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#010812"/>
      <stop offset="100%" stop-color="#030d1e"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5D97A"/>
      <stop offset="100%" stop-color="#8B6914"/>
    </linearGradient>
    <linearGradient id="blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a4a9e"/>
      <stop offset="100%" stop-color="#0d2d6b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <!-- Shield -->
  <path d="M200 40 L350 100 L350 240 Q350 340 200 380 Q50 340 50 240 L50 100 Z" fill="url(#gold)"/>
  <path d="M200 60 L330 113 L330 240 Q330 325 200 360 Q70 325 70 240 L70 113 Z" fill="url(#blue)"/>
  <!-- Checkmark -->
  <circle cx="200" cy="200" r="60" fill="#2eb850"/>
  <polyline points="170,200 190,222 232,170" stroke="#D4AF37" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- VERITAS text -->
  <text x="200" y="120" text-anchor="middle" font-size="28" font-weight="900" fill="#D4AF37" font-family="Arial,sans-serif" letter-spacing="4">VERITAS</text>
  <text x="200" y="148" text-anchor="middle" font-size="18" font-weight="700" fill="white" font-family="Arial,sans-serif">VERIFIED</text>
  <!-- Score ribbon -->
  <rect x="60" y="275" width="280" height="32" rx="6" fill="#2eb850"/>
  <text x="200" y="297" text-anchor="middle" font-size="16" font-weight="900" fill="white" font-family="Arial,sans-serif" letter-spacing="2">TRUST SCORE</text>
  <!-- Score number -->
  <text x="200" y="355" text-anchor="middle" font-size="48" font-weight="900" fill="${color}" font-family="Arial,sans-serif">${score}</text>
  <!-- Username -->
  <text x="200" y="390" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.5)" font-family="Arial,sans-serif">@${username}</text>
</svg>`.replace(/\${color}/g, color).replace(/\${score}/g, score.toString()).replace(/\${username}/g, username).replace(/\${tier}/g, tier);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(svg);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const aiMatcher = require("../services/aiMatcher");

// POST /api/matching/match-workers
// Body: { title, description, budget, timeline }
router.post("/match-workers", auth, async (req, res) => {
  try {
    const { title, description, budget, timeline } = req.body;
    if (!title || !description)
      return res.status(400).json({ success:false, message:"Job title and description are required" });

    const jobDetails = { title, description, budget, timeline };
    const matches    = await aiMatcher.matchWorkersToJob(jobDetails);

    return res.json({ success:true, matches, count: matches.length, analyzedAt: new Date().toISOString() });
  } catch (err) {
    console.error("[MATCH] Error:", err);
    return res.status(500).json({ success:false, message:"Matching failed — please try again." });
  }
});

// GET /api/matching/status — health check
router.get("/status", (req, res) => {
  res.json({ success:true, status:"AI matching engine online", model:"claude-sonnet-4-6" });
});

module.exports = router;

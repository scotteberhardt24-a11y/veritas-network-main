const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
router.get("/status", (req, res) => res.json({ success: true, status: "AI matching online" }));
router.post("/match-workers", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ success: false, message: "Title and description required" });
    return res.json({ success: true, matches: [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router;

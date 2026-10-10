const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const jobs = [];

function getUserId(req) {
  if (!req.user) return null;
  return req.user.id || req.user.userId || null;
}

router.get("/", (req, res) => {
  const status = req.query.status;
  let list = jobs;
  if (status) list = jobs.filter((j) => j.status === status);
  return res.json({ success: true, jobs: list });
});

router.get("/:id", (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });
  return res.json({ success: true, job });
});

router.post("/", auth, (req, res) => {
  const { title, description, budget, currency } = req.body || {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ success: false, message: "title is required" });
  }
  const job = {
    id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim(),
    description: (description || "").trim(),
    budget: Number(budget) || 0,
    currency: currency || "USD",
    status: "open",
    clientId: getUserId(req),
    workerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobs.unshift(job);
  return res.status(201).json({ success: true, job });
});

router.patch("/:id/status", auth, (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });
  const { status } = req.body || {};
  const allowed = [
    "open",
    "funded",
    "in_progress",
    "delivered",
    "released",
    "disputed",
    "cancelled",
  ];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "invalid status", allowed });
  }
  job.status = status;
  job.updatedAt = new Date().toISOString();
  return res.json({ success: true, job });
});

module.exports = router;

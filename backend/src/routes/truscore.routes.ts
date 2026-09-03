import { Router, Request, Response } from "express";

const router = Router();

// Lazy load to avoid circular deps
async function getHelpers() {
  const { loadTruScoreEvents } = await import("../truscore/loadTruScoreEvents.js");
  const { computeTruScore } = await import("../truscore/computeTruScore.js");
  return { loadTruScoreEvents, computeTruScore };
}

/**
 * GET /api/trust/passport/:userId/score
 */
router.get("/passport/:userId/score", async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId || "").trim();
    if (!userId) return res.status(400).json({ error: "userId required" });
    const { loadTruScoreEvents, computeTruScore } = await getHelpers();
    const events = await loadTruScoreEvents(userId);
    const result = computeTruScore(events);
    return res.json({ userId, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "TruScore failed";
    console.error("[truscore] route error:", err);
    return res.status(500).json({ error: message });
  }
});

/**
 * GET /api/trust/me/truscore
 */
router.get("/me/truscore", async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { id?: string } }).user;
    const userId = user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { loadTruScoreEvents, computeTruScore } = await getHelpers();
    const events = await loadTruScoreEvents(userId);
    const result = computeTruScore(events);
    return res.json({ userId, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "TruScore failed";
    console.error("[truscore] me route error:", err);
    return res.status(500).json({ error: message });
  }
});

export default router;

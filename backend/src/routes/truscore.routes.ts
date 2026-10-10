import { Router, Request, Response, NextFunction } from "express";
// CommonJS middleware in JS
// eslint-disable-next-line @typescript-eslint/no-require-imports
const auth = require("../middleware/auth.js");

const router = Router();

type AuthedRequest = Request & {
  user?: { id?: string; userId?: string };
};

async function getHelpers() {
  const { loadTruScoreEvents } = await import("../truscore/loadTruScoreEvents.js");
  const { computeTruScore } = await import("../truscore/computeTruScore.js");
  return { loadTruScoreEvents, computeTruScore };
}

function resolveUserId(req: AuthedRequest): string | null {
  const u = req.user;
  if (!u) return null;
  return (u.id || u.userId || null) as string | null;
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
router.get(
  "/me/truscore",
  auth as (req: Request, res: Response, next: NextFunction) => void,
  async (req: Request, res: Response) => {
    try {
      const userId = resolveUserId(req as AuthedRequest);
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
  }
);

export default router;

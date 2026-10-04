import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma.js";

function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = header.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "veritas_secret";
    const decoded = jwt.verify(token, secret) as Record<string, unknown>;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

const router = Router();

/** POST /api/kyc/start — stub until Persona is configured */
router.post("/start", auth, async (req: Request, res: Response) => {
  try {
    const u = (req as any).user || {};
    const userId = (u.id || u.userId || u.sub) as string | undefined;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Login required" });
    }

    const apiKey = process.env.PERSONA_API_KEY;
    const templateId = process.env.PERSONA_TEMPLATE_ID;
    if (!apiKey || !templateId) {
      return res.status(503).json({
        success: false,
        message: "Identity verification is not configured yet. Coming soon.",
        code: "KYC_NOT_CONFIGURED",
      });
    }

    // Persona path kept for later; not used without keys
    return res.status(503).json({
      success: false,
      message: "Identity verification is not configured yet. Coming soon.",
      code: "KYC_NOT_CONFIGURED",
    });
  } catch (err) {
    console.error("[kyc] start", err);
    return res.status(503).json({
      success: false,
      message: "Identity verification is not configured yet. Coming soon.",
      code: "KYC_NOT_CONFIGURED",
    });
  }
});

router.get("/status", auth, async (req: Request, res: Response) => {
  try {
    const u = (req as any).user || {};
    const userId = (u.id || u.userId || u.sub) as string | undefined;
    if (!userId) return res.status(401).json({ error: "Login required" });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        verificationLevel: true,
        kycVerifiedAt: true,
        kycProvider: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("[kyc] status", err);
    return res.status(500).json({ error: "status failed" });
  }
});

export default router;

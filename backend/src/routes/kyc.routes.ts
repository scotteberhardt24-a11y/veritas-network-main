import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma.js";
import crypto from "crypto";

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

/**
 * POST /api/kyc/start
 * Requires: authenticated user (adapt to your auth middleware).
 * Body: optional { redirectUri?: string }
 * Creates Persona inquiry and returns hosted URL.
 */
router.post("/start", auth, async (req: Request, res: Response) => {
  try {
    // TODO: replace with your real auth (req.user.id)
    const u = (req as any).user || {};
    const userId = (u.id || u.userId || u.sub) as string | undefined;
    if (!userId) {
      return res.status(401).json({ error: "Login required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.verificationLevel === "ID_VERIFIED") {
      return res.json({ status: "already_verified" });
    }

    const apiKey = process.env.PERSONA_API_KEY;
    const templateId = process.env.PERSONA_TEMPLATE_ID;
    if (!apiKey || !templateId) {
      return res.status(500).json({ error: "KYC not configured" });
    }

    const redirectUri =
      (req.body && req.body.redirectUri) ||
      `${process.env.PUBLIC_APP_URL || "http://localhost:3000"}/passport/verify-done`;

    const personaRes = await fetch("https://withpersona.com/api/v1/inquiries", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Persona-Version": "2023-01-05",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            "inquiry-template-id": templateId,
            "redirect-uri": redirectUri,
            "reference-id": user.id,
          },
        },
      }),
    });

    const data = (await personaRes.json()) as any;
    if (!personaRes.ok) {
      console.error("[kyc] persona error", data);
      return res.status(502).json({ error: "Failed to start KYC", detail: data });
    }

    const inquiryId = data?.data?.id as string;
    const fields = data?.data?.attributes || {};
    // Hosted flow URL pattern varies; dashboard docs may use session token UI.
    // Common: use inquiry id with Persona embedded/hosted link from their docs.
    const hostedUrl =
      fields["hosted-flow-url"] ||
      fields.hosted_flow_url ||
      `https://withpersona.com/verify?inquiry-id=${inquiryId}`;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationLevel: "ID_PENDING",
        kycProvider: "persona",
        kycInquiryId: inquiryId,
      },
    });

    return res.json({
      inquiryId,
      url: hostedUrl,
      status: "ID_PENDING",
    });
  } catch (err) {
    console.error("[kyc] start", err);
    return res.status(500).json({ error: "KYC start failed" });
  }
});

/**
 * POST /api/kyc/webhook
 * Persona sends inquiry events. Verify signature in production.
 */
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    // Production: verify PERSONA_WEBHOOK_SECRET signature from headers.
    const event = req.body;
    const inquiryId =
      event?.data?.id ||
      event?.data?.attributes?.inquiry_id ||
      event?.data?.relationships?.inquiry?.data?.id;

    const status =
      event?.data?.attributes?.status ||
      event?.data?.attributes?.["status"] ||
      "";

    if (!inquiryId) {
      return res.status(400).json({ error: "missing inquiry id" });
    }

    const user = await prisma.user.findFirst({
      where: { kycInquiryId: String(inquiryId) },
    });
    if (!user) {
      console.warn("[kyc] webhook unknown inquiry", inquiryId);
      return res.json({ ok: true });
    }

    const normalized = String(status).toLowerCase();
    if (normalized === "completed" || normalized === "approved") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationLevel: "ID_VERIFIED",
          kycVerifiedAt: new Date(),
        },
      });
    } else if (
      normalized === "failed" ||
      normalized === "declined" ||
      normalized === "needs_review"
    ) {
      // treat needs_review as pending or failed per your policy
      if (normalized !== "needs_review") {
        await prisma.user.update({
          where: { id: user.id },
          data: { verificationLevel: "ID_FAILED" },
        });
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("[kyc] webhook", err);
    return res.status(500).json({ error: "webhook failed" });
  }
});

/**
 * GET /api/kyc/status
 * Auth required — returns current verification level.
 */
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

const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma  = new PrismaClient();

const JWT_SECRET  = process.env.JWT_SECRET || "veritas_secret";
const JWT_EXPIRES = "30d";

function makeToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name || user.username || null,
    email: user.email,
    username: user.username,
    role: user.role,
    trustScore: user.trustScore,
  };
}

async function sendWelcomeEmail(name, email) {
  try {
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) {
      console.log("[EMAIL] Welcome email would be sent to " + email);
      return;
    }
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + RESEND_KEY,
      },
      body: JSON.stringify({
        from: "Veritas Network <welcome@veritas.network>",
        to: email,
        subject: "Welcome to Veritas Network",
        html: "<p>Welcome, " + (name || "there") + "! Your Veritas account is ready.</p>",
      }),
    });
  } catch (err) {
    console.error("[EMAIL] Failed:", err.message);
  }
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "WORKER" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const base = (name || email.split("@")[0] || "user")
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/[^a-z0-9.]/g, "") || "user";
    let username = base;
    let counter = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = base + counter++;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userRole = String(role).toUpperCase() === "CLIENT" ? "CLIENT" : "WORKER";

    // Build data without name first; add name only if schema supports it
    const data = {
      email,
      username,
      passwordHash,
      role: userRole,
      trustScore: 50,
    };
    if (name) {
      data.name = name;
    }

    let user;
    try {
      user = await prisma.user.create({ data });
    } catch (e) {
      // Retry without name if unknown argument
      if (String(e.message || e).includes("name") || String(e.code) === "P2009") {
        delete data.name;
        user = await prisma.user.create({ data });
      } else {
        throw e;
      }
    }

    try {
      await prisma.wallet.create({
        data: {
          userId: user.id,
          address: "0x" + String(user.id).replace(/-/g, ""),
          balance: 0,
        },
      });
    } catch (_) {}

    const token = makeToken(user.id);

    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (_) {}

    sendWelcomeEmail(name || username, email);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: publicUser(user),
    });
  } catch (err) {
    console.error("[AUTH] Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      detail: process.env.NODE_ENV === "production" ? undefined : String(err.message || err),
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "No account found with this email" });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = makeToken(user.id);

    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (_) {}

    return res.json({
      success: true,
      token,
      user: publicUser(user),
    });
  } catch (err) {
    console.error("[AUTH] Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      detail: process.env.NODE_ENV === "production" ? undefined : String(err.message || err),
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const id = (req.user && (req.user.userId || req.user.id)) || null;
    if (!id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        trustScore: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        ...user,
        name: user.username,
      },
    });
  } catch (err) {
    console.error("[AUTH] getMe error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ success: true, message: "If this email exists, a reset link has been sent." });
    }

    const resetToken = jwt.sign({ userId: user.id, type: "reset" }, JWT_SECRET, { expiresIn: "1h" });
    const front = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = front + "/reset-password?token=" + resetToken;

    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + RESEND_KEY,
        },
        body: JSON.stringify({
          from: "Veritas Network <noreply@veritas.network>",
          to: email,
          subject: "Reset your Veritas password",
          html: "<p><a href=\"" + resetUrl + "\">Reset Password</a></p>",
        }),
      });
    } else {
      console.log("[EMAIL] Password reset link: " + resetUrl);
    }

    return res.json({ success: true, message: "If this email exists, a reset link has been sent." });
  } catch (err) {
    console.error("[AUTH] Forgot password error:", err);
    return res.status(500).json({ success: false, message: "Failed to send reset email" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and password required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "reset") {
      throw new Error("Invalid token type");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passwordHash },
    });
    await prisma.session.deleteMany({ where: { userId: decoded.userId } });

    return res.json({ success: true, message: "Password reset successfully. Please log in." });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }
};

const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma  = new PrismaClient();

const JWT_SECRET  = process.env.JWT_SECRET || "veritas_secret";
const JWT_EXPIRES = "30d";
const RESEND_KEY  = process.env.RESEND_API_KEY;
const FRONTEND    = process.env.FRONTEND_URL || "http://localhost:3000";

function makeToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

async function sendEmail(to, subject, html) {
  if (!RESEND_KEY) { console.log(`[EMAIL] No key — would send to ${to}: ${subject}`); return; }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({ from: "Veritas Network <welcome@veritas.network>", to, subject, html }),
    });
    const d = await r.json();
    console.log(`[EMAIL] Sent to ${to}:`, d.id || d.error);
  } catch (e) { console.error("[EMAIL] Failed:", e.message); }
}

// ── REGISTER ──
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "WORKER" } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success:false, message:"Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ success:false, message:"Password must be at least 6 characters" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ success:false, message:"An account with this email already exists" });

    // Generate unique username
    let username = name.toLowerCase().replace(/\s+/g,".").replace(/[^a-z0-9.]/g,"");
    let counter = 1;
    while (await prisma.user.findUnique({ where: { username } })) username = `${username}${counter++}`;

    const passwordHash = await bcrypt.hash(password, 12);
    const userRole = role.toUpperCase() === "CLIENT" ? "CLIENT" : "WORKER";

    const user = await prisma.user.create({
      data: { name, email, username, passwordHash, role: userRole, trustScore: 50 },
    });

    // Create wallet
    await prisma.wallet.create({
      data: { userId: user.id, address: `0x${user.id.replace(/-/g,"")}`, balance: 0 }
    }).catch(() => {});

    const token = makeToken(user.id);

    await prisma.session.create({
      data: { userId: user.id, token, expiresAt: new Date(Date.now() + 30*24*60*60*1000) }
    }).catch(() => {});

    // Welcome email
    sendEmail(email, "Welcome to Veritas Network 🛡️", `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#010812;color:white;padding:32px;border-radius:16px;">
        <h1 style="color:#1a6bff;margin:0 0 4px;">VERITAS</h1>
        <p style="color:#00d4ff;font-size:0.75rem;letter-spacing:0.2em;margin:0 0 24px;">TRUTH BECOMES TRUST</p>
        <h2 style="color:white;">Welcome, ${name}! 👋</h2>
        <p style="color:rgba(255,255,255,0.7);line-height:1.7;">Your Veritas account is live. Here's what you need:</p>
        <div style="background:rgba(26,107,255,0.1);border:1px solid rgba(26,107,255,0.2);border-radius:12px;padding:20px;margin:20px 0;">
          <p style="margin:4px 0;color:rgba(255,255,255,0.6);">📧 Email: <strong style="color:white;">${email}</strong></p>
          <p style="margin:4px 0;color:rgba(255,255,255,0.6);">👤 Username: <strong style="color:white;">@${username}</strong></p>
          <p style="margin:4px 0;color:rgba(255,255,255,0.6);">🛡️ Trust Score: <strong style="color:#00e676;">50 (starting score)</strong></p>
          <p style="margin:4px 0;color:rgba(255,255,255,0.6);">🏆 Badge: <strong style="color:#f0c040;">New Member — just earned!</strong></p>
        </div>
        <p style="color:rgba(255,255,255,0.6);margin-bottom:8px;">Next steps to grow your Trust Score:</p>
        <p style="color:rgba(255,255,255,0.5);margin:4px 0;">✅ Complete your profile <strong style="color:#00e676;">+25 pts</strong></p>
        <p style="color:rgba(255,255,255,0.5);margin:4px 0;">🪪 Verify your identity <strong style="color:#00e676;">+50 pts</strong></p>
        <p style="color:rgba(255,255,255,0.5);margin:4px 0;">💼 Complete your first job <strong style="color:#00e676;">+100 pts</strong></p>
        <div style="text-align:center;margin-top:28px;">
          <a href="${FRONTEND}/dashboard" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#1a6bff,#0050dd);color:white;text-decoration:none;border-radius:10px;font-weight:700;">Go to Dashboard →</a>
        </div>
        <p style="color:rgba(255,255,255,0.3);font-size:0.72rem;text-align:center;margin-top:24px;">Veritas Network · Truth Becomes Trust</p>
      </div>
    `);

    return res.status(201).json({
      success: true,
      message: "Account created! Check your email for your welcome message.",
      token,
      user: { id:user.id, name:user.name, email:user.email, username:user.username, role:user.role, trustScore:user.trustScore },
    });
  } catch (err) {
    console.error("[AUTH] Register error:", err);
    return res.status(500).json({ success:false, message:"Registration failed — please try again." });
  }
};

// ── LOGIN ──
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success:false, message:"Email and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ success:false, message:"No account found with this email" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ success:false, message:"Incorrect password — please try again" });

    const token = makeToken(user.id);
    await prisma.session.create({
      data: { userId:user.id, token, expiresAt: new Date(Date.now() + 30*24*60*60*1000) }
    }).catch(() => {});

    return res.json({
      success: true,
      token,
      user: { id:user.id, name:user.name, email:user.email, username:user.username, role:user.role, trustScore:user.trustScore },
    });
  } catch (err) {
    console.error("[AUTH] Login error:", err);
    return res.status(500).json({ success:false, message:"Login failed — please try again." });
  }
};

// ── GET ME ──
exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId || req.user?.id },
      select: { id:true, name:true, email:true, username:true, role:true, trustScore:true, skills:true, hourlyRate:true, availability:true, completedJobs:true, createdAt:true },
    });
    if (!user) return res.status(404).json({ success:false, message:"User not found" });
    return res.json({ success:true, user });
  } catch (err) {
    return res.status(500).json({ success:false, message:"Failed to fetch user" });
  }
};

// ── FORGOT PASSWORD ──
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ success:true, message:"If this email exists, a reset link has been sent." });

    const resetToken = jwt.sign({ userId:user.id, type:"reset" }, JWT_SECRET, { expiresIn:"1h" });
    const resetUrl   = `${FRONTEND}/reset-password?token=${resetToken}`;

    await sendEmail(email, "Reset your Veritas password", `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#010812;color:white;border-radius:16px;">
        <h2 style="color:#1a6bff;">Reset Your Password</h2>
        <p style="color:rgba(255,255,255,0.7);line-height:1.7;">Click the button below to reset your password. This link expires in 1 hour.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${resetUrl}" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#1a6bff,#0050dd);color:white;text-decoration:none;border-radius:10px;font-weight:700;">Reset Password →</a>
        </div>
        <p style="color:rgba(255,255,255,0.4);font-size:0.8rem;">If you didn't request this, ignore this email. Your password won't change.</p>
      </div>
    `);

    return res.json({ success:true, message:"If this email exists, a reset link has been sent." });
  } catch (err) {
    console.error("[AUTH] Forgot password error:", err);
    return res.status(500).json({ success:false, message:"Failed to send reset email" });
  }
};

// ── RESET PASSWORD ──
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ success:false, message:"Token and password required" });
    if (password.length < 6)
      return res.status(400).json({ success:false, message:"Password must be at least 6 characters" });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "reset") throw new Error("Invalid token");

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where:{ id:decoded.userId }, data:{ passwordHash } });
    await prisma.session.deleteMany({ where:{ userId:decoded.userId } });

    return res.json({ success:true, message:"Password reset successfully — please log in." });
  } catch (err) {
    return res.status(400).json({ success:false, message:"Invalid or expired reset link — please request a new one." });
  }
};

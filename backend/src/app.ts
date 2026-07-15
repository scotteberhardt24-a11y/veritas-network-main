import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import escrowRoutes from "./routes/escrowRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import trustRoutes from "./routes/trustRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import matchingRoutes from "./routes/matchingRoutes.js";



const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);

app.use(helmet());

app.use(compression());

app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200
  })
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString()
  });
});




app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/trust", trustRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/matching", matchingRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", name: "Veritas API v1" });
});

export default app;

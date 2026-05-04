require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { prisma } = require("db");

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "iitkgp_professor_admin";
const ADMIN_KEY = process.env.ADMIN_KEY || "conf2026admin";
const NODE_ENV = process.env.NODE_ENV || "development";

// ── CORS Configuration ───────────────────────────────────────────────────────
const corsOptions = {
  origin: NODE_ENV === "production" ? true : "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Serve Static Files (Frontend) ────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "../conference/dist")));


// ── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── POST /api/register ───────────────────────────────────────────────────────
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, institution, theme, presentationType, presentationTitle } = req.body;

    if (!name || !email || !phone || !institution) {
      return res.status(400).json({
        error: "validation_error",
        message: "name, email, phone, and institution are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "validation_error", message: "Invalid email address." });
    }

    const existing = await prisma.registration.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "duplicate_email", message: "This email is already registered." });
    }

    const registration = await prisma.registration.create({
      data: {
        name:              name.trim(),
        email:             email.trim().toLowerCase(),
        phone:             phone.trim(),
        institution:       institution.trim(),
        theme:             theme?.trim() || null,
        presentationType:  presentationType || "attendee",
        presentationTitle: presentationTitle?.trim() || null,
      },
    });

    console.log(`[REGISTER] ${registration.name} (${registration.email}) — ${registration.presentationType}`);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: { id: registration.id, name: registration.name, email: registration.email, createdAt: registration.createdAt },
    });
  } catch (error) {
    console.error("[REGISTER] Error:", error.message, error.stack);
    return res.status(500).json({ error: "server_error", message: "Something went wrong: " + error.message });
  }
});

// ── GET /api/registrations (Admin) ───────────────────────────────────────────
app.get("/api/registrations", async (req, res) => {
  try {
    const { adminKey } = req.query;
    if (adminKey !== ADMIN_KEY) {
      return res.status(401).json({ error: "unauthorized", message: "Invalid admin key." });
    }
    const registrations = await prisma.registration.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ success: true, total: registrations.length, data: registrations });
  } catch (error) {
    console.error("[REGISTRATIONS] Error:", error);
    return res.status(500).json({ error: "server_error", message: "Failed to fetch registrations." });
  }
});

// ── POST /api/admin/login ────────────────────────────────────────────────────
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "validation_error", message: "Password is required." });
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "invalid_credentials", message: "Invalid password." });
  return res.json({ success: true, adminKey: ADMIN_KEY });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  return res.status(500).json({ error: "server_error", message: "Internal server error: " + err.message });
});

// ── Catch-All SPA Handler (for React Router) ─────────────────────────────────
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../conference/dist/index.html"));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(
    `\n🚀 API Server running at http://localhost:${PORT}\n📱 Frontend served from ${path.join(__dirname, "../conference/dist")}\n`
  );
});


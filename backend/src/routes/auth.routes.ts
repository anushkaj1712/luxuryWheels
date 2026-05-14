import { Router } from "express";
import { authLimiter } from "../middleware/rateLimit.middleware";
import { AuthService } from "../services/auth.service";
import { requireAuth } from "../middleware/auth.middleware";

const r = Router();
const authService = new AuthService();

/**
 * POST /api/auth/register — email/password onboarding.
 */
r.post("/register", authLimiter, async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body ?? {};
    if (!email || !password || !name) return res.status(400).json({ message: "Missing fields" });
    const result = await authService.register({ email, password, name, phone });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/auth/login — returns JWT for Authorization header.
 */
r.post("/login", authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });
    const result = await authService.login({ email, password });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/auth/me — current user profile (requires JWT).
 */
r.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await authService.me(req.user!.sub);
    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/auth/forgot-password — triggers reset token (email in production).
 */
r.post("/forgot-password", authLimiter, async (req, res, next) => {
  try {
    const { email } = req.body ?? {};
    if (!email) return res.status(400).json({ message: "Email required" });
    const result = await authService.requestPasswordReset(email);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/auth/reset-password — consumes reset token from email link.
 */
r.post("/reset-password", authLimiter, async (req, res, next) => {
  try {
    const { token, password } = req.body ?? {};
    if (!token || !password) return res.status(400).json({ message: "Missing fields" });
    await authService.resetPassword(token, password);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/auth/google — placeholder: redirect to Google OAuth consent screen.
 * Wire passport-google-oauth20 or similar; set GOOGLE_CLIENT_ID/SECRET.
 */
r.get("/google", (_req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(501).json({ message: "Google OAuth not configured on server" });
  }
  const redirect = encodeURIComponent(process.env.GOOGLE_CALLBACK_URL ?? "");
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(url);
});

export const authRouter = r;

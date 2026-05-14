import rateLimit from "express-rate-limit";

/**
 * Global API rate limit — protects brute-force on auth & scraping.
 * Tune `windowMs` / `max` per route group in production.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

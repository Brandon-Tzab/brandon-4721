import rateLimit from "express-rate-limit";

export function createLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: { error: "Demasiados intentos, intenta más tarde" },
  });
}

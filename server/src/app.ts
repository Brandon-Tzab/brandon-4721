import "dotenv/config";
import cors from "cors";
import express, { type Request, type Response, type NextFunction } from "express";
import { authRouter } from "./routes/auth.routes.js";
import { snailpayRouter } from "./routes/snailpay.routes.js";
import { createLimiter } from "./middleware/rateLimiter.js";

const app = express();
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

const authLimiter = createLimiter();
const snailpayLimiter = createLimiter();


app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use("/api/auth", authLimiter, authRouter);
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/snailpay", snailpayLimiter, snailpayRouter);
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error no manejado:", err);
  res.status(400).json({ error: "Solicitud inválida" });
});

export default app;
import "dotenv/config";
import cors from "cors";
import express, { type Request, type Response, type NextFunction } from "express";
import { authRouter } from "./routes/auth.routes.js";
import rateLimit from "express-rate-limit";

const app = express();


const port = Number(process.env.PORT) || 4000;
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { error: "Demasiados intentos, intenta más tarde" },
});

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.use("/api/auth", authLimiter, authRouter);



app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error no manejado:", err);
  res.status(400).json({ error: "Solicitud inválida" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

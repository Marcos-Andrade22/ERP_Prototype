import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import itensRouter from "./routes/itens";
import kitsRouter from "./routes/kits";
import mlbRouter from "./routes/mlb";
import campoEstilosRouter from "./routes/campo-estilos";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3333;

const allowedOrigins: (string | RegExp)[] = [
  "http://localhost:5173",
  "http://localhost:4173",
  /\.vercel\.app$/,
  process.env.FRONTEND_URL,
].filter(Boolean) as (string | RegExp)[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const permitido = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin,
      );

      if (permitido) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado: ${origin}`));
      }
    },
  }),
);

app.use(express.json());

app.get("/ping", (_req, res) => {
  res.json({ ok: true, message: "Backend online 🟢" });
});

app.use("/itens", itensRouter);
app.use("/kits", kitsRouter);
app.use("/mlb", mlbRouter);
app.use("/itens/:itemId/estilos", campoEstilosRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});

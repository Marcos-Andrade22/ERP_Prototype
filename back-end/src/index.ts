import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import itensRouter from "./routes/itens";
import kitsRouter from "./routes/kits";
import itensMLBRouter from "./routes/itens-mlb";
import kitsMLBRouter from "./routes/kits-mlb";
import campoEstilosRouter from "./routes/campo-estilos";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3333;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/ping", (_req, res) => {
  res.json({ ok: true, message: "Backend online 🟢" });
});

app.use("/itens", itensRouter);
app.use("/kits", kitsRouter);
app.use("/itens/:itemId/mlb", itensMLBRouter);
app.use("/kits/:kitId/mlb", kitsMLBRouter);
app.use("/itens/:itemId/estilos", campoEstilosRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});

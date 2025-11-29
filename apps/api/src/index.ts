import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import healthRouter from "./routes/health";
import lqeRouter from "./routes/lqe";
import { authMiddleware } from "./middlewares/auth";

const app = express();

app.use(
  cors({
    origin: "*", // tighten later
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Public routes
app.use("/api", healthRouter);

// Protected routes
app.use("/api/lqe", authMiddleware, lqeRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(
    `[API] Listening on http://localhost:${env.port} (worker: ${env.lqeWorkerUrl})`
  );
});

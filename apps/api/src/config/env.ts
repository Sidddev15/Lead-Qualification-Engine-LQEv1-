import dotenv from "dotenv";

dotenv.config();

const get = (key: string, defaultValue?: string): string => {
  const v = process.env[key] ?? defaultValue;
  if (v === undefined) {
    throw new Error(`Missing env var: ${key}`);
  }
  return v;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(get("API_PORT", "4000")),
  lqeWorkerUrl: get("LQE_WORKER_URL", "http://localhost:8000"),
  apiKey: get("API_KEY", "dev-secret-key-123"),
};

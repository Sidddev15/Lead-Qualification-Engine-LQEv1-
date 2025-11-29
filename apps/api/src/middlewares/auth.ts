import { RequestHandler } from "express";
import { env } from "../config/env";

export const authMiddleware: RequestHandler = (req, res, next) => {
  // during dev skipping auth
  if (env.nodeEnv === "development") {
    return next();
  }

  const key = req.header("x-api-key");
  if (!key || key !== env.apiKey) {
    return res.status(401).json({
      error: {
        message: "unauthorized",
        status: 401,
      },
    });
  }

  return next();
};

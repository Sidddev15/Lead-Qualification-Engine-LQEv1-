import express from "express";
import request from "supertest";
import { vi, afterEach, describe, expect, it } from "vitest";
import cors from "cors";
import lqeRouter from "../src/routes/lqe";
import type { Request, Response, NextFunction } from "express";

// Mock the FastAPI worker call so the test stays local.
const mockPost = vi.hoisted(() =>
  vi.fn().mockResolvedValue({
    data: {
      runId: "run-123",
      leads: [
        {
          id: "lead-1",
          companyName: "EEC Filters Pvt Ltd",
          tier: "WARM",
          scores: { finalScore: 75 },
        },
      ],
      meta: { totalCompanies: 1 },
    },
  })
);

vi.mock("axios", () => ({
  default: {
    post: mockPost,
  },
}));

afterEach(() => {
  mockPost.mockClear();
});

describe("LQE Manual Flow", () => {
  it("runs manual LQE pipeline", async () => {
    // Find the POST /run handler from the router stack (skip multer middleware)
    const routeLayer = lqeRouter.stack.find(
      (layer: any) => layer.route?.path === "/run"
    );
    const handler = routeLayer.route.stack[routeLayer.route.stack.length - 1]
      .handle as (req: Request, res: Response, next: NextFunction) => any;

    const req = {
      body: { inputMode: "manual", manualCompanies: "EEC Filters Pvt Ltd" },
      files: [],
    } as unknown as Request;

    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as unknown as Response;
    const next = vi.fn();

    await handler(req, res, next);

    expect(status).not.toHaveBeenCalled(); // router returns 200 by default
    expect(json).toHaveBeenCalledTimes(1);
    const payload = json.mock.calls[0][0];
    expect(payload.leads.length).toBe(1);
    expect(payload.leads[0]).toHaveProperty("tier");
    expect(mockPost).toHaveBeenCalled();
  });
});

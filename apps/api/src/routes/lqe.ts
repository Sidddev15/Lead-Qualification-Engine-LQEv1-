import { Router } from "express";
import multer from "multer";
import axios from "axios";
import { env } from "../config/env";
import type { LQERunRequest, LQERunResponse, InputMode } from "../types/lqe";

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "/tmp/lqe-uploads"); // make this directory in dev
    },
    filename: (_req, file, cb) => {
      const ts = Date.now();
      cb(null, `${ts}-${file.originalname}`);
    },
  }),
});

const router = Router();

/**
 * POST /api/lqe/run
 *
 * Supports 3 modes using multipart/form-data:
 * - inputMode=manual   + manualCompanies="c1, c2, c3"
 * - inputMode=pdf_zip  + file(s) = PDFs or ZIP
 * - inputMode=excel    + file(s) = Excel
 */

router.post(
  "/run",
  upload.array("files", 20), // field name `files` from frontend
  async (req, res, next) => {
    try {
      const inputMode = (req.body.inputMode ?? "").toString() as InputMode;

      if (!["manual", "pdf_zip", "excel"].includes(inputMode)) {
        return res.status(400).json({
          error: { message: "Invalid inputMode. Use manual|pdf_zip|excel." },
        });
      }

      const files = (req.files ?? []) as Express.Multer.File[];

      let payload: LQERunRequest;

      if (inputMode === "manual") {
        const raw = (req.body.manualCompanies ?? "").toString();
        const companies = raw
          .split(/[\n,]+/)
          .map((c: string) => c.trim())
          .filter(Boolean);

        if (companies.length === 0) {
          return res.status(400).json({
            error: { message: "manualCompanies is required for manual mode." },
          });
        }

        payload = {
          inputMode,
          companies,
        };
      } else {
        if (!files.length) {
          return res.status(400).json({
            error: { message: "At least one file is required for this mode." },
          });
        }

        payload = {
          inputMode,
          uploadContext: {
            storage: "local-temp",
            files: files.map((f) => ({
              fileName: f.filename, // renamed to match type
              originalName: f.originalname,
              mimeType: f.mimetype,
            })),
          },
        };
      }

      // Call FastAPI worker
      const workerResp = await axios.post<LQERunResponse>(
        `${env.lqeWorkerUrl}/pipeline/run`,
        payload,
        {
          timeout: 20_000,
        }
      );

      return res.json(workerResp.data);
    } catch (err) {
      return next(err);
    }
  }
);

export default router;

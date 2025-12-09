// apps/web/app/page.tsx
"use client";

import { useState } from "react";
import FileUploader from "../components/upload/FileUploader";
import ManualInput from "../components/upload/ManualInput";
import RunButton from "../components/upload/RunButton";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default function HomePage() {
  const [mode, setMode] = useState<"manual" | "pdf_zip" | "excel">("manual");
  const [manual, setManual] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold">Lead Qualification Engine (LQE v1)</h1>
      <p className="text-sm text-slate-400">
        Upload PDFs / ZIP / Excel or manually input companies.
      </p>

      <Card className="p-6 bg-slate-900 border-slate-800">
        <h2 className="text-xl font-semibold mb-4">
          Step 1 — Select Input Mode
        </h2>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              mode === "manual" ? "bg-blue-600" : "bg-slate-700"
            }`}
            onClick={() => setMode("manual")}
          >
            Manual
          </button>
          <button
            className={`px-4 py-2 rounded ${
              mode === "pdf_zip" ? "bg-blue-600" : "bg-slate-700"
            }`}
            onClick={() => setMode("pdf_zip")}
          >
            PDF/ZIP
          </button>
          <button
            className={`px-4 py-2 rounded ${
              mode === "excel" ? "bg-blue-600" : "bg-slate-700"
            }`}
            onClick={() => setMode("excel")}
          >
            Excel
          </button>
        </div>

        <Separator className="my-4" />

        {mode === "manual" && (
          <ManualInput value={manual} onChange={setManual} />
        )}

        {mode !== "manual" && <FileUploader onFilesSelected={setFiles} />}

        <RunButton
          mode={mode}
          manualCompanies={manual}
          files={files}
          onResult={setResult}
        />
      </Card>

      {result && (
        <Card className="p-4 bg-slate-900 border-slate-700">
          <h2 className="text-xl font-semibold">LQE Result Preview</h2>
          <pre className="text-xs mt-3 p-3 bg-slate-800 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </main>
  );
}

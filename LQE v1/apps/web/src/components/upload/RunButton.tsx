"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

interface Props {
  mode: "manual" | "pdf_zip" | "excel";
  manualCompanies: string;
  files: File[];
  onResult?: (data: any) => void;
}

export default function RunButton({
  mode,
  manualCompanies,
  files,
  onResult,
}: Props) {
  const mutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append("inputMode", mode);

      if (mode === "manual") {
        form.append("manualCompanies", manualCompanies);
      } else {
        files.forEach((f) => form.append("files", f));
      }

      const res = await api.post("/api/lqe/run", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Store results for /lqe/results page
      localStorage.setItem("lqe_result", JSON.stringify(data));

      // Allow preview on the current page
      if (onResult) onResult(data);

      // Redirect to results UI
      window.location.href = "/lqe/results";
    },
  });

  return (
    <Button
      className="border border-slate-400 rounded mt-5"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? "Processing..." : "Run LQE"}
    </Button>
  );
}

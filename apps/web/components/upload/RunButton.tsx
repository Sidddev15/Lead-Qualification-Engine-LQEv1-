// apps/web/components/upload/RunButton.tsx
"use client";

import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/api-client";

interface Props {
  mode: "manual" | "pdf_zip" | "excel";
  manualCompanies: string;
  files: File[];
  onResult: (data: any) => void;
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
    onSuccess: (data) => onResult(data),
  });

  return (
    <Button
      className="mt-4"
      variant="outline"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? "Processing..." : "Run LQE"}
    </Button>
  );
}

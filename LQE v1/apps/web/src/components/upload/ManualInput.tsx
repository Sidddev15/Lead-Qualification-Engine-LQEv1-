// apps/web/components/upload/ManualInput.tsx
"use client";

import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function ManualInput({ value, onChange }: Props) {
  return (
    <div className="my-4">
      <label
        htmlFor="manualCompanies"
        className="text-sm text-slate-300 mb-2 block"
      >
        Enter company names (comma or newline separated)
      </label>
      <Textarea
        id="manualCompanies"
        className="h-40 w-full resize-none bg-slate-900 border border-slate-100 rounded text-slate-200 p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

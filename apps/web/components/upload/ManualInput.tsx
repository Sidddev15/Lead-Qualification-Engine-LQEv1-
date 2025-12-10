// apps/web/components/upload/ManualInput.tsx
"use client";

import { Textarea } from "../ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function ManualInput({ value, onChange }: Props) {
  return (
    <div className="my-4">
      <label className="text-sm text-slate-300 mb-2 block">
        Enter company names (comma or newline separated)
      </label>
      <Textarea
        className="h-40 bg-slate-900 border-slate-700 text-slate-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

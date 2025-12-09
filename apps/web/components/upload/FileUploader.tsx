"use client";

import { useState } from "react";
import { Input } from "../ui/input";

interface Props {
  onFilesSelected: (files: File[]) => void;
}

export default function FileUploader({ onFilesSelected }: Props) {
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
    onFilesSelected(selected);
  };

  return (
    <div className="my-4">
      <Input type="file" multiple accept=".pdf, .zip, .xlsx, .xls, .csv" />
      {files.length > 0 && (
        <p className="text-sm text-slate-400 mt-2">
          {files.length} file(s) selected
        </p>
      )}
    </div>
  );
}

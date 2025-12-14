"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface Props {
  onFilesSelected: (files: File[]) => void;
}

export default function FileUploader({ onFilesSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
    onFilesSelected(selected);
  };

  return (
    <div className="space-y-3">
      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.zip,.xlsx,.xls,.csv"
        onChange={handleChange}
        className="hidden"
      />

      {/* Custom button */}
      <Button
        type="button"
        variant="outline"
        onClick={openFileDialog}
        className="flex items-center gap-2"
      >
        <Upload size={16} />
        Upload files
      </Button>

      {/* Selected files */}
      {files.length > 0 && (
        <div className="text-sm text-slate-400">
          <div className="font-medium text-slate-300 mb-1">Selected files:</div>
          <ul className="list-disc ml-5 space-y-1">
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";

import { UploadCloud } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export function FileDropzone({
  accept,
  description,
  label,
  multiple = false,
  onFilesSelected,
}: {
  accept?: string;
  description: string;
  label: string;
  multiple?: boolean;
  onFilesSelected: (files: FileList) => void;
}) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (files?.length) {
      onFilesSelected(files);
    }
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--denim-300)] bg-[var(--denim-50)]/70 px-4 py-6 text-center transition",
        dragging && "border-[var(--denim-500)] bg-[var(--denim-100)]/80"
      )}
      htmlFor={inputId}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <UploadCloud className="h-6 w-6 text-[var(--denim-700)]" />
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      <input
        accept={accept}
        className="hidden"
        id={inputId}
        multiple={multiple}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
        type="file"
      />
    </label>
  );
}

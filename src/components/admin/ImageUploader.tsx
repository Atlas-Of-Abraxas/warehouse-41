"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface BaseProps {
  /** Which Supabase bucket to write to: "shop" (default) or "content". */
  bucket?: "shop" | "content";
  /** Storage subfolder within the bucket (default "products"). */
  folder?: string;
  /** Max number of images when multiple = true. */
  max?: number;
  /** Field label shown above the dropzone. */
  label?: string;
}

type SingleProps = BaseProps & {
  multiple?: false;
  value: string;
  onChange: (url: string) => void;
};

type MultiProps = BaseProps & {
  multiple: true;
  value: string[];
  onChange: (urls: string[]) => void;
};

type Props = SingleProps | MultiProps;

export default function ImageUploader(props: Props) {
  const { bucket = "shop", folder = "products", label, multiple } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const current: string[] = multiple
    ? (props.value as string[])
    : (props as SingleProps).value
    ? [(props as SingleProps).value]
    : [];

  const max = multiple ? props.max ?? 12 : 1;
  const canAddMore = current.length < max;

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    fd.append("bucket", bucket);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
    return data.url;
  }

  async function handleFiles(files: FileList | File[]) {
    setError("");
    const arr = Array.from(files);
    if (arr.length === 0) return;

    const slots = max - current.length;
    if (slots <= 0) {
      setError(`Limit of ${max} image${max === 1 ? "" : "s"} reached.`);
      return;
    }
    const toUpload = multiple ? arr.slice(0, slots) : [arr[0]];

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const f of toUpload) {
        const url = await uploadFile(f);
        uploaded.push(url);
      }
      if (multiple) {
        (props as MultiProps).onChange([...current, ...uploaded]);
      } else {
        (props as SingleProps).onChange(uploaded[0]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    if (multiple) {
      const next = current.filter((_, i) => i !== index);
      (props as MultiProps).onChange(next);
    } else {
      (props as SingleProps).onChange("");
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm text-[var(--color-text-secondary)] mb-2">{label}</label>
      )}

      {current.length > 0 && (
        <div className={`grid ${multiple ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5" : "grid-cols-1 max-w-[180px]"} gap-2 mb-3`}>
          {current.map((url, i) => (
            <div
              key={url + i}
              className="relative aspect-square rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute top-1 right-1 p-1 rounded-sm bg-[var(--color-bg-primary)]/85 text-[var(--color-text-secondary)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {!multiple && i === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[var(--color-bg-primary)]/85 text-[var(--color-accent)]">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
          }}
          className={`relative flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-md border-2 border-dashed transition-colors cursor-pointer ${
            dragOver
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
              : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 text-[var(--color-accent)] animate-spin" />
              <span className="text-sm text-[var(--color-text-secondary)]">Uploading…</span>
            </>
          ) : (
            <>
              {current.length > 0 ? (
                <ImageIcon className="w-5 h-5 text-[var(--color-text-muted)]" />
              ) : (
                <Upload className="w-5 h-5 text-[var(--color-text-muted)]" />
              )}
              <span className="text-sm text-[var(--color-text-secondary)]">
                {multiple
                  ? `Drop image${current.length > 0 ? "(s)" : "s"} here or click to upload`
                  : current.length > 0
                  ? "Replace image"
                  : "Drop an image here or click to upload"}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                JPG, PNG, or WEBP · up to 10 MB
                {multiple && ` · ${current.length}/${max}`}
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={multiple}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

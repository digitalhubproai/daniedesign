// Media library picker modal — fetches files already stored on the backend
// (GET /upload/media) and lets admin forms select one (cover) or many
// (gallery) instead of re-uploading. Used by ProjectForm and BlogForm.
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Loader2, X, Search, ImageOff } from "lucide-react";
import { listMedia, MediaFileItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Called with the chosen URLs when the user confirms (single mode fires immediately). */
  onSelect: (urls: string[]) => void;
  /** true = multi-select with a confirm button; false = click picks one and closes. */
  multiple?: boolean;
  /** Title shown in the modal header. */
  title?: string;
};

export default function MediaLibraryPicker({
  open,
  onClose,
  onSelect,
  multiple = false,
  title = "Media Library",
}: Props) {
  const [files, setFiles] = useState<MediaFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  // Load the library each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setSelected([]);
    listMedia("image")
      .then(setFiles)
      .catch((err: any) => setError(err.message || "Failed to load media library"))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  // Close on Escape for keyboard users.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  const toggleSelect = (url: string) => {
    if (!multiple) {
      onSelect([url]);
      return;
    }
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const visible = search.trim()
    ? files.filter((f) => f.filename.toLowerCase().includes(search.trim().toLowerCase()))
    : files;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl border border-white/10 bg-[#161619] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <h2 className="text-sm font-bold text-white">{title}</h2>
            <p className="text-[10px] font-mono text-white/40 mt-0.5">
              {files.length} file{files.length === 1 ? "" : "s"} on the server
              {multiple && selected.length > 0 && ` · ${selected.length} selected`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative px-4 pt-3">
          <Search className="absolute left-7 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by filename…"
            className="pl-8 text-xs"
          />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-white/50">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading library…</span>
            </div>
          ) : error ? (
            <p className="py-16 text-center text-xs text-red-400">{error}</p>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-white/40">
              <ImageOff className="h-6 w-6" />
              <span className="text-xs">No images uploaded yet.</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
              {visible.map((f) => {
                const isSelected = selected.includes(f.url);
                return (
                  <button
                    key={f.filename}
                    type="button"
                    onClick={() => toggleSelect(f.url)}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 bg-black/40 transition-colors ${
                      isSelected ? "border-accent" : "border-white/10 hover:border-white/40"
                    }`}
                    title={`${f.filename} · ${(f.size / 1024).toFixed(0)} KB`}
                  >
                    <Image
                      src={f.url}
                      alt={f.filename}
                      fill
                      sizes="120px"
                      className="object-cover"
                      unoptimized
                    />
                    {isSelected && (
                      <span className="absolute right-1 top-1 rounded-full bg-accent p-1 text-black">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer (multi-select mode) */}
        {multiple && (
          <div className="flex items-center justify-end gap-2 border-t border-white/10 p-3">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={selected.length === 0}
              onClick={() => onSelect(selected)}
            >
              Add {selected.length > 0 ? selected.length : ""} Selected
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

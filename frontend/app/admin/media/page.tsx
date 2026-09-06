// Media library / uploader — batch-upload images and videos to the backend,
// then copy their direct URLs for use in other admin forms. Upload history
// lives only in component state (per session, not persisted).
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  FileImage,
} from "lucide-react";
import { uploadMultipleImages } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminMediaPage() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Send all picked files as multipart form data; newest results are prepended.
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const results = await uploadMultipleImages(files);
      setUploadedFiles((prev) => [...results, ...prev]);
    } catch (err: any) {
      alert(err.message || "Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  // Copy URL to clipboard and show the "Copied!" state for 2s.
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Media Library &amp; Uploader
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Upload media directly to the FastAPI server. Copy direct URLs to use anywhere.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      {/* Invisible full-size file input layered over the drop zone: clicking the
          zone opens the native picker; actual drag-drop isn't wired up. */}
      <div className="relative rounded-2xl border-2 border-dashed border-white/15 bg-[#121215]/60 p-8 md:p-12 text-center hover:border-accent transition-colors">
        <input
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="max-w-md mx-auto space-y-2.5">
          <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
            <UploadCloud className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            {uploading ? "Uploading Assets to Server..." : "Click or Drag Files Here to Upload"}
          </h3>
          <p className="text-xs text-white/40 leading-relaxed font-mono">
            Supported formats: PNG, JPG, JPEG, WEBP, SVG, GIF, MP4 (up to 25MB per file)
          </p>
        </div>
      </div>

      {/* Uploaded Files Section */}
      <div>
        <h2 className="text-base font-bold text-white mb-3">
          Session Uploads ({uploadedFiles.length})
        </h2>

        {uploadedFiles.length === 0 ? (
          <Card className="p-10 text-center">
            <FileImage className="mx-auto h-7 w-7 text-white/20 mb-2" />
            <p className="text-xs font-semibold text-white">No files uploaded in this session</p>
            <p className="text-[11px] text-white/40 mt-0.5">Use the box above to upload new images.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedFiles.map((file, idx) => (
              <Card
                key={idx}
                className="p-3 hover:border-accent/40 transition-all space-y-2.5"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-black/40 border border-white/5">
                  <Image src={file.url} alt={file.filename} fill className="object-cover" />
                </div>

                <div className="space-y-0.5">
                  <p className="font-mono text-[11px] text-white font-semibold truncate">
                    {file.filename}
                  </p>
                  <p className="font-mono text-[10px] text-white/40">
                    {(file.size / 1024).toFixed(1)} KB • {file.content_type}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(file.url)}
                    className="flex-1 h-7 text-[10px] font-mono gap-1"
                  >
                    {copiedUrl === file.url ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </Button>
                  <a
                    href={file.url}
                    target="_blank"
                    className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

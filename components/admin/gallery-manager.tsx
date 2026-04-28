"use client";

import { Event, Gallery } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { ImagePlus } from "lucide-react";



import { UploadPreviewGrid } from "@/components/admin/upload-preview-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type GalleryWithEvent = Gallery & { event: Event };
type PreviewItem = { id: string; url: string; name: string };

export function GalleryManager({ images, events }: { images: GalleryWithEvent[]; events: Event[] }) {
  const router = useRouter();

  const [eventId, setEventId] = useState(events[0]?.id ?? "");
  const [imageUrls, setImageUrls] = useState(""); // ✅ MULTIPLE URLs
  const [caption, setCaption] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);

  // -------------------------
  // DEVICE UPLOAD
  // -------------------------
  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return null;

    const formData = new FormData();
    formData.append("folder", "gallery");

    Array.from(files).forEach((file) => formData.append("files", file));

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Upload failed");

    return data;
  }

  async function handleDeviceUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);
    setError(null);

    setPreviewItems(
      Array.from(files).map((file) => ({
        id: `${file.name}-${file.size}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }))
    );

    try {
      const data = await uploadFiles(files);
      const uploaded = data?.files as Array<{ url: string; name: string }>;

      await Promise.all(
        uploaded.map((file, index) =>
          fetch("/api/admin/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId,
              imageUrl: file.url,
              caption: caption || `Image ${index + 1}`,
            }),
          })
        )
      );

      setMessage(`${uploaded.length} images uploaded`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  // -------------------------
  // MULTIPLE URL UPLOAD
  // -------------------------
  async function createImagesFromUrls() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const urls = imageUrls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);

      if (urls.length === 0) throw new Error("No valid URLs");

      await Promise.all(
        urls.map((url, index) =>
          fetch("/api/admin/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId,
              imageUrl: url,
              caption: caption || `Image ${index + 1}`,
            }),
          })
        )
      );

      setMessage(`${urls.length} images added`);
      setImageUrls("");
      setCaption("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeImage(id: string) {
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      {/* LEFT PANEL */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Gallery Images</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Select value={eventId} onChange={(e) => setEventId(e.target.value)}>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </Select>

          <Input placeholder="Optional caption" value={caption} onChange={(e) => setCaption(e.target.value)} />

          {/* DEVICE UPLOAD */}
          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed p-4">
            <ImagePlus className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload images from device"}
            <input type="file" multiple className="hidden" onChange={handleDeviceUpload} />
          </label>

          {/* MULTIPLE URL INPUT */}
          <div>
            <label className="text-sm font-medium">Paste multiple image URLs</label>
            <textarea
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="One URL per line"
              className="w-full border rounded-lg p-3 text-sm mt-2"
              rows={4}
            />
          </div>

          {previewItems.length > 0 && <UploadPreviewGrid items={previewItems} />}

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button onClick={createImagesFromUrls} disabled={loading || uploading}>
            {loading ? "Saving..." : "Add Multiple URL Images"}
          </Button>
        </CardContent>
      </Card>

      {/* RIGHT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <img
              src={image.imageUrl}
              alt=""
              className="w-full h-48 object-cover"
            />

            <CardContent className="p-4">
              <p className="font-semibold">{image.event.title}</p>
              <p className="text-sm text-gray-500">{image.caption}</p>

              <Button variant="destructive" className="mt-2 w-full" onClick={() => removeImage(image.id)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
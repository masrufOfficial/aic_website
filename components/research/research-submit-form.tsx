"use client";

import { ChangeEvent, useState } from "react";
import { FileUp, ImagePlus, LoaderCircle, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  title: "",
  description: "",
  content: "",
  githubUrl: "",
  paperUrl: "",
  demoUrl: "",
  tags: "",
};

type UploadingState = "idle" | "images" | "paper";

export function ResearchSubmitForm() {
  const [form, setForm] = useState(initialState);
  const [images, setImages] = useState<string[]>([]);
  const [paperUrl, setPaperUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState<UploadingState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return null;
    }

    const formData = new FormData();
    formData.append("folder", "research");

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Upload failed.");
    }

    return data.files as Array<{ url: string }>;
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setMessage(null);
    setUploading("images");

    try {
      const files = await uploadFiles(event.target.files);
      if (files) {
        setImages((current) => [...current, ...files.map((file) => file.url)]);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload images.");
    } finally {
      setUploading("idle");
      event.target.value = "";
    }
  }

  async function handlePaperUpload(event: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setMessage(null);
    setUploading("paper");

    try {
      const files = await uploadFiles(event.target.files);
      if (files?.[0]?.url) {
        setPaperUrl(files[0].url);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload PDF.");
    } finally {
      setUploading("idle");
      event.target.value = "";
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          content: form.content,
          githubUrl: form.githubUrl,
          paperUrl,
          demoUrl: form.demoUrl,
          images,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setForm(initialState);
      setImages([]);
      setPaperUrl("");
      setMessage("Research submitted successfully. It is now waiting for admin review.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit research.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-slate-200/80 bg-white/85">
        <CardHeader>
          <CardTitle>Submit new research</CardTitle>
          <CardDescription>
            Share your project summary, publication details, supporting media, and links for review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Research title"
            value={form.title}
          />
          <Textarea
            className="min-h-28"
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Short description"
            value={form.description}
          />
          <Textarea
            className="min-h-56"
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            placeholder="Full content or publication details"
            value={form.content}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              onChange={(event) => setForm((current) => ({ ...current, githubUrl: event.target.value }))}
              placeholder="GitHub URL"
              value={form.githubUrl}
            />
            <Input
              onChange={(event) => setForm((current) => ({ ...current, demoUrl: event.target.value }))}
              placeholder="Demo URL (optional)"
              value={form.demoUrl}
            />
          </div>

          <Input
            onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            placeholder="Tags (comma separated)"
            value={form.tags}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--denim-300)] bg-[var(--denim-50)]/70 px-6 text-center">
              <ImagePlus className="h-6 w-6 text-[var(--denim-600)]" />
              <p className="mt-3 text-sm font-medium text-slate-900">Upload research images</p>
              <p className="mt-1 text-xs text-slate-500">Multiple images supported</p>
              <input
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleImageUpload}
                type="file"
              />
            </label>

            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--denim-300)] bg-white px-6 text-center">
              <FileUp className="h-6 w-6 text-[var(--denim-600)]" />
              <p className="mt-3 text-sm font-medium text-slate-900">Upload paper PDF</p>
              <p className="mt-1 text-xs text-slate-500">One paper attachment</p>
              <input
                accept="application/pdf"
                className="hidden"
                onChange={handlePaperUpload}
                type="file"
              />
            </label>
          </div>

          {uploading !== "idle" && (
            <div className="flex items-center gap-2 rounded-2xl bg-[var(--denim-50)] px-4 py-3 text-sm text-[var(--denim-700)]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {uploading === "images" ? "Uploading images..." : "Uploading PDF..."}
            </div>
          )}

          {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <Button disabled={submitting || uploading !== "idle"} onClick={handleSubmit}>
            {submitting ? "Submitting..." : "Submit Research"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-slate-200/80 bg-white/85">
          <CardHeader>
            <CardTitle>Attached assets</CardTitle>
            <CardDescription>Review uploaded images and your publication file before submission.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Images</p>
                {images.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {images.map((image, index) => (
                      <div className="group relative overflow-hidden rounded-3xl border border-slate-200" key={image}>
                        <img alt={`Research upload ${index + 1}`} className="h-32 w-full object-cover" src={image} />
                        <button
                          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white"
                          onClick={() => setImages((current) => current.filter((item) => item !== image))}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">No research images uploaded yet.</p>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">Paper file</p>
                {paperUrl ? (
                  <a className="mt-2 inline-flex items-center text-sm font-medium text-[var(--denim-700)] hover:underline" href={paperUrl} target="_blank">
                    Open uploaded PDF
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">No PDF attached yet.</p>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">Parsed tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <Badge key={tag}>#{tag}</Badge>
                    ))}
                  {!form.tags.trim() && <p className="text-sm text-slate-500">Tags will appear here as you type them.</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/85">
          <CardHeader>
            <CardTitle>What happens next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
            <p>1. Your submission is saved with a pending review status.</p>
            <p>2. Admins can approve, reject, or remove it from the moderation panel.</p>
            <p>3. Approved research becomes visible on the public research showcase page.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

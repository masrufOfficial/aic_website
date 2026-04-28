"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import { ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadPreviewGrid } from "@/components/admin/upload-preview-grid";
import type { ContentMap } from "@/lib/content";
import { getCropClass, getLogoSizeClasses, getLogoStyleClasses, getObjectFitClass, getRoundedValue } from "@/lib/media";
import { ImageDisplay } from "@/components/ui/ImageDisplay";

type LocalPreview = {
  id: string;
  url: string;
  name: string;
};

export function ContentManager({ initialContent }: { initialContent: ContentMap }) {
  const router = useRouter();
  const [form, setForm] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<LocalPreview[]>([]);

  const logoClasses = useMemo(
    () =>
      `${getLogoSizeClasses(form.logo_size)} ${getLogoStyleClasses(form.logo_style)} ${getCropClass(form.logo_crop)}`.trim(),
    [form.logo_crop, form.logo_size, form.logo_style]
  );

  async function uploadFiles(files: FileList | null, folder: string) {
    if (!files || files.length === 0) {
      return null;
    }

    const body = new FormData();
    body.append("folder", folder);
    Array.from(files).forEach((file) => body.append("files", file));

    const response = await fetch("/api/upload", {
      method: "POST",
      body,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Upload failed.");
    }

    return data;
  }

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setError(null);
    setMessage(null);

    const previews = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setLogoPreview(previews);

    try {
      const data = await uploadFiles(files, "branding");
      if (data?.file?.url) {
        setForm((current) => ({ ...current, logo_url: data.file.url }));
        setMessage("Logo uploaded successfully.");
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload logo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to update content.");
      setLoading(false);
      return;
    }

    setMessage("Website content updated successfully.");
    setLoading(false);
    router.refresh();
  }

  return (
    <Card className="border-slate-200/80 bg-white/85">
      <CardHeader>
        <CardTitle>Website Content</CardTitle>
        <CardDescription>Update branding, homepage messaging, and media behavior. Uploaded images are stored locally and persisted in the database.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Club Name</label>
                <Input value={form.club_name} onChange={(e) => setForm({ ...form, club_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Hero Badge</label>
                <Input value={form.hero_badge} onChange={(e) => setForm({ ...form, hero_badge: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Hero Title</label>
              <Input value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Hero Subtitle</label>
              <Textarea value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Hero Image URL</label>
              <Input value={form.hero_image_url} onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vision & Mission</label>
              <Textarea value={form.vision_mission} onChange={(e) => setForm({ ...form, vision_mission: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">About Text</label>
              <Textarea value={form.about_text} onChange={(e) => setForm({ ...form, about_text: e.target.value })} />
            </div>
          </div>

          <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-[var(--denim-50)] p-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Upload Logo</label>
              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--denim-300)] bg-white px-4 py-5 text-sm font-medium text-[var(--denim-700)] transition hover:bg-[var(--denim-50)]">
                <ImagePlus className="h-4 w-4" />
                {uploading ? "Uploading..." : "Choose logo from device"}
                <input accept="image/*" className="hidden" onChange={handleLogoUpload} type="file" />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Logo URL</label>
              <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="/uploads/branding/logo.png" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Logo Size</label>
                <Select value={form.logo_size} onChange={(e) => setForm({ ...form, logo_size: e.target.value as ContentMap["logo_size"] })}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Logo Style</label>
                <Select value={form.logo_style} onChange={(e) => setForm({ ...form, logo_style: e.target.value as ContentMap["logo_style"] })}>
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                  <option value="pill">Pill</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Fit Mode</label>
                <Select value={form.logo_fit_mode} onChange={(e) => setForm({ ...form, logo_fit_mode: e.target.value as ContentMap["logo_fit_mode"] })}>
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Crop</label>
                <Select value={form.logo_crop} onChange={(e) => setForm({ ...form, logo_crop: e.target.value as ContentMap["logo_crop"] })}>
                  <option value="square">Square</option>
                  <option value="center">Center Crop</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Global Image Ratio</label>
                <Select value={form.image_ratio} onChange={(e) => setForm({ ...form, image_ratio: e.target.value as ContentMap["image_ratio"] })}>
                  <option value="1:1">1:1</option>
                  <option value="4:3">4:3</option>
                  <option value="16:9">16:9</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Global Image Fit</label>
                <Select value={form.image_fit} onChange={(e) => setForm({ ...form, image_fit: e.target.value as ContentMap["image_fit"] })}>
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Global Image Style</label>
                <Select value={form.image_style} onChange={(e) => setForm({ ...form, image_style: e.target.value as ContentMap["image_style"] })}>
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Logo Preview</p>
              {logoPreview.length > 0 ? (
                <UploadPreviewGrid items={logoPreview} />
              ) : form.logo_url ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className={`w-24 bg-slate-100 ${logoClasses}`}>
                    <ImageDisplay
                      alt="Logo preview"
                      aspectRatio={form.logo_crop === "center" ? "4:3" : "1:1"}
                      fit={form.logo_fit_mode as "cover" | "contain"}
                      rounded={form.logo_style !== "square"}
                      src={form.logo_url}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">No logo uploaded yet.</div>
              )}
            </div>

            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-700">Global Image Preview</p>
              <ImageDisplay
                alt="Global image settings preview"
                aspectRatio={form.image_ratio as "1:1" | "4:3" | "16:9"}
                fit={form.image_fit as "cover" | "contain"}
                rounded={getRoundedValue(form.image_style)}
                src={form.hero_image_url}
              />
            </div>
          </div>
        </div>

        {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <div className="flex justify-end">
          <Button disabled={loading || uploading} onClick={handleSubmit} type="button">
            {loading ? "Saving..." : "Save Content"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

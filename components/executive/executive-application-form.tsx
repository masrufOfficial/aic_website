"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FileDropzone } from "@/components/ui/file-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ExecutiveApplicationForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(defaultName);
  const [cvUrl, setCvUrl] = useState("");
  const [skills, setSkills] = useState("");
  const [motivation, setMotivation] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCvFiles(files: FileList) {
    setUploading(true);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("folder", "executive-cv");
      formData.append("files", files[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to upload CV.");
      }

      setCvUrl(data.file.url);
      setMessage("CV uploaded successfully.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload CV.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/executive-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          cvUrl,
          skills,
          motivation,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to submit application.");
      }

      setMessage("Executive application submitted successfully.");
      setSkills("");
      setMotivation("");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit application.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-slate-200/80 bg-white/90">
      <CardHeader>
        <CardTitle>Executive Application</CardTitle>
        <CardDescription>Verified members can submit one pending application at a time for admin review.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <Input onChange={(event) => setFullName(event.target.value)} value={fullName} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">CV upload</label>
          <FileDropzone
            accept="application/pdf"
            description={cvUrl ? "CV uploaded and ready to submit." : "Drop a PDF here or click to choose your CV."}
            label={uploading ? "Uploading CV..." : "Upload PDF CV"}
            onFilesSelected={handleCvFiles}
          />
          {cvUrl && <p className="text-xs text-emerald-700">Uploaded file: {cvUrl}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Skills</label>
          <Textarea onChange={(event) => setSkills(event.target.value)} placeholder="AI tools, leadership, community work, technical strengths..." value={skills} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Motivation</label>
          <Textarea onChange={(event) => setMotivation(event.target.value)} placeholder="Why do you want to join the executive panel?" value={motivation} />
        </div>
        {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        <Button disabled={saving || uploading || !cvUrl} onClick={handleSubmit} type="button">
          {saving ? "Submitting..." : "Submit Application"}
        </Button>
      </CardContent>
    </Card>
  );
}

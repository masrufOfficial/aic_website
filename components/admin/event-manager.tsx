"use client";

import { Event } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { ImagePlus } from "lucide-react";

import { UploadPreviewGrid } from "@/components/admin/upload-preview-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  title: "",
  type: "national",
  date: "",
  description: "",
  location: "",
  registrationLink: "",
  coverImage: "",
};

type PreviewItem = {
  id: string;
  url: string;
  name: string;
};

function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="w-full min-w-0 overflow-hidden border-slate-200/80 bg-white/85 shadow-sm hover:shadow-md transition">
      {/* IMAGE */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={event.coverImage || "https://picsum.photos/seed/event/900/700"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
            {event.title}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {event.type} | {new Date(event.date).toLocaleString()}
          </p>

          <p
            className={`text-sm text-slate-600 mt-3 ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {event.description}
          </p>

          {event.description && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-600 mt-1 hover:underline"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="w-full"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export function EventManager({ events }: { events: Event[] }) {
  const router = useRouter();

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);

  async function uploadFiles(files: FileList | null) {
    if (!files) return;

    const formData = new FormData();
    formData.append("folder", "events");

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    return data;
  }

  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    try {
      const data = await uploadFiles(files);
      if (data?.file?.url) {
        setForm((prev) => ({
          ...prev,
          coverImage: data.file.url,
        }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function saveEvent() {
    setLoading(true);

    const res = await fetch(
      editingId ? `/api/admin/events/${editingId}` : "/api/admin/events",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setForm(initialState);
    setEditingId(null);
    router.refresh();
    setLoading(false);
  }

  async function deleteEvent(id: string) {
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8">
      {/* FORM SECTION */}
      <div className="w-full xl:w-[380px] shrink-0">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Event" : "Create Event"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <Select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="national">National</option>
              <option value="domestic">Domestic</option>
            </Select>

            <Input
              type="datetime-local"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />

            {/* IMAGE UPLOAD */}
            <label className="border-dashed border p-4 flex justify-center cursor-pointer">
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload Image
              <input
                type="file"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </label>

            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <Button onClick={saveEvent} disabled={loading}>
              {loading ? "Saving..." : "Save Event"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* EVENT GRID SECTION */}
      <div className="flex-1 w-full min-w-0">
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => {
                setEditingId(event.id);
                setForm({
                  title: event.title,
                  type: event.type,
                  date: new Date(event.date)
                    .toISOString()
                    .slice(0, 16),
                  description: event.description,
                  location: event.location,
                  registrationLink: event.registrationLink ?? "",
                  coverImage: event.coverImage ?? "",
                });
              }}
              onDelete={() => deleteEvent(event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
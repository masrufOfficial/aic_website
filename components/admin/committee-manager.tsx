"use client";

import { Committee } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function CommitteeManager({ members }: { members: Committee[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", role: "", image: "", isAlumni: "false" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createMember() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/committee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        role: form.role,
        image: form.image,
        isAlumni: form.isAlumni === "true",
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to save committee member.");
      setLoading(false);
      return;
    }

    setForm({ name: "", role: "", image: "", isAlumni: "false" });
    setLoading(false);
    setMessage("Committee member saved successfully.");
    router.refresh();
  }

  async function removeMember(id: string) {
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/admin/committee/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete committee member.");
      return;
    }

    setMessage("Committee member deleted successfully.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="border-slate-200/80 bg-white/85">
        <CardHeader>
          <CardTitle>Add Committee Member</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <Select value={form.isAlumni} onChange={(e) => setForm({ ...form, isAlumni: e.target.value })}>
            <option value="false">Current Committee</option>
            <option value="true">Alumni</option>
          </Select>
          {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          <Button className="w-full" disabled={loading} onClick={createMember} type="button">
            {loading ? "Saving..." : "Save Member"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {members.map((member) => (
          <Card key={member.id} className="overflow-hidden border-slate-200/80 bg-white/85 p-0">
            <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('${member.image}')` }} />
            <CardContent className="space-y-3 pt-6">
              <h3 className="text-lg font-semibold text-slate-950">{member.name}</h3>
              <p className="text-sm text-slate-500">
                {member.role} | {member.isAlumni ? "Alumni" : "Committee"}
              </p>
              <Button variant="destructive" onClick={() => removeMember(member.id)} type="button">
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

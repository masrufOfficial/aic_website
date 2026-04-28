"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RESEARCH_STATUSES, getResearchStatusLabel, getResearchStatusVariant } from "@/lib/research";
import { formatDate } from "@/lib/utils";

type ResearchAdminItem = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string | Date;
  author: {
    name: string;
    email: string;
  };
};

export function ResearchAdminManager({ items }: { items: ResearchAdminItem[] }) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") {
      return items;
    }

    return items.filter((item) => item.status === activeFilter);
  }, [activeFilter, items]);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setBusyId(id);

    try {
      await fetch(`/api/admin/research/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteResearch(id: string) {
    setBusyId(id);

    try {
      await fetch(`/api/admin/research/${id}`, {
        method: "DELETE",
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  const filters = ["all", ...RESEARCH_STATUSES];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const active = activeFilter === filter;
          return (
            <button className="cursor-pointer" key={filter} onClick={() => setActiveFilter(filter)} type="button">
              <Badge className={active ? "bg-[var(--denim-600)] text-white" : ""}>
                {filter === "all" ? "All submissions" : getResearchStatusLabel(filter)}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((research) => (
          <Card className="border-slate-200/80 bg-white/85" key={research.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold text-slate-950">{research.title}</h3>
                  <Badge variant={getResearchStatusVariant(research.status)}>{getResearchStatusLabel(research.status)}</Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{research.description}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 rounded-3xl bg-[var(--denim-50)] p-4 text-sm text-slate-600 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-slate-900">Author:</span> {research.author.name}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Email:</span> {research.author.email}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Submitted:</span> {formatDate(research.createdAt)}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Status:</span> {getResearchStatusLabel(research.status)}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                disabled={busyId === research.id || research.status === "approved"}
                onClick={() => updateStatus(research.id, "approved")}
                size="sm"
              >
                Approve
              </Button>
              <Button
                disabled={busyId === research.id || research.status === "rejected"}
                onClick={() => updateStatus(research.id, "rejected")}
                size="sm"
                variant="outline"
              >
                Reject
              </Button>
              <Button
                disabled={busyId === research.id}
                onClick={() => deleteResearch(research.id)}
                size="sm"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="border-dashed border-slate-300 bg-white/80 text-center">
          <p className="text-lg font-semibold text-slate-900">No submissions in this state.</p>
          <p className="mt-2 text-sm text-slate-600">New research entries will appear here as students submit them.</p>
        </Card>
      )}
    </div>
  );
}

"use client";

import { Membership, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMembershipBadgeVariant } from "@/lib/membership";
import { formatDate, titleCase } from "@/lib/utils";

type MembershipWithUser = Membership & { user: User };

export function MembershipManager({ requests }: { requests: MembershipWithUser[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("pending");

  const filtered = useMemo(() => {
    if (filter === "all") {
      return requests;
    }

    return requests.filter((item) => item.status === filter);
  }, [filter, requests]);

  async function updateStatus(id: string, status: "active" | "rejected") {
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/memberships/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to update membership.");
      return;
    }

    setMessage(`Membership ${status === "active" ? "approved" : "rejected"} successfully.`);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "active", "expired", "rejected"].map((status) => (
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === status
                ? "bg-[var(--denim-600)] text-white"
                : "bg-[var(--denim-50)] text-[var(--denim-700)]"
            }`}
            key={status}
            onClick={() => setFilter(status)}
            type="button"
          >
            {status === "all" ? "All" : titleCase(status)}
          </button>
        ))}
      </div>

      {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="grid gap-4">
        {filtered.map((request) => (
          <Card key={request.id} className="border-slate-200/80 bg-white/85">
            <CardContent className="flex flex-col gap-4 pt-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-950">{request.fullName}</h3>
                  <p className="text-sm text-slate-500">{request.email}</p>
                  <p className="text-sm text-slate-500">Account owner: {request.user.name}</p>
                </div>
                <Badge variant={getMembershipBadgeVariant(request.status)}>{titleCase(request.status)}</Badge>
              </div>

              <div className="grid gap-3 rounded-2xl bg-[var(--denim-50)] p-4 text-sm text-slate-700 md:grid-cols-2 xl:grid-cols-4">
                <p><span className="font-semibold text-slate-900">Phone:</span> {request.phone}</p>
                <p><span className="font-semibold text-slate-900">Membership ID:</span> {request.membershipId}</p>
                <p><span className="font-semibold text-slate-900">Applied:</span> {formatDate(request.createdAt)}</p>
                <p><span className="font-semibold text-slate-900">Expires:</span> {request.expiresAt ? formatDate(request.expiresAt) : "Not set"}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  disabled={request.status === "active"}
                  onClick={() => updateStatus(request.id, "active")}
                  type="button"
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  disabled={request.status === "rejected"}
                  onClick={() => updateStatus(request.id, "rejected")}
                  type="button"
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

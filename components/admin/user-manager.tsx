"use client";

import { MembershipStatus, User, UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export function UserManager({ users }: { users: User[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateUser(id: string, payload: { role?: UserRole; membershipStatus?: MembershipStatus }) {
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to update user.");
      return;
    }

    setMessage("User updated successfully.");
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {users.map((user) => (
        <Card key={user.id} className="border-slate-200/80 bg-white/85">
          <CardContent className="grid gap-4 pt-6 md:grid-cols-[1fr_180px_180px] md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">{user.name}</h3>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <Select value={user.role} onChange={(e) => updateUser(user.id, { role: e.target.value as UserRole })}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </Select>
            <Select
              value={user.membershipStatus}
              onChange={(e) => updateUser(user.id, { membershipStatus: e.target.value as MembershipStatus })}
            >
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="rejected">Rejected</option>
            </Select>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

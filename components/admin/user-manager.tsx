"use client";

import { Membership, MembershipStatus, User, UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { ITEMS_PER_PAGE, getPageCount, paginateItems } from "@/lib/pagination";
import { formatDate } from "@/lib/utils";

type UserWithMembership = User & {
  memberships: Membership[];
};

export function UserManager({ users }: { users: UserWithMembership[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");
  const [page, setPage] = useState(1);

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

  const filteredUsers = useMemo(() => {
    if (filter === "verified") {
      return users.filter((user) => user.emailVerified);
    }

    if (filter === "pending") {
      return users.filter((user) => user.membershipStatus === "pending");
    }

    return users;
  }, [filter, users]);

  const pageCount = getPageCount(filteredUsers.length, ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => paginateItems(filteredUsers, page, ITEMS_PER_PAGE), [filteredUsers, page]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {[
          { label: "All", value: "all" },
          { label: "Verified", value: "verified" },
          { label: "Pending", value: "pending" },
        ].map((item) => (
          <Button
            key={item.value}
            onClick={() => {
              setFilter(item.value as typeof filter);
              setPage(1);
            }}
            type="button"
            variant={filter === item.value ? "default" : "outline"}
          >
            {item.label}
          </Button>
        ))}
      </div>
      {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <Card className="overflow-hidden border-slate-200/80 bg-white/90 p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Membership ID</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Expiry date</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => {
                const latestMembership = user.memberships[0] ?? null;

                return (
                  <tr className="border-t border-slate-100" key={user.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{user.email}</td>
                    <td className="px-4 py-4 text-slate-600">{latestMembership?.membershipId ?? "Not assigned"}</td>
                    <td className="px-4 py-4 text-slate-600">{user.membershipStatus}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {latestMembership?.expiresAt ? formatDate(latestMembership.expiresAt) : "Not set"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="grid gap-2 md:grid-cols-2">
                        <Select value={user.role} onChange={(e) => updateUser(user.id, { role: e.target.value as UserRole })}>
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button" variant="outline">
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {page} of {pageCount}
          </span>
          <Button disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} type="button" variant="outline">
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

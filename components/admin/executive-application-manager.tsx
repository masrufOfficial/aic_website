"use client";

import { ExecutiveApplication, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ITEMS_PER_PAGE, getPageCount, paginateItems } from "@/lib/pagination";
import { formatDate, titleCase } from "@/lib/utils";

type ApplicationWithUser = ExecutiveApplication & { user: User };

export function ExecutiveApplicationManager({ applications }: { applications: ApplicationWithUser[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const pageCount = getPageCount(applications.length, ITEMS_PER_PAGE);
  const paginated = useMemo(() => paginateItems(applications, page, ITEMS_PER_PAGE), [applications, page]);

  async function reviewApplication(id: string, status: "approved" | "rejected") {
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/admin/executive-applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to review executive application.");
      return;
    }

    setMessage(`Application ${status}.`);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {paginated.map((application) => (
        <Card className="border-slate-200/80 bg-white/90" key={application.id}>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{application.fullName}</h3>
                <p className="text-sm text-slate-500">{application.user.email}</p>
                <p className="text-sm text-slate-500">Submitted {formatDate(application.createdAt)}</p>
              </div>
              <span className="rounded-full bg-[var(--denim-50)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--denim-700)]">
                {titleCase(application.status)}
              </span>
            </div>
            <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Skills</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{application.skills}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Motivation</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{application.motivation}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="inline-flex" href={application.cvUrl} rel="noreferrer" target="_blank">
                <Button type="button" variant="outline">Open CV</Button>
              </a>
              <Button disabled={application.status === "approved"} onClick={() => reviewApplication(application.id, "approved")} type="button">
                Approve
              </Button>
              <Button disabled={application.status === "rejected"} onClick={() => reviewApplication(application.id, "rejected")} type="button" variant="destructive">
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center justify-center gap-2">
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
    </div>
  );
}

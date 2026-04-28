import { MembershipForm } from "@/components/site/membership-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireUser } from "@/lib/auth";
import { getLatestMembership, getMembershipBadgeVariant } from "@/lib/membership";
import { formatDate, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardMembershipPage() {
  const user = await requireUser();
  const latestMembership = getLatestMembership(user);

  return (
    <div className="page-shell space-y-10">
      <SectionHeading
        eyebrow="Membership Dashboard"
        title="Apply for membership and track your annual status"
        description="Submit your member details, wait for admin review, and monitor approval and expiry from one place."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <MembershipForm
          defaultValues={{
            fullName: latestMembership?.fullName ?? user.name,
            email: latestMembership?.email ?? user.email,
            phone: latestMembership?.phone ?? "",
            membershipId: latestMembership?.membershipId ?? "",
          }}
        />

        <Card className="border-slate-200/80 bg-white/85">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-500)]">Current Status</p>
          <div className="mt-5">
            <Badge variant={getMembershipBadgeVariant(user.membershipStatus)}>{titleCase(user.membershipStatus)}</Badge>
          </div>

          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Membership ID:</span>{" "}
              {latestMembership?.membershipId ?? "Not submitted"}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Approved At:</span>{" "}
              {latestMembership?.approvedAt ? formatDate(latestMembership.approvedAt) : "Awaiting review"}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Expires At:</span>{" "}
              {latestMembership?.expiresAt ? formatDate(latestMembership.expiresAt) : "Not active yet"}
            </p>
            <p>
              {latestMembership
                ? `Latest application submitted on ${formatDate(latestMembership.createdAt)}.`
                : "No membership application has been submitted yet."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

import type { Activity, Event, EventRegistration } from "@prisma/client";
import Link from "next/link";

import { ProfileSettings } from "@/components/profile/profile-settings";
import { LogoutButton } from "@/components/site/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { isVerifiedMember } from "@/lib/access";
import { requireUser } from "@/lib/auth";
import { getLatestMembership, getMembershipBadgeVariant } from "@/lib/membership";
import { formatDate, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();
  const latestMembership = getLatestMembership(user);

  return (
    <div className="page-shell space-y-10">
      <SectionHeading
        eyebrow="Profile Dashboard"
        title={`Welcome, ${user.name}`}
        description="Manage your member identity, monitor your annual membership status, and keep your profile polished across the platform."
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border-slate-200/80 bg-white/85">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-500)]">Registered Events</p>
          <div className="mt-5 space-y-3">
            {user.registrations.length > 0 ? (
              user.registrations.map((registration: EventRegistration & { event: Event }) => (
                <div key={registration.id} className="rounded-2xl bg-[var(--denim-50)] p-4">
                  <p className="font-semibold text-slate-900">{registration.event.title}</p>
                  <p className="text-sm text-slate-600">{formatDate(registration.event.date)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No events registered yet.</p>
            )}
          </div>
        </Card>

        <Card className="border-slate-200/80 bg-white/85">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-500)]">Quick Account View</p>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Name:</span> {user.name}</p>
            <p><span className="font-semibold text-slate-900">Email:</span> {user.email}</p>
            <p><span className="font-semibold text-slate-900">Role:</span> {titleCase(user.role)}</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Membership:</span>
              <Badge variant={getMembershipBadgeVariant(user.membershipStatus)}>{titleCase(user.membershipStatus)}</Badge>
            </div>
            <p><span className="font-semibold text-slate-900">Membership ID:</span> {latestMembership?.membershipId ?? "Not assigned"}</p>
            <p><span className="font-semibold text-slate-900">Approved At:</span> {latestMembership?.approvedAt ? formatDate(latestMembership.approvedAt) : "Awaiting approval"}</p>
            <p><span className="font-semibold text-slate-900">Expires At:</span> {latestMembership?.expiresAt ? formatDate(latestMembership.expiresAt) : "Not active yet"}</p>
          </div>
          <div className="mt-6">
            <LogoutButton />
          </div>
        </Card>
      </div>

      <ProfileSettings
        latestMembership={
          latestMembership
            ? {
                membershipId: latestMembership.membershipId,
                status: latestMembership.status,
                approvedAt: latestMembership.approvedAt,
                expiresAt: latestMembership.expiresAt,
              }
            : null
        }
        user={{
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          profileImage: user.profileImage ?? null,
          membershipStatus: user.membershipStatus,
          emailVerified: user.emailVerified,
        }}
      />

      <Card className="border-slate-200/80 bg-white/85">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-500)]">Research Submission</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Publish your research, upload PDFs and image galleries, and send your work to the admin moderation queue.
            </p>
          </div>
          <Link href="/dashboard/research">
            <Button>Open Research Dashboard</Button>
          </Link>
        </div>
      </Card>

      <Card className="border-slate-200/80 bg-white/85">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-500)]">Executive Panel</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Verified members can apply for the executive panel with their CV, skills, and motivation statement.
            </p>
          </div>
          {isVerifiedMember(user) ? (
            <Link href="/executive/apply">
              <Button>Apply for Executive</Button>
            </Link>
          ) : (
            <Button disabled>Verification Required</Button>
          )}
        </div>
      </Card>

      <Card className="border-slate-200/80 bg-white/85">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-500)]">Activity History</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {user.activities.map((activity: Activity) => (
            <div key={activity.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-medium text-slate-900">{activity.label}</p>
              <p className="mt-2 text-sm text-slate-500">{formatDate(activity.createdAt)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

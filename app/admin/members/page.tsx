import { MembershipManager } from "@/components/admin/membership-manager";
import { UserManager } from "@/components/admin/user-manager";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdminPage } from "@/lib/admin";
import { expireMemberships } from "@/lib/membership";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  await requireAdminPage();
  await expireMemberships();

  const [users, memberships] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.membership.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Members"
          title="Manage user roles and membership state"
          description="Admins can update user roles, active status, and visibility across the platform from this page."
        />
        <UserManager users={users} />
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Membership Review"
          title="Approve or reject membership requests"
          description="Review full applications, activate memberships for one year, and monitor expiry state."
        />
        <MembershipManager requests={memberships} />
      </section>
    </div>
  );
}

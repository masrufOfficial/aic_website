import { CommitteeManager } from "@/components/admin/committee-manager";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCommitteePage() {
  await requireAdminPage();
  const members = await prisma.committee.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Committee"
        title="Maintain committee and alumni records"
        description="Update current leadership cards and alumni entries without editing frontend files."
      />
      <CommitteeManager members={members} />
    </div>
  );
}

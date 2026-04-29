import { ExecutiveApplicationManager } from "@/components/admin/executive-application-manager";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminExecutivePage() {
  await requireAdminPage();

  const applications = await prisma.executiveApplication.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Executive Panel"
        title="Review executive applications"
        description="Approve or reject verified-member applications and promote approved members into the executive showcase."
      />
      <ExecutiveApplicationManager applications={applications} />
    </div>
  );
}

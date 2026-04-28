import { ContentManager } from "@/components/admin/content-manager";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdminPage } from "@/lib/admin";
import { getContentMap } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  await requireAdminPage();
  const content = await getContentMap();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Content Management"
        title="Control visible website content from the dashboard"
        description="Edit hero copy, brand logo, vision or mission text, and about content without touching code."
      />
      <ContentManager initialContent={content} />
    </div>
  );
}

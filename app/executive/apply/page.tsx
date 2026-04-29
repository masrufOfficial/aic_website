import { redirect } from "next/navigation";

import { ExecutiveApplicationForm } from "@/components/executive/executive-application-form";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireUser } from "@/lib/auth";
import { isVerifiedMember } from "@/lib/access";

export const dynamic = "force-dynamic";

export default async function ExecutiveApplyPage() {
  const user = await requireUser();

  if (!isVerifiedMember(user)) {
    redirect("/profile");
  }

  return (
    <div className="page-shell space-y-8">
      <SectionHeading
        eyebrow="Leadership"
        title="Apply for the executive panel"
        description="Verified members can submit their profile, skills, and motivation for admin review."
      />
      <Card className="border-slate-200/80 bg-white/85">
        <p className="text-sm leading-7 text-slate-600">
          Your application will remain pending until an admin approves or rejects it. Approved applicants are automatically added to the executive section.
        </p>
      </Card>
      <ExecutiveApplicationForm defaultName={user.name} />
    </div>
  );
}

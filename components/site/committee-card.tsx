import { Committee } from "@prisma/client";

import { Card } from "@/components/ui/card";
import { ImageDisplay } from "@/components/ui/ImageDisplay";

export function CommitteeCard({
  member,
  imageRatio = "4:3",
  imageFit = "cover",
  imageRounded = true,
}: {
  member: Pick<Committee, "name" | "role" | "image" | "isAlumni" | "group">;
  imageRatio?: "16:9" | "1:1" | "4:3";
  imageFit?: "cover" | "contain";
  imageRounded?: boolean;
}) {
  return (
    <Card className="overflow-hidden border-slate-200/80 bg-white/90 p-0">
      <div className="p-2">
        <ImageDisplay alt={member.name} aspectRatio={imageRatio} fit={imageFit} rounded={imageRounded} src={member.image} />
      </div>
      <div className="p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)]">
          {member.isAlumni ? "Alumni" : member.group}
        </p>
        <h3 className="mt-3 text-xl font-semibold text-slate-950 md:text-2xl">{member.name}</h3>
        <p className="mt-2 text-sm text-slate-600 md:text-base">{member.role}</p>
      </div>
    </Card>
  );
}

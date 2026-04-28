import type { Committee } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getContentMap } from "@/lib/content";
import { getAspectRatioValue, getRoundedValue } from "@/lib/media";
import { CommitteeCard } from "@/components/site/committee-card";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

export const dynamic = "force-dynamic";

export default async function AboutUsPage() {
  const [committee, alumni, content] = await Promise.all([
    prisma.committee.findMany({ where: { isAlumni: false } }),
    prisma.committee.findMany({ where: { isAlumni: true } }),
    getContentMap(),
  ]);
  const imageRatio = getAspectRatioValue(content.image_ratio);
  const imageFit = content.image_fit === "contain" ? "contain" : "cover";
  const imageRounded = getRoundedValue(content.image_style);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 md:px-8 md:py-16 lg:px-16">
      <SectionHeading
        eyebrow="About Us"
        title="A trusted AI-focused student community with transparent documentation."
        description={content.about_text}
      />

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-slate-200/80 bg-white/85">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-500)]">Official Permission</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">Institutional approval and verification records</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {content.about_text} Place your scanned approval document, official letter, or registration certificate here. The current scaffold uses a styled placeholder card that can be replaced with a PDF embed or downloadable file.
          </p>
          <div className="mt-6 rounded-[2rem] border border-dashed border-[var(--denim-300)] bg-[var(--denim-50)] p-10 text-center text-sm text-slate-600">
            Official permission document placeholder
          </div>
        </Card>

        <Card className="border-slate-200/80 bg-gradient-to-br from-slate-950 to-[var(--denim-900)] text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-200)]">Constitution</p>
          <h2 className="mt-4 text-3xl font-semibold">Rules, structure, and community governance.</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-200">
            <p>{content.vision_mission}</p>
            <p>Attach a summarized constitution here with the full document linked or embedded below.</p>
            <p>The layout is ready for PDFs, accordions, or sectioned content as your document grows.</p>
          </div>
        </Card>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Committee"
          title="Current committee members"
          description="These cards are driven by the Prisma `Committee` model so admins can update leadership without editing the page."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {committee.map((member: Committee) => (
            <CommitteeCard imageFit={imageFit} imageRatio={imageRatio} imageRounded={imageRounded} key={member.id} member={member} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Alumni"
          title="Alumni gallery"
          description="Recognize mentors, past leaders, and contributors with a dedicated alumni archive."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {alumni.map((member: Committee) => (
            <CommitteeCard imageFit={imageFit} imageRatio={imageRatio} imageRounded={imageRounded} key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}

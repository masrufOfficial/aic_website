import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, FileText, Github, Lock, MessageSquareMore, ThumbsUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isVerifiedMember } from "@/lib/access";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getResearchStatusLabel, summarizeResearchContent } from "@/lib/research";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentApiUser();
  const { id } = await params;

  const research = await prisma.research.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!research) {
    notFound();
  }

  const canResolveRecord =
    research.status === "approved" ||
    (user && (user.role === "admin" || user.id === research.authorId));

  if (!canResolveRecord) {
    notFound();
  }

  const hasFullAccess =
    user?.role === "admin" ||
    user?.id === research.authorId ||
    isVerifiedMember(user);

  const heroImage = research.images[0] || "https://picsum.photos/seed/research-detail/1600/900";
  const galleryImages = research.images.slice(1);
  const contentToShow = hasFullAccess ? research.content : summarizeResearchContent(research.content, 420);

  return (
    <div className="page-shell space-y-10">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 shadow-[0_35px_90px_-50px_rgba(37,99,235,0.45)]">
        <div className="relative h-[300px] md:h-[440px]">
          <img alt={research.title} className="h-full w-full object-cover" src={heroImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="flex flex-wrap gap-2">
              {research.tags.map((tag) => (
                <Badge className="bg-white/15 text-white backdrop-blur-sm" key={tag}>
                  #{tag}
                </Badge>
              ))}
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {research.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-100 md:text-base">{research.description}</p>
          </div>
        </div>
      </div>

      {!hasFullAccess && (
        <Card className="border-amber-200 bg-amber-50/80">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-3 text-amber-700">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">Membership required to view full research</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  Public visitors can browse summaries, but only active members can access the full publication details and resources.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {!user && (
                <Link href={`/login?redirect=/research/${research.id}`}>
                  <Button variant="outline">Login</Button>
                </Link>
              )}
              <Link href="/dashboard/membership">
                <Button>Apply for Membership</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="space-y-8">
          <Card className="border-slate-200/80 bg-white/85">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)]">
                  Publication Details
                </p>
                <p className="mt-3 text-base text-slate-700">
                  {research.author.name} | {formatDate(research.createdAt)}
                </p>
              </div>
              <Badge className="bg-[var(--denim-50)] text-[var(--denim-700)]">
                Status: {getResearchStatusLabel(research.status)}
              </Badge>
            </div>

            <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700">{contentToShow}</div>
          </Card>

          {hasFullAccess && galleryImages.length > 0 && (
            <Card className="border-slate-200/80 bg-white/85">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)]">Image Gallery</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {galleryImages.map((image, index) => (
                  <div className="overflow-hidden rounded-[1.75rem]" key={`${image}-${index}`}>
                    <img alt={`${research.title} gallery image ${index + 1}`} className="h-72 w-full object-cover" src={image} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </article>

        <aside className="space-y-6">
          <Card className="border-slate-200/80 bg-white/85">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)]">Resources</p>
            {hasFullAccess ? (
              <div className="mt-6 space-y-3">
                {research.githubUrl && (
                  <Link href={research.githubUrl} rel="noreferrer" target="_blank">
                    <Button className="w-full justify-center" variant="outline">
                      <Github className="mr-2 h-4 w-4" />
                      View GitHub Repository
                    </Button>
                  </Link>
                )}
                {research.paperUrl && (
                  <Link href={research.paperUrl} rel="noreferrer" target="_blank">
                    <Button className="w-full justify-center" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Download Paper PDF
                    </Button>
                  </Link>
                )}
                {research.demoUrl && (
                  <Link href={research.demoUrl} rel="noreferrer" target="_blank">
                    <Button className="w-full justify-center">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Live Demo
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Links, downloads, and media are available after your membership becomes active.
              </p>
            )}
          </Card>

          <Card className="border-slate-200/80 bg-white/85">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)]">Engagement</p>
            <div className="mt-6 grid gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-[var(--denim-50)] px-4 py-3 text-sm text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-[var(--denim-600)]" />
                  Likes
                </span>
                <span>Coming soon</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[var(--denim-50)] px-4 py-3 text-sm text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <MessageSquareMore className="h-4 w-4 text-[var(--denim-600)]" />
                  Comments
                </span>
                <span>Coming soon</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The page structure is ready for future likes, comments, and richer collaboration features.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

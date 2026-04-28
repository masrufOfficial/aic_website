import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type ResearchCardProps = {
  research: {
    id: string;
    title: string;
    description: string;
    images: string[];
    tags: string[];
    createdAt: string | Date;
    author: {
      name: string;
    };
  };
};

export function ResearchCard({ research }: ResearchCardProps) {
  const coverImage = research.images[0] || "https://picsum.photos/seed/research/1200/900";

  return (
    <Link href={`/research/${research.id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden border-slate-200/80 bg-white/85 p-0 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(37,99,235,0.55)]">
        <div className="relative h-56 overflow-hidden bg-[var(--denim-50)]">
          <img
            alt={research.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={coverImage}
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--denim-600)]">
              Research
            </p>
            <p className="text-xs text-slate-500">{formatDate(research.createdAt)}</p>
          </div>

          <h3 className="mt-4 text-xl font-semibold text-slate-950 transition group-hover:text-[var(--denim-700)]">
            {research.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{research.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {research.tags.slice(0, 4).map((tag) => (
              <Badge className="bg-[var(--denim-50)] text-[var(--denim-700)]" key={tag}>
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <p className="text-sm font-medium text-slate-900">{research.author.name}</p>
            <p className="text-sm text-slate-500">Active membership unlocks the full publication</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

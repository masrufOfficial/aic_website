"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ResearchCard } from "@/components/research/research-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ResearchItem = {
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

export function ResearchGrid({ items }: { items: ResearchItem[] }) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const tags = useMemo(() => {
    const values = new Set<string>();
    items.forEach((item) => item.tags.forEach((tag) => values.add(tag)));
    return ["all", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.author.name.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesTag = selectedTag === "all" || item.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [items, search, selectedTag]);

  return (
    <div className="space-y-8">
      <Card className="border-slate-200/80 bg-white/85">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)]">
              Discover Research
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Search by title, author, or topic, and filter by tags as the research archive grows.
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-10"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search research..."
                value={search}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                className="cursor-pointer"
                key={tag}
                onClick={() => setSelectedTag(tag)}
                type="button"
              >
                <Badge
                  className={isActive ? "bg-[var(--denim-600)] text-white" : "bg-[var(--denim-50)] text-[var(--denim-700)]"}
                >
                  {tag === "all" ? "All Topics" : `#${tag}`}
                </Badge>
              </button>
            );
          })}
        </div>
      </Card>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((research) => (
            <ResearchCard key={research.id} research={research} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-300 bg-white/75 text-center">
          <p className="text-lg font-semibold text-slate-900">No research matched your filters.</p>
          <p className="mt-2 text-sm text-slate-600">Try a different keyword or clear the selected tag.</p>
        </Card>
      )}
    </div>
  );
}

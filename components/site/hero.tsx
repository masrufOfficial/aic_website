import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageDisplay } from "@/components/ui/ImageDisplay";

export function Hero({
  badge,
  title,
  subtitle,
  imageUrl,
  imageRatio,
  imageFit,
  imageRounded,
}: {
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageRatio: "16:9" | "1:1" | "4:3";
  imageFit: "cover" | "contain";
  imageRounded: boolean;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.55),_transparent_40%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="relative space-y-6 md:space-y-8">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white backdrop-blur md:text-sm">
            <Sparkles className="h-4 w-4 shrink-0 text-[var(--denim-200)]" />
            <span className="truncate">{badge}</span>
          </div>
          <div className="space-y-4 md:space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-200 md:text-lg md:leading-8">{subtitle}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/membership">
              <Button className="w-full sm:w-auto" size="lg">
                Apply for Membership
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explore-us">
              <Button className="w-full sm:w-auto" size="lg" variant="secondary">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>

        <Card className="overflow-hidden border-white/10 bg-white/10 p-2 text-white">
          <ImageDisplay
            alt="Featured BUBT AI community visual"
            aspectRatio={imageRatio}
            fit={imageFit}
            rounded={imageRounded}
            src={imageUrl}
          >
            <div className="flex h-full flex-col justify-end bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--denim-200)] md:text-sm">Featured Community</p>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Collaborative workshops, research circles, and real student impact.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-200 md:leading-7">
                Showcase events, community documentation, alumni achievements, and a responsive member-first experience in one secure platform.
              </p>
            </div>
          </ImageDisplay>
        </Card>
      </div>
    </section>
  );
}

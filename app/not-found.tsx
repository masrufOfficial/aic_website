import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-500)]">404</p>
      <h1 className="text-4xl font-semibold text-slate-950">Page not found</h1>
      <p className="max-w-xl text-sm leading-7 text-slate-600">The page you requested does not exist or may have been moved.</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}

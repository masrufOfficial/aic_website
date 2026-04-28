export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)] md:text-sm">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl lg:text-5xl">{title}</h2>
      <p className="text-base leading-7 text-slate-600 md:text-lg">{description}</p>
    </div>
  );
}

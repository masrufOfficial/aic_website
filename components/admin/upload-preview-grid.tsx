"use client";

type PreviewItem = {
  id: string;
  url: string;
  name: string;
};

export function UploadPreviewGrid({
  items,
  aspect = "square",
}: {
  items: PreviewItem[];
  aspect?: "square" | "landscape";
}) {
  const aspectClass = aspect === "landscape" ? "aspect-[4/3]" : "aspect-square";

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <div className={`overflow-hidden rounded-2xl bg-slate-100 ${aspectClass}`}>
            <img alt={item.name} className="h-full w-full object-cover" src={item.url} />
          </div>
          <p className="truncate text-xs text-slate-500">{item.name}</p>
        </div>
      ))}
    </div>
  );
}

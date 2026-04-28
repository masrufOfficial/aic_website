import { Card } from "@/components/ui/card";

export function StatsGrid({
  stats,
}: {
  stats: {
    members: number;
    events: number;
    galleryItems: number;
    activeMemberships: number;
  };
}) {
  const items = [
    { label: "Members", value: stats.members },
    { label: "Events", value: stats.events },
    { label: "Gallery Posts", value: stats.galleryItems },
    { label: "Active Memberships", value: stats.activeMemberships },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="border-slate-200/80 bg-white/85">
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}

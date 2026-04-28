import { prisma } from "@/lib/prisma";

export const contentDefaults = {
  club_name: "BUBT AI Community Platform",
  logo_url: "",
  logo_size: "medium",
  logo_style: "rounded",
  logo_fit_mode: "contain",
  logo_crop: "square",
  image_ratio: "4:3",
  image_fit: "cover",
  image_style: "rounded",
  hero_badge: "Empowering the next generation of AI builders at BUBT",
  hero_title: "Build, learn, and lead with the BUBT AI Community Platform.",
  hero_subtitle:
    "A modern digital home for student membership, event discovery, community galleries, committee leadership, and activity tracking.",
  hero_image_url:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  vision_mission:
    "We nurture applied AI talent through open collaboration. The platform helps the community document legitimacy, celebrate achievements, onboard new members, and maintain transparent leadership operations.",
  about_text:
    "The BUBT AI Community is a trusted student-led platform focused on applied learning, collaboration, events, and leadership in artificial intelligence.",
} as const;

export type ContentKey = keyof typeof contentDefaults;
export type ContentMap = Record<ContentKey, string>;

export async function getContentMap() {
  const entries = await prisma.content.findMany({
    where: {
      key: {
        in: Object.keys(contentDefaults),
      },
    },
  });

  const map = { ...contentDefaults } as ContentMap;

  for (const entry of entries) {
    const key = entry.key as ContentKey;
    if (key in map) {
      map[key] = entry.value;
    }
  }

  return map;
}

export async function upsertContentMap(values: Partial<ContentMap>) {
  await Promise.all(
    Object.entries(values).map(([key, value]) =>
      prisma.content.upsert({
        where: { key },
        update: { value: value ?? "" },
        create: {
          key,
          value: value ?? "",
        },
      })
    )
  );
}

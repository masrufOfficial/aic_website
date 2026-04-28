import { getContentMap } from "@/lib/content";
import { expireMemberships } from "@/lib/membership";
import { prisma } from "@/lib/prisma";

export async function getHomePageData() {
  await expireMemberships();

  const [featuredEvents, committee, gallery, stats, content] = await Promise.all([
    prisma.event.findMany({
      orderBy: { date: "asc" },
      take: 3,
    }),
    prisma.committee.findMany({
      where: { isAlumni: false },
      take: 3,
    }),
    prisma.gallery.findMany({
      include: { event: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.gallery.count(),
      prisma.membership.count({
        where: { status: "active" },
      }),
    ]),
    getContentMap(),
  ]);

  return {
    featuredEvents,
    committee,
    gallery,
    content,
    stats: {
      members: stats[0],
      events: stats[1],
      galleryItems: stats[2],
      activeMemberships: stats[3],
    },
  };
}

export async function getExplorePageData() {
  const [events, industrialVisits] = await Promise.all([
    prisma.event.findMany({
      orderBy: { date: "asc" },
    }),
    prisma.event.findMany({
      where: { type: "industrial_visit" },
      orderBy: { date: "asc" },
    }),
  ]);

  return {
    events,
    industrialVisits,
  };
}

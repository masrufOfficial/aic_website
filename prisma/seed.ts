import bcrypt from "bcryptjs";
import { PrismaClient, EventType, MembershipStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const defaultContent = [
  {
    key: "club_name",
    value: "BUBT AI Community Platform",
  },
  {
    key: "logo_url",
    value: "",
  },
  {
    key: "logo_size",
    value: "medium",
  },
  {
    key: "logo_style",
    value: "rounded",
  },
  {
    key: "logo_fit_mode",
    value: "contain",
  },
  {
    key: "logo_crop",
    value: "square",
  },
  {
    key: "image_ratio",
    value: "4:3",
  },
  {
    key: "image_fit",
    value: "cover",
  },
  {
    key: "image_style",
    value: "rounded",
  },
  {
    key: "hero_badge",
    value: "Empowering the next generation of AI builders at BUBT",
  },
  {
    key: "hero_title",
    value: "Build, learn, and lead with the BUBT AI Community Platform.",
  },
  {
    key: "hero_subtitle",
    value: "A modern digital home for student membership, event discovery, community galleries, committee leadership, and activity tracking.",
  },
  {
    key: "hero_image_url",
    value: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    key: "vision_mission",
    value: "We nurture applied AI talent through open collaboration. The platform helps the community document legitimacy, celebrate achievements, onboard new members, and maintain transparent leadership operations.",
  },
  {
    key: "about_text",
    value: "The BUBT AI Community is a trusted student-led platform focused on applied learning, collaboration, events, and leadership in artificial intelligence.",
  },
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const memberPassword = await bcrypt.hash("Member12345!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bubt.ai" },
    update: {
      name: "Platform Admin",
      password: adminPassword,
      role: UserRole.admin,
      membershipStatus: MembershipStatus.active,
    },
    create: {
      name: "Platform Admin",
      email: "admin@bubt.ai",
      password: adminPassword,
      role: UserRole.admin,
      membershipStatus: MembershipStatus.active,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@bubtai.org" },
    update: {},
    create: {
      name: "Demo Member",
      email: "member@bubtai.org",
      password: memberPassword,
      role: UserRole.user,
      membershipStatus: MembershipStatus.pending,
    },
  });

  const events = await Promise.all([
    prisma.event.upsert({
      where: { id: "evt-national-ai-summit" },
      update: {},
      create: {
        id: "evt-national-ai-summit",
        title: "National AI Summit 2026",
        type: EventType.national,
        date: new Date("2026-06-15T10:00:00Z"),
        description: "A flagship summit connecting students, researchers, and industry leaders around applied AI.",
        location: "BUBT Main Auditorium",
        coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      },
    }),
    prisma.event.upsert({
      where: { id: "evt-domestic-build-day" },
      update: {},
      create: {
        id: "evt-domestic-build-day",
        title: "Domestic Build Day",
        type: EventType.domestic,
        date: new Date("2026-05-08T09:30:00Z"),
        description: "Hands-on project building day for community members working on real prototypes.",
        location: "Innovation Lab",
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      },
    }),
    prisma.event.upsert({
      where: { id: "evt-industry-visit" },
      update: {},
      create: {
        id: "evt-industry-visit",
        title: "Industrial Visit to AI Research Lab",
        type: EventType.industrial_visit,
        date: new Date("2026-07-02T07:00:00Z"),
        description: "A guided industry visit with mentorship sessions and product demos.",
        location: "Dhaka AI Research Center",
        coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      },
    }),
  ]);

  await prisma.membership.createMany({
    data: [
      {
        userId: member.id,
        status: MembershipStatus.pending,
        fullName: member.name,
        email: member.email,
        phone: "+8801000000000",
        membershipId: "AIC-DEMO-001",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.committee.createMany({
    data: [
      {
        name: "Afsana Rahman",
        role: "President",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Mahin Hasan",
        role: "Vice President",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Nafisa Chowdhury",
        role: "General Secretary",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Tanvir Ahmed",
        role: "Alumni Mentor",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        isAlumni: true,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.gallery.createMany({
    data: events.flatMap((event, index) => [
      {
        eventId: event.id,
        imageUrl: `https://picsum.photos/seed/${index + 1}/900/900`,
        caption: `${event.title} moment one`,
      },
      {
        eventId: event.id,
        imageUrl: `https://picsum.photos/seed/${index + 20}/900/900`,
        caption: `${event.title} moment two`,
      },
    ]),
    skipDuplicates: true,
  });

  await prisma.activity.createMany({
    data: [
      { userId: admin.id, label: "Admin account seeded" },
      { userId: member.id, label: "Membership application submitted" },
    ],
  });

  await Promise.all(
    defaultContent.map((item) =>
      prisma.content.upsert({
        where: { key: item.key },
        update: { value: item.value },
        create: item,
      })
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

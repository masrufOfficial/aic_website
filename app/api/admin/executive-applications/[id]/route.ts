import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { apiError, handleApiError, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { executiveApplicationReviewSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const { id } = await params;
    const body = await parseBody(request, executiveApplicationReviewSchema);

    const application = await prisma.executiveApplication.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      return apiError("Application not found.", 404);
    }

    const updated = await prisma.executiveApplication.update({
      where: { id },
      data: { status: body.status },
      include: { user: true },
    });

    if (body.status === "approved") {
      await prisma.$transaction([
        prisma.committee.upsert({
          where: {
            userId: application.userId,
          },
          update: {
            name: application.fullName,
            role: "Executive Member",
            group: "executive",
            image: application.user.image ?? application.user.profileImage ?? "https://picsum.photos/seed/executive/800/800",
            isAlumni: false,
          },
          create: {
            userId: application.userId,
            name: application.fullName,
            role: "Executive Member",
            group: "executive",
            image: application.user.image ?? application.user.profileImage ?? "https://picsum.photos/seed/executive/800/800",
            isAlumni: false,
          },
        }),
        prisma.activity.create({
          data: {
            userId: application.userId,
            label: "Executive application approved",
          },
        }),
      ]);
    } else {
      await prisma.activity.create({
        data: {
          userId: application.userId,
          label: "Executive application rejected",
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, "Unable to review executive application.", 400);
  }
}

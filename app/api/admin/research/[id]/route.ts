import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { apiError, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { researchStatusUpdateSchema } from "@/lib/validators";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const { id } = await params;
    const body = await parseBody(request, researchStatusUpdateSchema);

    const updated = await prisma.research.update({
      where: { id },
      data: {
        status: body.status,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await prisma.activity.create({
      data: {
        userId: updated.authorId,
        label: `Your research "${updated.title}" was ${updated.status}.`,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return apiError("Unable to update research status.", 400);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const { id } = await params;
    await prisma.research.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return apiError("Unable to delete research.", 400);
  }
}

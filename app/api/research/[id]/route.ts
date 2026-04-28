import { NextResponse } from "next/server";

import { apiError, handleApiError } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeResearchContent } from "@/lib/research";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentApiUser();
    const { id } = await params;

    const research = await prisma.research.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!research) {
      return apiError("Research not found.", 404);
    }

    const canResolveRecord =
      research.status === "approved" ||
      (user && (user.role === "admin" || user.id === research.authorId));

    if (!canResolveRecord) {
      return apiError("Research not found.", 404);
    }

    const hasFullAccess =
      user?.role === "admin" ||
      user?.id === research.authorId ||
      user?.membershipStatus === "active";

    if (!hasFullAccess) {
      return NextResponse.json({
        id: research.id,
        title: research.title,
        description: research.description,
        content: summarizeResearchContent(research.content, 420),
        images: research.images.slice(0, 1),
        tags: research.tags,
        createdAt: research.createdAt,
        author: research.author,
        restricted: true,
      });
    }

    return NextResponse.json({
      ...research,
      restricted: false,
    });
  } catch (error) {
    return handleApiError(error, "Unable to fetch research.", 400);
  }
}

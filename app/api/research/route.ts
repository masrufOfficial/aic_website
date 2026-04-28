import { NextResponse } from "next/server";

import { apiError, handleApiError, parseBody } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { normalizeResearchTags } from "@/lib/research";
import { prisma } from "@/lib/prisma";
import { enforceMutationSecurity, sanitizePlainText } from "@/lib/security";
import { researchCreateSchema } from "@/lib/validators";

export async function GET() {
  const research = await prisma.research.findMany({
    where: { status: "approved" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(research);
}

export async function POST(request: Request) {
  try {
    const securityError = enforceMutationSecurity(request, {
      rateLimitKey: "research-submit",
      limit: 10,
      windowMs: 60_000,
    });
    if (securityError) {
      return securityError;
    }

    const user = await getCurrentApiUser();
    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    const body = await parseBody(request, researchCreateSchema);
    const research = await prisma.research.create({
      data: {
        title: sanitizePlainText(body.title),
        description: sanitizePlainText(body.description),
        content: body.content.trim(),
        authorId: user.id,
        status: "pending",
        githubUrl: body.githubUrl || null,
        paperUrl: body.paperUrl || null,
        demoUrl: body.demoUrl || null,
        images: body.images,
        tags: normalizeResearchTags(body.tags.map((tag) => sanitizePlainText(tag))),
      },
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

    await prisma.activity.create({
      data: {
        userId: user.id,
        label: `Submitted research "${research.title}" for review`,
      },
    });

    return NextResponse.json(research, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Unable to submit research.", 400);
  }
}

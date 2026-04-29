import { NextResponse } from "next/server";

import { apiError, handleApiError, parseBody } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { isVerifiedMember } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { enforceMutationSecurity, sanitizePlainText } from "@/lib/security";
import { executiveApplicationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const securityError = enforceMutationSecurity(request, {
      rateLimitKey: "executive-application",
      limit: 4,
      windowMs: 60_000,
    });
    if (securityError) {
      return securityError;
    }

    const user = await getCurrentApiUser();
    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    if (!isVerifiedMember(user)) {
      return apiError("Only verified members can apply for the executive panel.", 403);
    }

    const body = await parseBody(request, executiveApplicationSchema);
    const existing = await prisma.executiveApplication.findFirst({
      where: {
        userId: user.id,
        status: "pending",
      },
    });

    if (existing) {
      return apiError("You already have a pending executive application.", 409);
    }

    const application = await prisma.executiveApplication.create({
      data: {
        userId: user.id,
        fullName: sanitizePlainText(body.fullName),
        cvUrl: body.cvUrl,
        skills: sanitizePlainText(body.skills),
        motivation: sanitizePlainText(body.motivation),
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        label: "Submitted executive application",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Unable to submit executive application.", 400);
  }
}

import { NextResponse } from "next/server";

import { apiError, handleApiError, parseBody } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceMutationSecurity, sanitizePlainText } from "@/lib/security";
import { updateUserSchema } from "@/lib/validators";

export async function PATCH(request: Request) {
  try {
    const securityError = enforceMutationSecurity(request, {
      rateLimitKey: "profile-update",
      limit: 15,
      windowMs: 60_000,
    });
    if (securityError) {
      return securityError;
    }

    const user = await getCurrentApiUser();
    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    const body = await parseBody(request, updateUserSchema.pick({
      name: true,
      email: true,
      profileImage: true,
    }));

    if (body.profileImage) {
      try {
        const parsedUrl = new URL(body.profileImage);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          return apiError("Profile image URL must use http or https.", 400);
        }
      } catch {
        return apiError("Profile image URL is invalid.", 400);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name ? sanitizePlainText(body.name) : undefined,
        email: body.email?.trim().toLowerCase(),
        profileImage: body.profileImage || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        membershipStatus: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleApiError(error, "Unable to update profile.", 400);
  }
}

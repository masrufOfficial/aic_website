import { NextResponse } from "next/server";

import { apiError, handleApiError, parseBody } from "@/lib/api";
import { comparePassword, getCurrentApiUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceMutationSecurity } from "@/lib/security";
import { changePasswordSchema } from "@/lib/validators";

export async function PATCH(request: Request) {
  try {
    const securityError = enforceMutationSecurity(request, {
      rateLimitKey: "password-change",
      limit: 8,
      windowMs: 60_000,
    });
    if (securityError) {
      return securityError;
    }

    const user = await getCurrentApiUser();
    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    const body = await parseBody(request, changePasswordSchema);
    if (!user.password) {
      return apiError("This account uses social login. Add password management separately if needed.", 400);
    }

    const isValid = await comparePassword(body.currentPassword, user.password);

    if (!isValid) {
      return apiError("Current password is incorrect.", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hashPassword(body.newPassword),
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        label: "Updated account password",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "Unable to change password.", 400);
  }
}

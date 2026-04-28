import { NextResponse } from "next/server";

import { apiError, handleApiError, parseBody } from "@/lib/api";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceMutationSecurity } from "@/lib/security";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const securityError = enforceMutationSecurity(request, {
      rateLimitKey: "auth-register",
      limit: 5,
      windowMs: 60_000,
    });
    if (securityError) {
      return securityError;
    }

    const body = await parseBody(request, registerSchema);
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return apiError("An account with this email already exists.", 409);
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: await hashPassword(body.password),
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        label: "Account created",
      },
    });

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      membershipStatus: user.membershipStatus,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return handleApiError(error, "Unable to create account.");
  }
}

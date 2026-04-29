import { NextResponse } from "next/server";

import { apiError, handleApiError, parseBody } from "@/lib/api";
import { comparePassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceMutationSecurity } from "@/lib/security";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const securityError = enforceMutationSecurity(request, {
      rateLimitKey: "auth-login",
      limit: 8,
      windowMs: 60_000,
    });
    if (securityError) {
      return securityError;
    }

    const body = await parseBody(request, loginSchema);
    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (!user?.password || !(await comparePassword(body.password, user.password))) {
      return apiError("Invalid email or password.", 401);
    }

    if (!user.emailVerified) {
      return apiError("Please verify your email before logging in.", 403);
    }

    await prisma.activity.create({
      data: {
        userId: user.id,
        label: "Logged in",
      },
    });

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      membershipStatus: user.membershipStatus,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

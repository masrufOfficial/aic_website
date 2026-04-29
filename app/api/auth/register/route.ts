import { NextResponse } from "next/server";

import { apiError, handleApiError, parseBody } from "@/lib/api";
import { hashPassword } from "@/lib/auth";
import { createEmailVerificationToken, sendVerificationEmail } from "@/lib/email";
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
        email: body.email.toLowerCase(),
        password: await hashPassword(body.password),
        role: "user",
        emailVerified: false,
      },
    });

    const token = await createEmailVerificationToken(user.id);
    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token,
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        label: "Account created and verification email sent",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account created. Please verify your email before logging in.",
    });
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

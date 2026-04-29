import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${origin}/login?verified=invalid`);
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expiresAt < new Date()) {
    if (record) {
      await prisma.emailVerificationToken.delete({
        where: { token },
      });
    }

    return NextResponse.redirect(`${origin}/login?verified=expired`);
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    }),
    prisma.emailVerificationToken.delete({
      where: { token },
    }),
  ]);

  return NextResponse.redirect(`${origin}/login?verified=success`);
}

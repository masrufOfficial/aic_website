-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'moderator';

-- AlterTable
ALTER TABLE "User"
  ALTER COLUMN "password" DROP NOT NULL,
  ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "image" TEXT,
  ADD COLUMN "membershipExpiry" TIMESTAMP(3);

-- Backfill existing users so current accounts continue to work after verification is introduced.
UPDATE "User"
SET
  "emailVerified" = true,
  "image" = COALESCE("profileImage", "image"),
  "membershipExpiry" = (
    SELECT "expiresAt"
    FROM "Membership"
    WHERE "Membership"."userId" = "User"."id"
    ORDER BY "createdAt" DESC
    LIMIT 1
  );

-- AlterTable
ALTER TABLE "Committee"
  ADD COLUMN "group" TEXT NOT NULL DEFAULT 'executive',
  ADD COLUMN "userId" TEXT;

CREATE UNIQUE INDEX "Committee_userId_key" ON "Committee"("userId");

-- CreateTable
CREATE TABLE "ExecutiveApplication" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "cvUrl" TEXT NOT NULL,
  "skills" TEXT NOT NULL,
  "motivation" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExecutiveApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EmailVerificationToken_token_key" ON "EmailVerificationToken"("token");
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");

-- ForeignKeys
ALTER TABLE "ExecutiveApplication"
  ADD CONSTRAINT "ExecutiveApplication_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

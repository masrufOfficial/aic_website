-- AlterEnum
ALTER TYPE "MembershipStatus" ADD VALUE 'expired';

-- AlterTable
ALTER TABLE "User" ADD COLUMN "profileImage" TEXT;

-- AlterTable
ALTER TABLE "Membership"
  ALTER COLUMN "id" DROP DEFAULT,
  ALTER COLUMN "id" TYPE TEXT,
  ADD COLUMN "approvedAt" TIMESTAMP(3),
  ADD COLUMN "email" TEXT,
  ADD COLUMN "expiresAt" TIMESTAMP(3),
  ADD COLUMN "fullName" TEXT,
  ADD COLUMN "membershipId" TEXT,
  ADD COLUMN "phone" TEXT;

-- Backfill existing rows with best-effort placeholders from the related user.
UPDATE "Membership" m
SET
  "fullName" = u."name",
  "email" = u."email",
  "phone" = COALESCE("phone", 'Not provided'),
  "membershipId" = CONCAT('LEGACY-', SUBSTRING(m."id" FROM 1 FOR 8))
FROM "User" u
WHERE m."userId" = u."id";

-- Convert approved active memberships into annual memberships.
UPDATE "Membership"
SET
  "approvedAt" = COALESCE("approvedAt", "updatedAt", "createdAt"),
  "expiresAt" = COALESCE("expiresAt", COALESCE("updatedAt", "createdAt") + INTERVAL '1 year')
WHERE "status" = 'active';

ALTER TABLE "Membership"
  ALTER COLUMN "fullName" SET NOT NULL,
  ALTER COLUMN "email" SET NOT NULL,
  ALTER COLUMN "phone" SET NOT NULL,
  ALTER COLUMN "membershipId" SET NOT NULL;

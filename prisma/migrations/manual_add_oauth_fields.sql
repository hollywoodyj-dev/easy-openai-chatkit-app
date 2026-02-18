-- Migration: Add OAuth support fields to User table
-- Run this manually on your production database

-- Make passwordHash optional (for OAuth users)
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- Add OAuth fields
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "oauthProvider" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "oauthId" TEXT;

-- Add unique constraint for OAuth provider + ID combination
-- Note: This allows NULL values, so multiple NULLs are allowed (for email/password users)
CREATE UNIQUE INDEX IF NOT EXISTS "User_oauthProvider_oauthId_key" 
ON "User" ("oauthProvider", "oauthId") 
WHERE "oauthProvider" IS NOT NULL AND "oauthId" IS NOT NULL;

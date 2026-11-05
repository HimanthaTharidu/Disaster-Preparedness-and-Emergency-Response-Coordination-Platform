-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('operator', 'admin', 'field');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('reported', 'verified', 'assigned', 'resolved');

-- CreateEnum
CREATE TYPE "IncidentPriority" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "IncidentStatus" NOT NULL,
    "priority" "IncidentPriority" NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shelter" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "capacity" INTEGER,
    "available" INTEGER,

    CONSTRAINT "Shelter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "tokenHash" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("tokenHash")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

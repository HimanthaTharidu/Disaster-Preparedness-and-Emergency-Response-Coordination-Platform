/*
  Warnings:

  - Added the required column `hazard` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peopleAtRisk` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Incident` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `status` on the `Incident` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priority` on the `Incident` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "hazard" TEXT NOT NULL,
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "peopleAtRisk" INTEGER NOT NULL,
ADD COLUMN     "place" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" TEXT NOT NULL,
ALTER COLUMN "reportedAt" DROP DEFAULT;

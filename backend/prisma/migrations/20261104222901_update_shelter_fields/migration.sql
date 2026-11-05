/*
  Warnings:

  - You are about to drop the column `address` on the `Shelter` table. All the data in the column will be lost.
  - You are about to drop the column `available` on the `Shelter` table. All the data in the column will be lost.
  - Added the required column `lat` to the `Shelter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Shelter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupancy` to the `Shelter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place` to the `Shelter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Shelter` table without a default value. This is not possible if the table is not empty.
  - Made the column `capacity` on table `Shelter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Shelter" DROP COLUMN "address",
DROP COLUMN "available",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "occupancy" INTEGER NOT NULL,
ADD COLUMN     "place" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "capacity" SET NOT NULL;

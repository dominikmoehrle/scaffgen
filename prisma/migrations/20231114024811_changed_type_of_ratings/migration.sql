/*
  Warnings:

  - You are about to drop the column `alignmentRating` on the `Scaffold` table. All the data in the column will be lost.
  - You are about to drop the column `easeUseRating` on the `Scaffold` table. All the data in the column will be lost.
  - You are about to drop the column `engagementRating` on the `Scaffold` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scaffold" DROP COLUMN "alignmentRating",
DROP COLUMN "easeUseRating",
DROP COLUMN "engagementRating",
ADD COLUMN     "alignmentRatings" INTEGER[],
ADD COLUMN     "easeUseRatings" INTEGER[],
ADD COLUMN     "engagementRatings" INTEGER[];

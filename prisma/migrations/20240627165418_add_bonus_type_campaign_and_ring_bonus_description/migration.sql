-- AlterEnum
ALTER TYPE "BonusType" ADD VALUE 'CAMPAIGN';

-- AlterTable
ALTER TABLE "ring_bonus" ADD COLUMN     "description" TEXT;

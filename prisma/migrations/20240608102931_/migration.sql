/*
  Warnings:

  - You are about to drop the `ring_checker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ring_checker" DROP CONSTRAINT "ring_checker_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "without_bonus_rings_points" BIGINT NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "ring_checker";

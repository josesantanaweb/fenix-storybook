/*
  Warnings:

  - You are about to alter the column `given_blast_poins` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(24,4)`.
  - You are about to alter the column `pending_blast_points` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(24,4)`.
  - You are about to alter the column `given_blast_gold_points` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(24,4)`.
  - You are about to alter the column `pending_blast_gold_points` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(24,4)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "given_blast_poins" SET DATA TYPE DECIMAL(24,4),
ALTER COLUMN "pending_blast_points" SET DATA TYPE DECIMAL(24,4),
ALTER COLUMN "given_blast_gold_points" SET DATA TYPE DECIMAL(24,4),
ALTER COLUMN "pending_blast_gold_points" SET DATA TYPE DECIMAL(24,4);

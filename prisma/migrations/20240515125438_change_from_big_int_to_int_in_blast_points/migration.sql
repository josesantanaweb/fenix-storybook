/*
  Warnings:

  - You are about to alter the column `given_blast_poins` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pending_blast_points` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `given_blast_gold_points` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pending_blast_gold_points` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "given_blast_poins" SET DATA TYPE INTEGER,
ALTER COLUMN "pending_blast_points" SET DATA TYPE INTEGER,
ALTER COLUMN "given_blast_gold_points" SET DATA TYPE INTEGER,
ALTER COLUMN "pending_blast_gold_points" SET DATA TYPE INTEGER;

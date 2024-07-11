/*
  Warnings:

  - Added the required column `pool_id` to the `ring_batch_distribution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ring_batch_distribution" ADD COLUMN     "pool_id" TEXT NOT NULL;

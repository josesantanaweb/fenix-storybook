-- AlterTable
ALTER TABLE "users" ALTER COLUMN "accumulated_rings_points" SET DATA TYPE BIGINT,
ALTER COLUMN "unclaimed_rings_points" SET DATA TYPE BIGINT,
ALTER COLUMN "given_blast_poins" SET DATA TYPE BIGINT,
ALTER COLUMN "pending_blast_points" SET DATA TYPE BIGINT,
ALTER COLUMN "given_blast_gold_points" SET DATA TYPE BIGINT,
ALTER COLUMN "pending_blast_gold_points" SET DATA TYPE BIGINT;

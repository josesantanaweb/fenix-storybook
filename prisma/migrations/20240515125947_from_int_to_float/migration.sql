-- AlterTable
ALTER TABLE "users" ALTER COLUMN "given_blast_poins" SET DEFAULT 0,
ALTER COLUMN "given_blast_poins" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "pending_blast_points" SET DEFAULT 0,
ALTER COLUMN "pending_blast_points" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "given_blast_gold_points" SET DEFAULT 0,
ALTER COLUMN "given_blast_gold_points" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "pending_blast_gold_points" SET DEFAULT 0,
ALTER COLUMN "pending_blast_gold_points" SET DATA TYPE DOUBLE PRECISION;

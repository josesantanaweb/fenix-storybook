-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_DATE,
    "updated_at" DATE NOT NULL,
    "accumulated_rings_points" INTEGER NOT NULL DEFAULT 0,
    "unclaimed_rings_points" INTEGER NOT NULL DEFAULT 0,
    "given_blast_poins" INTEGER NOT NULL DEFAULT 0,
    "pending_blast_points" INTEGER NOT NULL DEFAULT 0,
    "given_blast_gold_points" INTEGER NOT NULL DEFAULT 0,
    "pending_blast_gold_points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

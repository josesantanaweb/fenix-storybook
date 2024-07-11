-- CreateTable
CREATE TABLE "ring_batch_distribution" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batch_data" JSONB NOT NULL,

    CONSTRAINT "ring_batch_distribution_pkey" PRIMARY KEY ("id")
);

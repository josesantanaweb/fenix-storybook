-- CreateTable
CREATE TABLE "ring_distribution" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT NOT NULL,
    "pool_id" TEXT NOT NULL,
    "ring_points" BIGINT NOT NULL,
    "gold_points" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ring_distribution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ring_distribution" ADD CONSTRAINT "ring_distribution_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

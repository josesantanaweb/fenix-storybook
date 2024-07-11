-- CreateTable
CREATE TABLE "rings_extra_data" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "gold_qualifying_rings" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "potential_gold_reward" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "rings_extra_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rings_extra_data_user_id_key" ON "rings_extra_data"("user_id");

-- AddForeignKey
ALTER TABLE "rings_extra_data" ADD CONSTRAINT "rings_extra_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

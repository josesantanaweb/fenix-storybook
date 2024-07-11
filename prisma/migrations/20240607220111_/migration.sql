-- CreateEnum
CREATE TYPE "BonusType" AS ENUM ('NFT');

-- CreateTable
CREATE TABLE "ring_bonus" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "bonus_type" "BonusType" NOT NULL,
    "ring_points" BIGINT NOT NULL,
    "gold_points" BIGINT NOT NULL,

    CONSTRAINT "ring_bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ring_checker" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ring_points" BIGINT NOT NULL,

    CONSTRAINT "ring_checker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ring_checker_user_id_key" ON "ring_checker"("user_id");

-- AddForeignKey
ALTER TABLE "ring_bonus" ADD CONSTRAINT "ring_bonus_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ring_checker" ADD CONSTRAINT "ring_checker_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

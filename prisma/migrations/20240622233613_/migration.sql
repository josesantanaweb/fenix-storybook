-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('ADD_LIQUIDITY', 'SWAP');

-- CreateTable
CREATE TABLE "action_event" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "event_type" "EventType" NOT NULL,

    CONSTRAINT "action_event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "action_event" ADD CONSTRAINT "action_event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

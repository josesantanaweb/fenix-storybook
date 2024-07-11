-- CreateTable
CREATE TABLE "referrals_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rings" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "referrals_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "referrals_events" ADD CONSTRAINT "referrals_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

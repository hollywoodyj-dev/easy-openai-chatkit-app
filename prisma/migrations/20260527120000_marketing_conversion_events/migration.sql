-- CreateTable
CREATE TABLE "marketing_conversion_events" (
    "id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT,
    "source" TEXT,
    "lp" TEXT,
    "ad_group" TEXT,
    "platform" TEXT,
    "path" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_conversion_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketing_conversion_events_event_name_created_at_idx" ON "marketing_conversion_events"("event_name", "created_at");

-- CreateIndex
CREATE INDEX "marketing_conversion_events_created_at_idx" ON "marketing_conversion_events"("created_at");

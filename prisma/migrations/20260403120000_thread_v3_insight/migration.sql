-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "emotion_signal" TEXT,
    "interpretation_pattern" TEXT,
    "tension_direction" TEXT,
    "intensity" TEXT,
    "label" TEXT,
    "closed_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Insight" ADD COLUMN     "thread_id" TEXT,
ADD COLUMN     "is_stable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stability_reason" TEXT;

-- Backfill: one active Thread per conversation that already has insights; attach legacy insights
INSERT INTO "Thread" ("id", "conversation_id", "is_active", "status", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, i."conversation_id", true, 'active', NOW(), NOW()
FROM (SELECT DISTINCT "conversation_id" FROM "Insight") AS i
WHERE NOT EXISTS (
  SELECT 1 FROM "Thread" t WHERE t."conversation_id" = i."conversation_id"
);

UPDATE "Insight" ins
SET
  "thread_id" = t."id",
  "is_stable" = ins."is_continuity_eligible"
FROM "Thread" t
WHERE ins."conversation_id" = t."conversation_id"
  AND t."is_active" = true
  AND ins."thread_id" IS NULL;

-- CreateIndex
CREATE INDEX "Thread_conversation_id_is_active_idx" ON "Thread"("conversation_id", "is_active");

-- CreateIndex
CREATE INDEX "Insight_thread_id_is_stable_createdAt_idx" ON "Insight"("thread_id", "is_stable", "createdAt");

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Reply thread (Tree / coordinator can append after assignee reply without overwriting reply_content)
ALTER TABLE "AgentTask" ADD COLUMN IF NOT EXISTS "reply_thread" JSONB;

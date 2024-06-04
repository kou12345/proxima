CREATE TABLE IF NOT EXISTS "memos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text DEFAULT ''Untitled'' NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "memos_user_id_unique" UNIQUE("user_id")
);

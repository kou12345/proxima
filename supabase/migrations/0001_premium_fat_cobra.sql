ALTER TABLE "memo_contents" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memo_contents" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memo_contents" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memos" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memos" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memos" ADD CONSTRAINT "memos_title_unique" UNIQUE("title");
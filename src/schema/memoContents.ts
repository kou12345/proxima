import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { memos } from "./memos";

export const memoContents = pgTable("memo_contents", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  memoId: uuid("memo_id").notNull().references(() => memos.id),
  userId: uuid("user_id").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

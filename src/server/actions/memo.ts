"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "../db";
import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import "server-only";
import { memoContents, memos } from "@/schema/schema";

export const getMemos = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // TODO limit, pagination
  const res = await db
    .select({
      id: memos.id,
      title: memos.title,
      content: memoContents.content,
    })
    .from(memos)
    .where(eq(memos.userId, user.id))
    .leftJoin(
      memoContents,
      eq(
        memoContents.id,
        db
          .select({ id: memoContents.id })
          .from(memoContents)
          .where(eq(memoContents.memoId, memos.id))
          .orderBy(desc(memoContents.createdAt))
          .limit(1),
      ),
    );

  revalidatePath("/memos");

  return res;
};

export const getMemoContentsByTitle = async (title: string) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const memo = await db.select({
    id: memos.id,
    title: memos.title,
    content: memoContents.content,
    createdAt: memoContents.createdAt,
  }).from(memos).where(eq(memos.title, title)).leftJoin(
    memoContents,
    eq(memos.id, memoContents.memoId),
  );

  if (memo.length === 0) {
    throw new Error("Not found");
  }

  return {
    id: memo[0].id,
    title: memo[0].title,
    contents: memo.map((item) => (
      {
        content: item.content || "",
        createdAt: item.createdAt?.toString() || "",
      }
    )),
  };
};

export const createMemo = async (title: string) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const memo = await db.insert(memos).values({
    userId: user.id,
    title,
  }).returning({
    id: memos.id,
    title: memos.title,
  });

  await db.insert(memoContents).values({
    memoId: memo[0].id,
    userId: user.id,
    content: "",
  });

  return memo;
};

export const updateMemoTitle = async (id: string, title: string) => {
  // TODO validation
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (title === "") {
    await db.transaction(async (tx) => {
      const untitleds = await tx.select({
        title: memos.title,
      }).from(memos).where(sql`title ~* '^Untitled(_\\d+)?$'`);

      // Untitledの_数字を取得
      const numbers = untitleds.map((untitled) => {
        const match = untitled.title.match(/Untitled_(\d+)/);
        if (match) {
          return parseInt(match[1], 10);
        }
        return 0;
      });

      // 最大値を取得
      const maxNumber = Math.max(...numbers);

      // Untitled_数字を作成
      const title = maxNumber === 0 ? "Untitled" : `Untitled_${maxNumber + 1}`;

      await tx.update(memos).set({
        title,
      }).where(eq(memos.id, id));

      return;
    });
  }

  const isExist = await db.select({ id: memos.id }).from(memos).where(
    eq(memos.title, title),
  );
  if (isExist.length > 0) {
    return {
      isExist: true,
    };
  }

  await db.update(memos).set({ title }).where(eq(memos.id, id));
};

export const createMemoContent = async (
  memoId: string,
  content: string,
) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.insert(memoContents).values({
    memoId: memoId,
    userId: user.id,
    content: content,
  });
};

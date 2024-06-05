"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "../db";
import { memos } from "@/schema/memos";
import { desc, eq, sql } from "drizzle-orm";

export const getMemos = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // TODO limit, pagination
  const res = await db.select({
    id: memos.id,
    title: memos.title,
    content: memos.content,
  }).from(memos).where(eq(memos.userId, user.id));

  return res;
};

export const getMemoByTitle = async (title: string) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // titleが”new"の場合はデータがないため、title, contentを空にして返す
  if (title === "new") {
    const latestId = await db.select({
      id: memos.id,
    }).from(memos).orderBy(desc(memos.createdAt)).limit(1);

    return {
      id: latestId[0].id,
      title: "",
      content: "",
    };
  }

  const memo = await db.select({
    id: memos.id,
    title: memos.title,
    content: memos.content,
  }).from(memos).where(eq(memos.title, title));

  if (memo.length === 0) {
    throw new Error("Not found");
  }

  return memo[0];
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

  // revalidateTag(`/memos/${id}`);
};

export const updateMemoContent = async (id: string, content: string) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.update(memos).set({ content }).where(eq(memos.id, id));

  // revalidateTag(`/memos/${id}`);
};

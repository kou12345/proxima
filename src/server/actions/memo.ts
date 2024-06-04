"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const getMemos = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase.from("memos").select(
    "id, title, content",
  )
    .eq(
      "user_id",
      user.id,
    );
  if (error) {
    throw error;
  }

  return data;
};

export const createMemo = async () => {
  const supabase = await createClient();
  // 認証チェック
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase.from("memos").insert({
    user_id: user.id,
  }).select("id");
  if (error) {
    throw error;
  }

  console.log(data);

  revalidateTag("/");
  redirect(`/memos/${data[0].id}`);
};

export const getMemoByTitle = async (title: string) => {
  console.log("getMemoByTitleの引数 : ", title);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase.from("memos").select(
    "id, title, content",
  )
    .eq(
      "title",
      title,
    );
  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Not found");
  }

  return data[0];
};

export const updateMemoTitle = async (id: string, title: string) => {
  // TODO validation
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (title === "") {
    title = "Untitled";
  }
  // すでに同じtitleが存在する場合はエラー
  const { data: { count } } = await supabase.from("memos").select("count(*)")
    .eq(
      "title",
      title,
    );
  if (count > 0 && title === "Untitled") {
    // Untitledに_数字をつける
  }

  const { error } = await supabase.from("memos").update({ title }).eq(
    "id",
    id,
  );
  if (error) {
    throw error;
  }

  // revalidateTag(`/memos/${id}`);
};

export const updateMemoContent = async (id: string, content: string) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("memos").update({ content }).eq(
    "id",
    id,
  );
  if (error) {
    throw error;
  }

  revalidateTag(`/memos/${id}`);
};

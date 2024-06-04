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

export const getMemo = async (id: string) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase.from("memos").select("title, content")
    .eq(
      "id",
      id,
    );
  if (error) {
    throw error;
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

  const { error } = await supabase.from("memos").update({ title }).eq(
    "id",
    id,
  );
  if (error) {
    throw error;
  }

  revalidateTag(`/memos/${id}`);
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

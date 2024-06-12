"use server";

import { revalidatePath } from "next/cache";
import { createMemo } from "./memo";
import { redirect } from "next/navigation";

// TODO redirectするまでloadingを表示したい

export const newMemo = async (formData: FormData) => {
  const title = formData.get("title") as string;

  await createMemo(title);

  revalidatePath("/memos");
  redirect(`/memos/${encodeURIComponent(title)}`);
};

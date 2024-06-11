"use server";

import { revalidatePath } from "next/cache";
import { createMemoContent } from "./memo";

export const post = async (memoId: string, formData: FormData) => {
  const content = formData.get("content") as string;

  await createMemoContent(memoId, content);

  revalidatePath("/memos");
};

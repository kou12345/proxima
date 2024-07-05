"use server";
import "server-only";
import { db } from "../db";
import { createClient } from "@/utils/supabase/server";
import { ocrResults } from "@/schema/schema";

// ocrResultsにメタデータを保存する
export const saveMetadataToOcrResults = async (
  {
    fileName,
    storagePath,
  }: {
    fileName: string;
    storagePath: string;
  },
) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const res = await db.insert(ocrResults).values({
    userId: user.id,
    fileName,
    storagePath,
    content: "",
  });
};

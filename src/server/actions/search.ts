"use server";
import { createClient } from "@/utils/supabase/server";
import "server-only";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { embeddingModel } from "../gemini";

const SIMILARITY_MULTIPLIER = -1;

export type SearchResult = {
  title: string;
  content: string;
  page_number: number;
  similarity: number;
};

export const similaritySearch = async ({
  text,
  matchThreshold,
  matchCount,
}: {
  text: string;
  matchThreshold: number;
  matchCount: number;
}): Promise<SearchResult[]> => {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  // textを embedding する
  let embeddingArray: number[];
  try {
    console.log("Generating embedding for:", text);
    const res = await embeddingModel.embedContent(text);
    embeddingArray = res.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }

  const queryEmbedding = "[" + embeddingArray.join(",") + "]";

  const res = await db.execute<SearchResult>(sql`
    select
      books.title,
      pages.content,
      pages.page_number,
      (embeddings.embedding <#> ${queryEmbedding}) * ${SIMILARITY_MULTIPLIER} as similarity
    from pages
    join books on books.id = pages.book_id
    join embeddings on embeddings.page_id = pages.id
    where (embeddings.embedding <#> ${queryEmbedding}) * ${SIMILARITY_MULTIPLIER} > ${matchThreshold}
    order by similarity desc
    limit ${matchCount};
  `);

  // TODO pageの文章丸ごと取得する

  return res;
};

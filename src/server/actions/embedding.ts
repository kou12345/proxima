"use server";

import "server-only";
import { EMBEDDING_MAX_INPUT_TOKENS, embeddingModel, model } from "../gemini";
import { db } from "../db";
import { embeddings } from "@/schema/schema";

const generateAndInsertEmbedding = async (
  content: string,
  pageId: string,
): Promise<void> => {
  const { totalTokens } = await model.countTokens(content);

  if (totalTokens <= EMBEDDING_MAX_INPUT_TOKENS) {
    // embedding
    const result = await embeddingModel.embedContent(content);

    // embeddingsテーブルに挿入
    await db.insert(embeddings).values({
      pageId: pageId,
      embedding: result.embedding.values,
    });
  } else {
    // contentを半分に分割
    const halfLength = Math.floor(content.length / 2);
    const firstHalf = content.slice(0, halfLength);
    const secondHalf = content.slice(halfLength);

    // 再帰的に処理
    await generateAndInsertEmbedding(firstHalf, pageId);
    await generateAndInsertEmbedding(secondHalf, pageId);
  }
};

export const generateEmbeddings = async (
  pages: { content: string; id: string }[],
) => {
  for (const page of pages) {
    await generateAndInsertEmbedding(page.content, page.id);
  }
};

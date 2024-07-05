"use server";

import "server-only";
import { embeddingModel } from "../gemini";

// TODO DBからテキストを取得する

export const embedding = async (text: string) => {
  const result = await embeddingModel.embedContent(text);

  console.log(result);
};

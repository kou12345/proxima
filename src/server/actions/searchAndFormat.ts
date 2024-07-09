"use server";

import { similaritySearch } from "@/server/actions/search";
import { chat } from "@/server/gemini";

export async function searchAndFormat(searchQuery: string) {
  const res = await similaritySearch({
    text: searchQuery,
    matchThreshold: 0.5,
    matchCount: 10,
  });
  return res;

  // const chatRes = await chat(`
  //   ## Content
  //   ${res.map((r) => r.content).join("\n\n")}

  //   ## 指示
  //   Contentの文章を読みやすいように整形して下さい。
  //   元の文章を変更しないでください。`);

  // return chatRes;
}

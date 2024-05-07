import { MAX_INPUT_TOKENS, model } from "@/server/gemini";
import { chatHistory } from "@/server/gemini/chat";
import { SupplementaryCodeFormSchema } from "@/server/type/chat/zodSchema";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  console.log("POST api/supplementary-code");
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // リクエストのバリデーション
  const validation = SupplementaryCodeFormSchema.safeParse(
    await request.json(),
  );
  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: 400 });
  }
  console.log("validated request: ", validation.data);

  // token数を確認する
  validation.data.supplementaryCode.forEach(async (supplementaryCode) => {
    const prompt =
      supplementaryCode.codeDescription +
      "\n```\n" +
      supplementaryCode.code +
      "```\n";
    const { totalTokens } = await model.countTokens(prompt);

    if (MAX_INPUT_TOKENS <= totalTokens) {
      return Response.json(
        { error: "The number of tokens exceeds the limit" },
        { status: 400 },
      );
    }
  });

  // TODO historyに追加する
  validation.data.supplementaryCode.forEach((supplementaryCode) => {
    chatHistory.push({
      role: "user",
      parts: [
        {
          text:
            supplementaryCode.codeDescription +
            "\n```\n" +
            supplementaryCode.code +
            "```\n",
        },
      ],
    });
  });

  console.log("chatHistory: ", chatHistory);

  return Response.json({ response: "success" });
}

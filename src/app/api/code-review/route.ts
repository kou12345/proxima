import { chatGemini } from "@/server/gemini/chat";
import { CodeReviewSchema } from "@/server/type/zodSchema";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  console.log("POST /api/code-review");
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // リクエストのバリデーション
  const validation = CodeReviewSchema.safeParse(await request.json());
  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: 400 });
  }
  console.log("validated request: ", validation.data);

  const prompt =
    validation.data.codeDescription + "\n```" + validation.data.code + "```";

  const res = await chatGemini(prompt);

  return Response.json({ response: res });
}

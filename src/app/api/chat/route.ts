import { chatGemini } from "@/server/gemini/chat";
import { ChatRequestSchema } from "@/server/type/chat/zodSchema";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  console.log("POST /api/chat");
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // リクエストのバリデーション
  const validation = ChatRequestSchema.safeParse(await request.json());
  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: 400 });
  }
  console.log("validated request: ", validation.data);

  const res = await chatGemini(validation.data.prompt);

  return Response.json({ response: res });
}

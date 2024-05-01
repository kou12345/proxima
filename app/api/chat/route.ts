import { chatGemini } from "@/server/gemini/chat";
import { ChatRequestSchema } from "@/server/type/zodSchema";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  // 認証チェック
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  console.log(json);

  const validation = ChatRequestSchema.safeParse(json);
  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const res = await chatGemini(validation.data.prompt);

  return Response.json({ response: res });
}

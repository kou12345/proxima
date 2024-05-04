import { SupplementaryCodeFormSchema } from "@/server/type/zodSchema";
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

  // TODO historyに追加する
}

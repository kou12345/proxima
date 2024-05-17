import { model } from "@/server/gemini";
import { getContent } from "@/server/github";
import { extractTaskRequestSchema } from "@/server/type/tasks/zodSchema";

export async function POST(request: Request) {
  const json = await request.json();
  const validation = extractTaskRequestSchema.safeParse(json);
  if (!validation.success) {
    return new Response(JSON.stringify(validation.error), { status: 400 });
  }

  const content = await getContent(validation.data.path);

  const prompt =
    `
    以下のテキストからタスクを抽出してください。\n
    タスクを抽出できない場合はテキストを元に次にやると良い事を提案して下さい。\n
    理由も記載して下さい。\n` +
    content +
    "\n";

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return new Response(JSON.stringify({ text }), { status: 200 });
}

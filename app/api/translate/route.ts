import { translation } from "../../../server/translation";

export async function POST(request: Request) {
  const json = await request.json();
  console.log(json);

  if (json.text === undefined) {
    return Response.json({ error: "text is required" }, { status: 400 });
  }

  const { text } = json as { text: string };

  const output = await translation(text);
  console.log("翻訳結果: ", output);

  return Response.json(output);
}

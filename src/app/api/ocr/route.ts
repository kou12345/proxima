import { model } from "@/server/gemini";

export async function POST(request: Request) {
  const json = await request.json();
  // TODO validate json

  // jsonから画像を取得
  const image = json.image;

  // OCR処理
  // TODO 一旦、画像一つのみ対応
  const res = await model.generateContent([
    "画像に書いてあるテキストを全て一度に出力してください。",
    { inlineData: { data: image, mimeType: "image/jpeg" } },
  ]);

  return new Response(JSON.stringify(res), {
    headers: { "content-type": "application/json" },
  });
}

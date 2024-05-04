// ! 使っていない

import { pipeline } from "@xenova/transformers";

export async function POST(request: Request) {
  const json = await request.json();
  console.log(json);

  // validate the request body
  // json.content is a string
  if (json.question === undefined) {
    return Response.json({ error: "question is required" }, { status: 400 });
  }
  // questionの型をstringに指定
  const { question } = json as { question: string };

  const answerer = await pipeline(
    "question-answering",
    "Xenova/distilbert-base-uncased-distilled-squad",
  );

  const context = "Jim Henson was a nice puppet.";
  const output = await answerer(question, context);
  console.log(output);

  return Response.json(output);
}

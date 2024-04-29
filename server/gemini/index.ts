import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// export const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro-latest",
// });
export const run = async (prompt: string) => {
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return text;
};

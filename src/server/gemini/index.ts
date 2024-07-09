import {
  FunctionDeclaration,
  FunctionDeclarationSchemaType,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import "server-only";

export const EMBEDDING_MAX_INPUT_TOKENS = 2048;

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

// Gemini APIのfunction callingのschema
const functionDeclaration: FunctionDeclaration = {
  name: "code_review",
  description: "コードのレビューを行います",
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      codeDescription: {
        type: FunctionDeclarationSchemaType.STRING,
        description: "コードの目的と概要",
      },
      // code: {
      //   type: FunctionDeclarationSchemaType.STRING,
      //   description: "コードレビュー対象のコード",
      // },
    },
    description: "コードレビューのパラメータ",
  },
};

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.1,
    topK: 40,
    topP: 0.95,
  },
  // TODO これが原因でエラーが出ているかも
  // tools: [{
  //   functionDeclarations: [functionDeclaration],
  // }],
});
export const MAX_INPUT_TOKENS = 30720;
// export const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro-latest",
// });

export const embeddingModel = genAI.getGenerativeModel({
  model: "embedding-001",
});

export const chat = async (prompt: string) => {
  const chat = model.startChat();
  const res = await chat.sendMessage(prompt);

  return res.response.text();
};

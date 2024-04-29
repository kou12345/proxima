import { model } from ".";

type ChatHistory = {
  role: "user" | "model";
  parts: { text: string }[];
}[];

const chatHistory: ChatHistory = [];

const chat = model.startChat({
  history: chatHistory,
  // generationConfig: {
  // maxOutputTokens: 1000, // default: 8192
  // },
});

export const chatGemini = async (prompt: string) => {
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  const text = response.text();

  chatHistory.push(
    { role: "user", parts: [{ text: prompt }] },
    { role: "model", parts: [{ text }] },
  );

  return text;
};

/*
ただし、この方法では、チャットの履歴がメモリに保持されるため、
サーバーが再起動されると履歴が失われます。
実際のアプリケーションでは、履歴をデータベースやファイルなどの永続ストレージに保存することをお勧めします。
*/

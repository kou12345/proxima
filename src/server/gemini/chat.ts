import { MAX_INPUT_TOKENS, model } from ".";

type ChatHistory = {
  role: "user" | "model";
  parts: { text: string }[];
}[];

const chatHistory: ChatHistory = [
  {
    role: "user",
    parts: [{
      text:
        "プログラミングのプロフェッショナルの観点から、このコードについてご意見をお聞かせください。",
    }],
  },
  {
    role: "model",
    parts: [{
      text:
        "私はプログラミングのプロフェッショナルとして、コードレビューをします。",
    }],
  },
  {
    role: "user",
    parts: [{
      text: "コードの可読性、変数名の適切さを評価して下さい。",
    }],
  },
  {
    role: "model",
    parts: [{
      text: "コードの可読性、変数名の適切さを評価します。",
    }],
  },
];

const chat = model.startChat({
  history: chatHistory,
});

export const chatGemini = async (prompt: string) => {
  // トークン数のチェック
  const { totalTokens } = await model.countTokens(prompt);
  console.log("totalTokens: ", totalTokens);
  if (MAX_INPUT_TOKENS <= totalTokens) {
    throw new Error("The number of tokens exceeds the limit");
  }

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log("response: ", response);
  console.log("text: ", response.text());

  // const call = result.response.functionCalls();
  // if (!call) {
  //   throw new Error("No function call");
  // }
  // console.log("call: ", call);

  const text = response ? response.text() : "";

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

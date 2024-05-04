"use client";

import { useFormState } from "react-dom";
import { State, questionAction } from "../../server/actions/question";
import { SubmitButton } from "./SubmitButton";
import { useEffect } from "react";

const initialState: State = {
  success: false,
  error: "",
};

export const VectorSearch = () => {
  const [state, formAction] = useFormState(questionAction, initialState);

  useEffect(() => {
    const fetchTranslation = async () => {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `
          HTTPキャッシュは、リクエストに関連付けられたレスポンスを保存し、保存されたレスポンスを後続のリクエストに再利用する。

再利用性にはいくつかの利点がある。まず、リクエストをオリジンサーバーに配信する必要がないため、クライアントとキャッシュの距離が近ければ近いほど、レスポンスが速くなります。最も典型的な例は、ブラウザ自身がブラウザのリクエスト用にキャッシュを保存する場合である。

また、レスポンスが再利用可能な場合、オリジンサーバーはリクエストを処理する必要がありません。つまり、リクエストを解析してルーティングしたり、クッキーに基づいてセッションを復元したり、結果をDBに問い合わせたり、テンプレートエンジンをレンダリングしたりする必要がありません。これにより、サーバーの負荷が軽減されます。

キャッシュの適切な運用はシステムの健全性にとって重要です。`,
        }),
      });
      const data = await res.json();
    };
    fetchTranslation();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center">Vector Search</h1>
      <h2 className="text-2xl mb-4 text-center">Enter a question</h2>
      <form action={formAction} className="flex flex-col items-end space-x-4">
        <input
          type="text"
          name="question"
          className="w-80 max-w-xs p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter text here"
        />
        <SubmitButton>Search</SubmitButton>
      </form>

      {state.success ? (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Result</h3>
          <ul>
            {state.result.map((item, index) => (
              <li key={index}>
                <div className="my-2">
                  <p>{item.content}</p>
                  <p>Similarity: {item.similarity}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-red-500 font-bold text-center">{state.error}</p>
      )}
    </main>
  );
};

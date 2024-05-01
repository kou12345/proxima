"use client";

import { useState, ClassAttributes, HTMLAttributes } from "react";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChatRequestSchema } from "@/server/type/zodSchema";

type CustomCodeProps = ClassAttributes<HTMLElement> &
  HTMLAttributes<HTMLElement> &
  ExtraProps;

const CustomCode = ({ className, children }: CustomCodeProps) => {
  const match = /language-(\w+)/.exec(className || "");

  // インラインコードの表示
  if (!className && typeof children === "string" && !children.includes("\n")) {
    return (
      <code className="bg-gray-800 text-white px-1 mx-1 rounded">
        {children}
      </code>
    );
  }

  return match ? (
    // 言語指定のあるcode block
    <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="pre">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    // 言語指定なしのcode block
    <SyntaxHighlighter style={atomDark} PreTag="pre">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);
  console.log(history);

  const onSubmitChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsDisabled(true);

    const validation = ChatRequestSchema.safeParse({
      prompt: prompt,
    });

    if (!validation.success) {
      console.error(validation.error);
      return;
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return;
    }

    const json = await res.json();

    setHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", text: validation.data.prompt },
      { role: "model", text: json.response },
    ]);

    setPrompt("");
    setIsDisabled(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto p-4">
        {history.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${message.role === "user" ? "text-right" : ""}`}
          >
            <span
              className={`${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } p-2 rounded-md inline-block`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CustomCode,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmitChat} className="p-4 bg-gray-100">
        <div className="flex">
          <textarea
            name="prompt"
            className="flex-grow p-2 border border-gray-300 rounded-l max-h-80 resize-none"
            placeholder="Enter text here"
            value={prompt}
            onChange={(e) => {
              // これ入れないとサイズが変わったあとに内容を削除したときなど動きがおかしい
              e.target.style.height = "auto";
              // 改行に合わせて高さを変える
              e.target.style.height = e.target.scrollHeight + "px";

              setPrompt(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
              }
            }}
          />
          <div className="flex flex-col justify-end ml-4">
            <button
              type="submit"
              className={`
                w-24 h-10 text-white font-bold py-2 px-4 rounded
                ${
                  isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                }
              `}
              disabled={isDisabled}
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

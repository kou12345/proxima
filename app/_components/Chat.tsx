"use client";

import { State, completions } from "@/server/actions/completions";
import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButton";
import { useState, useEffect, ClassAttributes, HTMLAttributes } from "react";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type CustomCodeProps = ClassAttributes<HTMLElement> &
  HTMLAttributes<HTMLElement> &
  ExtraProps;

const CustomCode = ({ className, children }: CustomCodeProps) => {
  const match = /language-(\w+)/.exec(className || "");

  if (!className && typeof children === "string") {
    return (
      <code className="bg-gray-800 text-white px-1 mx-1 rounded">
        {children}
      </code>
    );
  }

  return match ? (
    <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="pre">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <SyntaxHighlighter style={atomDark} PreTag="pre">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

const initialState: State = {
  success: false,
  error: "",
};

export const Chat = () => {
  const [state, formAction] = useFormState(completions, initialState);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);
  console.log(history);

  useEffect(() => {
    if (state.success) {
      setHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", text: state.prompt },
        { role: "model", text: state.response },
      ]);
    }
  }, [state]);

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
      <form action={formAction} className="p-4 bg-gray-100">
        <div className="flex">
          <input
            type="text"
            name="prompt"
            className="flex-grow p-2 border border-gray-300 rounded-l"
            placeholder="Enter text here"
          />
          <SubmitButton>Submit</SubmitButton>
        </div>
        {!state.success && (
          <div className="text-red-500 mt-2">{state.error}</div>
        )}
      </form>
    </div>
  );
};

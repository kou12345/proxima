"use client";

import { ClassAttributes, HTMLAttributes } from "react";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

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
    <SyntaxHighlighter
      lineProps={{ style: { wordBreak: "break-all", whiteSpace: "pre-wrap" } }}
      wrapLines={true}
      style={atomDark}
      language={match[1]}
      PreTag="pre"
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    // 言語指定なしのcode block
    <SyntaxHighlighter
      lineProps={{ style: { wordBreak: "break-all", whiteSpace: "pre-wrap" } }}
      wrapLines={true}
      style={atomDark}
      PreTag="pre"
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

type MarkdownProps = {
  text: string;
};

export const Markdown = ({ text }: MarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CustomCode,
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

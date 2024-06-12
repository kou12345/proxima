"use client";

import Link from "next/link";
import {
  RichTextarea,
  RichTextareaProps,
  createRegexRenderer,
} from "rich-textarea";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.css";
import { useEffect, useRef, useState } from "react";

const regexRenderer = createRegexRenderer([
  // [link] => <Link href="/tasks/memos/link">link</Link>
  [
    /\[([^\]]+)\]/g,
    ({ children, key, value }) => {
      const linkValue = value.slice(1, -1);
      return (
        <Link
          key={key}
          href={`/tasks/memos/${linkValue}`}
          target="_blank"
          className="text-green-400"
        >
          {children}
        </Link>
      );
    },
  ],
  // code block
  [
    /```(\w+)?\n([^`]+)```/g,
    ({ key, value }) => {
      const lines = value.split("\n");
      const language = "typescript";
      const codeValue = `\n${lines.slice(1, -1).join("\n")}\n`;
      const highlightedCode = hljs.highlight(language, codeValue).value;

      return <CodeBlock key={key} language={language} code={highlightedCode} />;
    },
  ],
]);
const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [isFocused, setIsFocused] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    const pre = preRef.current;
    const codeElement = codeRef.current;
    if (pre && codeElement) {
      const updatePadding = () => {
        const firstLine = pre.querySelector(".first-line");
        const lastLine = pre.querySelector(".last-line");
        const firstLineHeight = firstLine?.clientHeight || 0;
        const lastLineHeight = lastLine?.clientHeight || 0;
        pre.style.paddingTop = `${firstLineHeight}px`;
        pre.style.paddingBottom = `${lastLineHeight}px`;

        // カーソルの横の位置を調整
        const codeLines = codeElement.querySelectorAll("div");
        codeLines.forEach((line) => {
          line.style.marginLeft = isFocused ? "20px" : "0";
        });
      };

      if (isFocused) {
        updatePadding();
      } else {
        pre.style.paddingTop = "";
        pre.style.paddingBottom = "";
        const codeLines = codeElement.querySelectorAll("div");
        codeLines.forEach((line) => {
          line.style.marginLeft = "0";
        });
      }
    }
  }, [isFocused]);

  return (
    <pre
      ref={preRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="text-base"
    >
      <code ref={codeRef}>
        {isFocused && (
          <>
            <div className="first-line">{`\`\`\`${language}`}</div>
            <br />
          </>
        )}
        <div dangerouslySetInnerHTML={{ __html: code }} />
        {isFocused && (
          <>
            <br />
            <div className="last-line">{`\`\`\``}</div>
          </>
        )}
      </code>
    </pre>
  );
};

export const CustomTextarea = (
  props: Omit<RichTextareaProps, "children" | "ref">,
) => {
  return (
    <RichTextarea
      {...props}
      style={{
        width: "100%",
        height: "300px",
        border: "none",
        outline: "none",
        resize: "none",
      }}
      autoHeight
    >
      {regexRenderer}
    </RichTextarea>
  );
};

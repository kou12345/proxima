"use client";

import Link from "next/link";
import {
  RichTextarea,
  RichTextareaProps,
  createRegexRenderer,
} from "rich-textarea";

// [link] => <Link href="/tasks/memos/link">link</Link>
const regexRenderer = createRegexRenderer([
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
  [
    /```([^`]+)```/g,
    ({ key, value }) => {
      const codeValue = value.slice(3, -3);
      return (
        <code key={key} className="bg-gray-200 p-1">
          {codeValue}
        </code>
      );
    },
  ],
]);

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

"use client";

import Link from "next/link";
import {
  RichTextarea,
  RichTextareaProps,
  createRegexRenderer,
} from "rich-textarea";

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
]);

export const Textarea = (
  props: Omit<RichTextareaProps, "children" | "ref">
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
    >
      {regexRenderer}
    </RichTextarea>
  );
};

export default function MemosPage() {
  return (
    <div>
      <Textarea defaultValue="Lorem ipsum" name="hello" />
    </div>
  );
}

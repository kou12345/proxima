"use client";

import { CustomTextarea } from "@/components/CustomTextarea";
import { updateMemoContent } from "@/server/actions/memo";
import { useRef, useState } from "react";

type Props = {
  id: string;
  initialContent: string;
};

export const ContentInput = ({ id, initialContent }: Props) => {
  const [inputContent, setInputContent] = useState(initialContent);
  const debounceTimeRef = useRef<NodeJS.Timeout | null>(null);
  const prevContentRef = useRef(initialContent);

  const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setInputContent(newContent);

    if (debounceTimeRef.current) {
      clearTimeout(debounceTimeRef.current);
    }

    if (newContent !== prevContentRef.current) {
      debounceTimeRef.current = setTimeout(async () => {
        console.log("update content");
        await updateMemoContent(id, newContent);
        prevContentRef.current = newContent;
      }, 500);
    }
  };

  return (
    <CustomTextarea
      placeholder="Lorem ipsum"
      id="content"
      name="content"
      value={inputContent}
      onChange={onChangeContent}
    />
  );
};

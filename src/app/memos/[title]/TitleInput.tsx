"use client";

import { updateMemoTitle } from "@/server/actions/memo";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Props = {
  id: string;
  initialTitle: string;
};

export const TitleInput = ({ id, initialTitle }: Props) => {
  const router = useRouter();
  const [inputTitle, setInputTitle] = useState(
    initialTitle === "Untitled" ? "" : initialTitle,
  );
  const debounceTimeRef = useRef<NodeJS.Timeout | null>(null);
  const prevContentRef = useRef(inputTitle);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setInputTitle(newTitle);

    if (debounceTimeRef.current) {
      clearTimeout(debounceTimeRef.current);
    }

    if (newTitle !== prevContentRef.current) {
      debounceTimeRef.current = setTimeout(async () => {
        console.log("update content");
        await updateMemoTitle(id, newTitle);
        prevContentRef.current = newTitle;

        console.log("newTitle : ", newTitle);

        // 再リロードをせずにURLを更新
        const newUrl = `/memos/${encodeURIComponent(newTitle)}`;
        window.history.pushState(null, "", newUrl);
      }, 500);
    }
  };

  return (
    <input
      id="title"
      name="title"
      type="text"
      placeholder="Title"
      className="w-full bg-background py-4 text-xl outline-none"
      defaultValue={inputTitle}
      onChange={onChangeTitle}
    />
  );
};

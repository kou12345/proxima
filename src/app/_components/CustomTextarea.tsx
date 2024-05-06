import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";

type Props = {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export const CustomTextarea = ({
  name,
  placeholder,
  value,
  onChange,
}: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // valueが空文字の場合に高さをresetする
    if (ref.current && value === "") {
      ref.current.style.height = "auto";
    }
  }, [value]);

  console.log("value", value);

  return (
    <Textarea
      className="my-1 resize-none"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        // これ入れないとサイズが変わったあとに内容を削除したときなど動きがおかしい
        e.target.style.height = "auto";
        // 改行に合わせて高さを変える
        e.target.style.height = e.target.scrollHeight + "px";
        onChange(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
        }
      }}
    />
  );
};

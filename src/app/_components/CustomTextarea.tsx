import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

type Props = {
  name: string;
  placeholder?: string;
  setValue?: (value: string) => void;
};

export const CustomTextarea = ({ name, placeholder, setValue }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Textarea
      className="my-1 resize-none"
      ref={textareaRef}
      name={name}
      placeholder={placeholder}
      onChange={(e) => {
        // これ入れないとサイズが変わったあとに内容を削除したときなど動きがおかしい
        e.target.style.height = "auto";
        // 改行に合わせて高さを変える
        e.target.style.height = e.target.scrollHeight + "px";
        setValue && setValue(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
        }
      }}
    />
  );
};

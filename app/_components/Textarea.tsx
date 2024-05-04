import { Dispatch, SetStateAction, useRef, useEffect } from "react";

type Props = {
  name: string;
  placeholder?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export const Textarea = ({ name, placeholder, value, setValue }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (value === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="flex-grow p-2 border border-gray-300 rounded-l max-h-80 resize-none"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        // これ入れないとサイズが変わったあとに内容を削除したときなど動きがおかしい
        e.target.style.height = "auto";
        // 改行に合わせて高さを変える
        e.target.style.height = e.target.scrollHeight + "px";

        setValue(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
        }
      }}
    />
  );
};

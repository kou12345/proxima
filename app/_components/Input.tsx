import { InputHTMLAttributes } from "react";

type Props = {
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  name: string;
  placeholder: string;
  required?: boolean;
};

export const Input = ({ type, name, placeholder, required }: Props) => {
  return (
    <input
      type={type}
      name={name}
      className="w-full p-2 border border-gray-300 rounded mb-4"
      placeholder={placeholder}
      required={required}
    />
  );
};

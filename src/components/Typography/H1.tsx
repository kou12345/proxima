import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const H1 = ({ children }: Props) => {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
};

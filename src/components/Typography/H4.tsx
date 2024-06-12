import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const H4 = ({ children }: Props) => {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
};

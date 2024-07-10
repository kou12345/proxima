import { H1 } from "@/components/Typography/H1";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex flex-col items-center">
      <H1>Knowledge</H1>
      <div className="w-4/5">{children}</div>
    </div>
  );
}

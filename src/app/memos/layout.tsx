import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 flex flex-col items-center">
      <div className="my-4 flex w-4/5 items-center justify-between">
        <Link href="/memos" className="font-bold">
          Memos
        </Link>
        <Input placeholder="Search" className="w-1/3" />
      </div>
      <div className="w-4/5">{children}</div>
    </div>
  );
}

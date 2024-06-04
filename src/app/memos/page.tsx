import { getMemos } from "@/server/actions/memo";
import { NewMemoButton } from "./NewMemoButton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MemosPage() {
  const memos = await getMemos();

  return (
    <div>
      <NewMemoButton />
      <div className="grid grid-cols-3 gap-4">
        {memos.map((memo) => (
          <Card key={memo.id} className="h-40">
            <CardHeader>
              <CardTitle className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                <Link href={`/memos/${memo.id}`}>{memo.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                {memo.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

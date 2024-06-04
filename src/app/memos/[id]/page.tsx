import { Separator } from "@/components/ui/separator";
import { TitleInput } from "./TitleInput";
import { ContentInput } from "./ContentInput";
import { getMemo } from "@/server/actions/memo";

export default async function MemoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const memo = await getMemo(params.id);
  return (
    <div>
      <TitleInput id={params.id} initialTitle={memo.title || ""} />
      <Separator className="my-2" />
      <ContentInput id={params.id} initialContent={memo.content || ""} />
    </div>
  );
}

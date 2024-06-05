import { Separator } from "@/components/ui/separator";
import { TitleInput } from "./TitleInput";
import { ContentInput } from "./ContentInput";
import { getMemoContentByTitle } from "@/server/actions/memo";

export default async function MemoDetailPage({
  params,
}: {
  params: { title: string };
}) {
  const memo = await getMemoContentByTitle(decodeURIComponent(params.title));

  return (
    <div>
      <TitleInput id={memo.id} initialTitle={memo.title} />
      <Separator className="my-2" />
      <ContentInput id={memo.id} initialContent={memo.content || ""} />
    </div>
  );
}

import { Separator } from "@/components/ui/separator";
import { TitleInput } from "./TitleInput";
import { getMemoContentsByTitle } from "@/server/actions/memo";
import { PostForm } from "./PostForm";
import { PostCard } from "./PostCard";

export default async function MemoDetailPage({
  params,
}: {
  params: { title: string };
}) {
  const memo = await getMemoContentsByTitle(decodeURIComponent(params.title));

  return (
    <div>
      <TitleInput id={memo.id} initialTitle={memo.title} />
      <Separator className="my-2" />

      {memo.contents.map((content, i) => (
        <PostCard
          key={i}
          content={content.content}
          createdAt={content.createdAt}
        />
      ))}
      {/* 入力欄 */}
      <PostForm memoId={memo.id} />
    </div>
  );
}

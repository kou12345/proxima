import { Markdown } from "@/app/_components/Markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContent } from "@/server/github";

const getPath = (path: string) => {
  if (path === decodeURIComponent(path)) {
    return path;
  }
  return decodeURIComponent(path);
};

export default async function MemoDetailPage({
  params,
}: {
  params: { path: string };
}) {
  const path = getPath(params.path);
  const content = await getContent(path);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{path}</CardTitle>
        </CardHeader>
        <CardContent>
          <Markdown text={content || ""} />
        </CardContent>
      </Card>
    </div>
  );
}

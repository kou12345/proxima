import { getTree } from "@/server/github";

export default async function Page() {
  const tree = await getTree();

  return (
    <div>
      <h1>Repository Tree</h1>
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </div>
  );
}

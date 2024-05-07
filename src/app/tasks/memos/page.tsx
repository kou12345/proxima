import { getTree } from "@/server/github";
import Link from "next/link";

export default async function MemosPage() {
  const tree = await getTree();
  if (!tree) {
    return (
      <div>
        <p>file not found</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Repository Tree</h1>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {tree.map((item, i) => {
          return (
            <li key={i}>
              <Link href={`/tasks/memos/${item.path}`}>{item.path}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

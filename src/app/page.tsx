import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>
        <Link href="/chat">Chat</Link>
      </p>
      <p>
        <Link href="/memos">Memos</Link>
      </p>
      <p>
        <Link href="/knowledge">Knowledge</Link>
      </p>
    </div>
  );
}

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 flex flex-col items-center">
      <div className="w-4/5">{children}</div>
    </div>
  );
}

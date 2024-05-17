export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center my-6">
      <div className="w-4/5">{children}</div>
    </div>
  );
}

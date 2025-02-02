export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <h1>Root Layout</h1>
      {children}
    </main>
  );
}

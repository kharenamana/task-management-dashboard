export default function DashboardLoading() {
  return (
    <main
      className="mx-auto max-w-7xl animate-pulse px-5 py-10 sm:px-8"
      aria-label="Loading dashboard"
    >
      <div className="bg-muted h-10 w-72 rounded-xl" />
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="border-border bg-card h-28 rounded-2xl border"
          />
        ))}
      </div>
      <div className="border-border bg-card mt-7 h-20 rounded-2xl border" />
      <div className="border-border bg-card mt-5 h-72 rounded-2xl border" />
    </main>
  );
}

export default function ShelfLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 md:py-14">
      <div className="h-4 w-48 rounded bg-border" />
      <div className="mt-6 h-10 w-2/3 rounded bg-border" />
      <div className="mt-4 h-5 w-1/2 rounded bg-border" />
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="aspect-[3/4] max-w-xs rounded-2xl bg-border" />
      </div>
    </div>
  );
}

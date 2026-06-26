import { Skeleton } from "@/components/ui/skeleton";

export function RouteLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-36">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-5 h-20 max-w-2xl" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-[3/4]" />)}
        </div>
      </div>
    </div>
  );
}

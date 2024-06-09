import { Skeleton } from "@/components/ui/skeleton";

const loadingSkeleton = (
  <>
    <Skeleton className="group relative w-full rounded-xl p-2 ">
      <div className="absolute -inset-0.5 rounded-xl opacity-[0.5] blur-lg"></div>
      <div className="relative h-full max-w-full rounded-xl">
        <div className="relative isolate flex flex-col gap-1 rounded-xl sm:gap-4 h-full w-full">
          <Skeleton className="h-full w-full rounded-xl aspect-[16/9]" />
          {/* </div> */}
          <div className="absolute inset-0 gap-3 flex flex-col justify-end p-4 e">
            <Skeleton className="ml-1 h-4 w-3/4" />
            <div className="flex justify-between items-center text-xs">
              <Skeleton className="ml-1 h-4 w-1/4" />
              <Skeleton className="ml-1 h-4 w-1/4" />
              <Skeleton className="ml-1 h-4 opacity-0 w-1/4" />
              <Skeleton className="ml-1 h-4 w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </Skeleton>
  </>
);

const NewsPageLoading = () => {
  return (
    <div className="p-2 w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }, (_, i) => (
        <Skeleton key={i}>{loadingSkeleton}</Skeleton>
      ))}
    </div>
  );
};

export default NewsPageLoading;

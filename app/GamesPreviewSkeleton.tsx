import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default async function GamesPreviewSkeleton() {
  return (
    <div className="flex flex-col justify-start items-center w-full h-full overflow-y-auto grow">
      <div className="flex flex-row justify-center items-center gap-2 pb-2">
        <Button variant="outline" className="mr-3 ">
          <ChevronLeftIcon />
        </Button>
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
        <div className="mx-2 h-4 border-l border-neutral-300"></div>
        <Skeleton className="h-6 w-28" />
        <Button variant="outline" className="ml-3">
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="flex flex-row justify-between items-center w-full p-1 ">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-2 mx-auto w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="" key={index}>
              <Skeleton className="flex flex-row justify-between items-center text-center w-full h-full p-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

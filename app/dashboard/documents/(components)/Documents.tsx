import { FileText, Timer } from "lucide-react";
import Link from "next/link";
// import { Document } from '@/utils/types';

export default async function Documents({ info }: { info: Document }) {
  return (
    <Link href={`/dashboard/documents/${info?.document_id}`}>
      <article className="flex flex-row  p-4 rounded-md border border-zinc-100 dark:border-zinc-900 min-w-[300px] hover:shadow-md hover:bg-neutral-100 transition-shadow duration-300">
        <div className="flex flex-row w-full justify-between items-start">
          <FileText className=" text-white w-7 h-7 bg-blue-600 rounded p-1" />
          <h2 className={`font-bold w-full flex justify-start items-center`}>
            {info?.title}
          </h2>
          <div className="text-xs text-muted-foreground">
            <span className="flex justify-center items-center gap-1 ">
              <Timer className="w-4 h-4" />{" "}
              {new Date(info?.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
              ,{" "}
              {new Date(info?.created_at!)?.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

import { shimmer, toBase64 } from "@/utils/utils";
import { format, parseISO } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock10Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";


export const dynamic = "force-dynamic";

interface PreviewRectangleProps {
  news: news;
}

const PreviewRectangle: React.FC<PreviewRectangleProps> = async ({ news }) => {
  return (
    <>
      <div className="group relative w-full rounded-xl p-2 bg-white ring-[1px] ring-neutral-300 transition duration-200 hover:-translate-y-1">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-600 opacity-[0.5] blur-lg"></div>
        <div className="relative h-full max-w-full rounded-xl ">
          <Link href={`/news/${news.slug}`}>
            <article className="relative isolate flex flex-col gap-1 rounded-xl   sm:gap-4  h-full w-full">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                <Image
                  src={news.image ?? "/images/not-found.jpg"}
                  alt={news.image_alt ?? "Cover"}
                  fill={true}
                  style={{ objectFit: "cover" }}
                  priority
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(256, 256)
                  )}`}
                  className="absolute inset-0 h-full w-full rounded-xl bg-gray-50 object-cover z-0"
                />
                <div className="absolute gap-3 inset-0 flex flex-col justify-end p-4 z-20 bg-gradient-to-t from-black via-transparent to-transparent text-white">
                  <h3 className="text-base font-semibold leading-none line-clamp-1">
                    {news.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs ">
                    <div className=" flex justify-start items-center gap-x-3 ">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="ml-1">
                          {format(parseISO(news.created_at), "dd/MM/yyyy", {
                            locale: es,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock10Icon className="h-4 w-4" />
                        <span className="ml-1">
                          {format(parseISO(news.created_at), "HH:mm", {
                            locale: es,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="">
                      <span className="capitalize">
                        {formatDistanceToNowStrict(parseISO(news.created_at), {
                          locale: es,
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PreviewRectangle;

import { shimmer, toBase64 } from "@/utils/utils";
import { format, parseISO } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock10Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

interface MainNewsItemProps {
  news: news;
}

const MainNewsItem: React.FC<MainNewsItemProps> = async ({ news }) => {
  return (
    <>
      <div className="group relative w-full rounded-xl p-2 bg-white ring-[1px] ring-neutral-300 transition duration-200 hover:-translate-y-1">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-600 opacity-[0.5] blur-lg"></div>
        <div className="relative h-full max-w-full rounded-xl ">
          <Link href={`/news/${news.id}`}>
            <article className="relative isolate flex flex-col gap-1 rounded-xl   sm:gap-4  h-full w-full">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                <Image
                  src={news.cover_photo_url ?? "/images/not-found.jpg"}
                  alt={news.title ?? "Cover"}
                  fill={true}
                  style={{objectFit: "cover"}}
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
                {/* <div className="inline-flex items-center text-gray-500">
                      <Clock10Icon className="h-4 w-4" />
                      <span className="ml-1">
                      {getMinutes(readTime.minutes)}
                      </span>
                    </div> */}
                {/* <div className="inline-flex items-center text-gray-500">
                      <MessageCircleIcon className="h-4 w-4" />
                      <span className="ml-1">{comments?.length}</span>
                    </div> */}

                {/* <div className="mt-3 flex border-t border-gray-900/5 pt-2">
                  <div className="relative flex items-center gap-x-2">
                    <Image
                      src={news.profiles?.avatar_url ?? "/images/avatar.png"}
                      alt={news.profiles?.full_name ?? "Avatar"}
                      height={40}
                      width={40}
                      priority
                      placeholder={`data:image/svg+xml;base64,${toBase64(
                        shimmer(40, 40),
                      )}`}
                      className="h-[40px] w-[40px] rounded-full bg-gray-50 object-cover"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {news.profiles.full_name}
                      </p>
                      <p className="text-gray-600">Autor</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </article>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MainNewsItem;

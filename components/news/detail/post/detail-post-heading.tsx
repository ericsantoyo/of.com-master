import { shimmer, toBase64 } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import {
  ArchiveIcon,
  CalendarIcon,
  Clock10Icon,
  ClockIcon,
} from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import { FC } from "react";
import { format, parseISO } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
// import { ReadTimeResults } from "reading-time";

async function getPublicImageUrl(postId: string, fileName: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const bucketName =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_POSTS || "posts";
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(`${postId}/${fileName}`);

  if (data && data.publicUrl) return data.publicUrl;

  return "/images/not-found.jpg";
}

interface DetailPostHeadingProps {
  id: string;
  title: string;
  image: string;
  authorImage: string;
  authorName: string;
  date: string;
  category: string;
  readTime: ReadTimeResults;
}

const DetailPostHeading: FC<DetailPostHeadingProps> = async ({
  id,
  title,
  image,
  authorName,
  authorImage,
  date,
  category,
  readTime,
}) => {
  return (
    <section className="flex flex-col items-start justify-between">
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill={true}
          priority
          style={{ objectFit: "cover" }}
          className="h-[288px] w-full rounded-2xl bg-gray-100  "
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(512, 288)
          )}`}
        />
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <p className="my-5 overflow-hidden text-xl font-semibold leading-6 text-gray-900">
          {title}
        </p>
        {/* Author and Date */}
        <div className=" text-gray-500 flex flex-row justify-between items-center w-full">
          {/* Author */}
          {/* <div className="flex flex-row items-start justify-start pr-3.5 md:mb-0">
            <Image
              src={authorImage}
              height={24}
              width={24}
              alt={authorName || "Avatar"}
              className="flex h-[24px] w-[24px] rounded-full object-cover shadow-sm"
              priority
              placeholder="blur"
              blurDataURL={shimmer(24, 24)}
            />
            <div className="ml-2 flex flex-col">
              <span className="text-md flex font-semibold text-gray-900">
                {authorName}
              </span>
            </div>
          </div> */}
          <div className="flex flex-row justify-between items-center w-full">
            {/* Date */}
            <div className="flex justify-between items-center text-xs w-full mx-2">
              <div className=" flex justify-start items-center gap-x-3 ">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="ml-1">
                    {format(parseISO(date), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock10Icon className="h-4 w-4" />
                  <span className="ml-1">
                    {format(parseISO(date), "HH:mm", {
                      locale: es,
                    })}
                  </span>
                </div>
              </div>
              <div className="">
                <span className="capitalize">
                  {formatDistanceToNowStrict(parseISO(date), {
                    locale: es,
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailPostHeading;

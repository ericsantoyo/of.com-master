import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { shimmer, toBase64 } from "@/utils/utils";
import {
  ArchiveIcon,
  CalendarIcon,
  Clock10Icon,
  ClockIcon,
} from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { format, parseISO } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import ScrollUpButton from "@/components/news/ScrollUpButton";
import BackButton from "@/components/news/BackButton";

export const revalidate = 0;

interface NewsPageProps {
  params: {
    id: string[];
  };
}

async function getNews(params: { id: string }) {
  const id = params?.id;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const response = await supabase
    .from("news")
    .select("*")
    .match({ id: id, published: true })
    .single<news>();

  if (!response.data) {
    notFound;
  }

  return response.data;
}

// export async function generateMetadata({
//   params,
// }: PostPageProps): Promise<Metadata> {
//   const post = await getPost(params);
//   const truncateDescription =
//     post?.description?.slice(0, 100) + ("..." as string);
//   const slug = "/posts/" + post?.slug;

//   if (!post) {
//     return {};
//   }

//   return {
//     title: post.title,
//     description: post.description,
//     authors: {
//       name: seoData.author.name,
//       url: seoData.author.twitterUrl,
//     },
//     openGraph: {
//       title: post.title as string,
//       description: post.description as string,
//       type: "article",
//       url: getUrl() + slug,
//       images: [
//         {
//           url: getOgImageUrl(
//             post.title as string,
//             truncateDescription as string,
//             [post.categories?.title as string] as string[],
//             slug as string,
//           ),
//           width: 1200,
//           height: 630,
//           alt: post.title as string,
//         },
//       ],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: post.title as string,
//       description: post.description as string,
//       images: [
//         getOgImageUrl(
//           post.title as string,
//           truncateDescription as string,
//           [post.categories?.title as string] as string[],
//           slug as string,
//         ),
//       ],
//     },
//   };
// }

// async function getComments(postId: string) {
//   const cookieStore = cookies();
//   const supabase = createClient(cookieStore);
//   const { data: comments, error } = await supabase
//     .from("comments")
//     .select("*, profiles(*)")
//     .eq("post_id", postId)
//     .order("created_at", { ascending: true })
//     .returns<CommentWithProfile[]>();

//   if (error) {
//     console.error(error.message);
//   }
//   return comments;
// }

export default async function NewsPage({ params }: NewsPageProps) {
  // Get post data
  const news = await getNews(params);
  if (!news) {
    notFound();
  }

  const id = params?.id;

  //News Date List
  const date = news.created_at;
  const title = news.title;
  const image = news.cover_photo_url;
  const content = news.content;

  return (
    <div className="flex flex-col justify-center items-center pb-2">
      {/* <div className="mx-auto max-w-4xl rounded-xl  px-5 py-5 shadow-sm shadow-gray-300 ring-1 ring-black/5 "> */}
      <article className="container relative max-w-3xl py-6 lg:py-10">
        <div>
          {/* Date */}
          <div className="flex justify-between items-center text-xs w-full text-muted-foreground">
            <div className="flex flex-none items-center justify-start">
              <BackButton />
            </div>
            <div className=" flex justify-start items-center gap-x-3 ">
              <div className="">
                <span className="capitalize">
                  {formatDistanceToNowStrict(parseISO(date), {
                    locale: es,
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4" />
                <span className="ml-1 ">
                  {format(parseISO(date), "dd/MM/yyyy", {
                    locale: es,
                  })}{" "}
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
          </div>
          <h1 className="scroll-m-20 text-3xl font-bold pt-4 tracking-tight lg:text-3xl">
            {title}
          </h1>
          <div className="mt-4 flex items-center space-x-2">
            <Image
              src={"/playerImages/defaultplayer.png"}
              alt={""}
              width={32}
              height={32}
              className="rounded-full bg-white"
            />
            <div className="flex flex-col text-left leading-tight">
              <p className="font-medium">Eric Sant</p>
            </div>
          </div>
        </div>

        <Image
          src={image || "/playerImages/defaultplayer.png"}
          alt={title || ""}
          width={720}
          height={405}
          className="my-8 rounded-md border bg-muted transition-colors w-full"
          priority
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(512, 288)
          )}`}
        />

        <div
          className="lg:prose-md prose"
          dangerouslySetInnerHTML={{ __html: news.content || "" }}
        />

        <hr className="mt-12" />
        <div className="flex justify-center pt-6 lg:pt-10">
          <Link
            href="/news"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Ver más noticias
          </Link>
        </div>
      </article>
      {/* </div> */}
      <ScrollUpButton />
    </div>
  );
}

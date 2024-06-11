import { shimmer, toBase64 } from "@/utils/utils";
import { CalendarIcon, Clock10Icon } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import ScrollUpButton from "@/app/news/(components)/ScrollUpButton";
import BackButton from "@/app/news/(components)/BackButton";
import { getNewsBySlug } from "@/actions/get-news-by-slug";
import parse from "html-react-parser";
import { transformNode } from "@/utils/transform-node";

// export const revalidate = 0;

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const response = await getNewsBySlug(params?.slug);

  return (
    <div className="flex flex-col justify-center items-center pb-2">
      <article className="container relative max-w-3xl py-4 ">
        <div>
          <div className="flex justify-between items-center text-xs w-full text-muted-foreground">
            <div className="flex flex-none items-center justify-start">
              <BackButton />
            </div>
            <div className=" flex justify-start items-center gap-x-3 ">
              <div className="">
                <span className="capitalize">
                  {formatDistanceToNowStrict(parseISO(response[0].created_at), {
                    locale: es,
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4" />
                <span className="ml-1 ">
                  {format(parseISO(response[0].created_at), "dd/MM/yyyy", {
                    locale: es,
                  })}{" "}
                </span>
              </div>
              <div className="flex items-center">
                <Clock10Icon className="h-4 w-4" />
                <span className="ml-1">
                  {format(parseISO(response[0].created_at), "HH:mm", {
                    locale: es,
                  })}
                </span>
              </div>
            </div>
          </div>
          <h1 className="scroll-m-20 text-3xl font-bold pt-4 tracking-tight lg:text-3xl">
            {response[0].title}
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
          src={response[0].image || "/playerImages/defaultplayer.png"}
          alt={response[0].image_alt || ""}
          width={720}
          height={405}
          className="my-8 rounded-md border bg-muted transition-colors w-full"
          priority
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(512, 288)
          )}`}
        />
        {parse(response?.[0]?.blog_html, {
          replace: transformNode,
        })}
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
      <ScrollUpButton />
    </div>
  );
}

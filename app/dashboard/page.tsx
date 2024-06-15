import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StopCircle, VerifiedIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getAllNews } from "@/actions/get-all-news";
import DashboardPagination from "./(components)/DashboadPagination";

interface ProtectedDahboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProtectedDahboardPage({
  searchParams,
}: ProtectedDahboardPageProps) {

  const supabase = createClient();
  // const { data: user } = await supabase.from("documents").select("*");

  
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/login");
  // }

  // if (user.role !== "admin" && user.role !== "editor") {
  //   return redirect("/");
  // }

  const { data, totalPages, page } = await getAllNews(searchParams);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <main className="flex w-full flex-col items-start p-4 justify-between ">
        <div className=" w-full">
          <h1 className="scroll-m-20 font-semibold tracking-tight text-3xl">
            Noticias
          </h1>
          {data?.length ? (
            <div className="flex flex-col">
              <div className="p-2 w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data?.map((info) => (
                  <Link
                    href={`/dashboard/preview/${info?.slug}`}
                    key={info?.id}
                  >
                    <article
                      key={info?.id}
                      className="relative isolate flex flex-col gap-1 rounded-xl h-full w-full border hover:shadow-2xl hover:shadow-neutral-500/50 transition-shadow duration-300 "
                    >
                      <Image
                        src={info?.image}
                        alt={info?.image_alt}
                        // style={{ objectFit: "cover" }}

                        width={900}
                        height={452}
                        className="rounded-t transition-colors w-full h-32 object-cover object-top z-0"
                      />
                      <div className="flex flex-col px-[1rem] pt-[0.5rem] pb-[1rem]">
                        <div className="flex lg:flex-row w-full justify-between items-center">
                          <h2 className="text-lg font-bold line-clamp-2">
                            {info?.title}
                          </h2>
                        </div>
                        <p className="text-muted-foreground pt-1 text-sm line-clamp-2">
                          {info?.subtitle}
                        </p>
                        <div className="flex justify-between mt-2 items-center w-full">
                          <p className="text-xs text-muted-foreground">
                            {new Date(info?.created_at)?.toLocaleDateString()}
                          </p>
                          <div className="flex justify-center items-center gap-1">
                            <Badge>{info?.category?.category}</Badge>
                            {info?.published ? (
                              <VerifiedIcon />
                            ) : (
                              <StopCircle />
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <DashboardPagination
                  page={page}
                  totalPages={totalPages}
                  baseUrl="/dashboard"
                  pageUrl="?page="
                />
              )}
            </div>
          ) : (
            <main className="flex flex-col gap-2 lg:gap-2 min-h-[30vh] w-full">
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold tracking-tight">
                    You have no articles
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Articles will show here once you&apos;ve published articles
                  </p>
                  <Link href="/dashboard/documents">
                    <Button>My Documents</Button>
                  </Link>
                </div>
              </div>
            </main>
          )}
        </div>
      </main>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p></p>
      </footer>
    </div>
  );
}

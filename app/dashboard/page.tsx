import { getUserRole, getUserEmail } from "@/actions/userActions";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllArticles } from "@/actions/articlesActions";
// import { readSites } from "@/utils/actions/sites/read-sites"
// import { Site } from "@/utils/types"
import { StopCircle, VerifiedIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllNews } from "@/utils/supabase/dashboadFunctions";

export default async function ProtectedDahboardPage() {
  //fetch all news
  const response = await getAllArticles()
  const { data: allNews } = await getAllNews();

  const email = await getUserEmail(); // Await the email retrieval if asynchronous

  if (!email) {
    return redirect("/login");
  }

  const { error, role } = await getUserRole();

  if (error) {
    console.error("Error fetching role:", error);
    return redirect("/login");
  }

  if (role !== "owner" && role !== "manager") {
    return redirect("/myteams");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      {/* <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <p className="font-bold text-lg">Admin Panel</p>
            <AuthButton />
          </div>
        </nav>
      </div> */}
      <main className="flex w-full flex-col items-start p-4 justify-between ">
        <div className=" w-full">
          <h1 className="scroll-m-20 font-semibold tracking-tight text-3xl">
            Noticias
          </h1>
          <div className="flex flex-wrap justify-start items-center  gap-3 mt-[1.5rem] mb-[2rem] w-full">
            {response?.length ?? 0 > 0 ? (
              response?.map((info: any) => (
                <Link href={`/dashboard/preview/${info?.slug}`} key={info?.id}>
                  <article
                    key={info?.id}
                    className="flex flex-col space-y-2 border dark:border-zinc-900 border-zinc-200 rounded-md max-w-[350px] hover:shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300"
                  >
                    <Image
                      src={info?.image}
                      alt={info?.image_alt}
                      width={900}
                      height={452}
                      className="rounded-t bg-muted border-b dark:border-zinc-600 border-zinc-200 transition-colors w-full"
                    />
                    <div className="flex flex-col px-[1rem] pt-[0.5rem] pb-[1.5rem]">
                      <div className="flex lg:flex-row w-full justify-between items-center">
                        <h2 className="text-lg font-bold">{info?.title}</h2>
                      </div>
                      <p className="text-muted-foreground pt-1 text-sm">
                        {info?.subtitle}
                      </p>
                      <div className="flex justify-between mt-2 items-center w-full">
                        <p className="text-xs text-muted-foreground">
                          {new Date(info?.created_at)?.toLocaleDateString()}
                        </p>
                        <div className="flex justify-center items-center gap-1">
                          <Badge>{info?.category?.category}</Badge>
                          {info?.published ? <VerifiedIcon /> : <StopCircle />}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <main className="flex flex-col gap-2 lg:gap-2 min-h-[30vh] w-full">
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      You have no articles
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Articles will show here once you&apos;ve published
                      articles
                    </p>
                    <Link href="/dashboard/documents">
                      <Button>My Documents</Button>
                    </Link>
                  </div>
                </div>
              </main>
            )}
          </div>
        </div>
      </main>
      <div className="flex-1 flex flex-col gap-2 max-w-4xl px-3">
        <h2 className="font-bold text-4xl mb-4 text-center">email: {email}</h2>
        <h2 className="font-bold text-4xl mb-4 text-center">Role: {role}</h2>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p></p>
      </footer>
    </div>
  );
}

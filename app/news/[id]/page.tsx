// "use client";

// import Preview from "@/components/Preview/Preview";
// import { getNewsById } from "@/utils/supabase/functions";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";

// const ImageSlider = ({ slides }) => {
//   if (!slides) {
//     return null;
//   }

//   const [current, setCurrent] = useState(0);
//   const length = slides.length;

//   const nextSlide = () => {
//     setCurrent(current === length - 1 ? 0 : current + 1);
//   };

//   const prevSlide = () => {
//     setCurrent(current === 0 ? length - 1 : current - 1);
//   };

//   if (!Array.isArray(slides) || slides.length <= 0) {
//     return null;
//   }

//   return (
//     <section className="slider">
//       <button className="left-arrow" onClick={prevSlide}>
//         ←
//       </button>
//       <button className="right-arrow" onClick={nextSlide}>
//         →
//       </button>
//       {slides.map((slide, index) => {
//         return (
//           <div
//             className={index === current ? "slide active" : "slide"}
//             key={index}
//           >
//             {index === current && (
//               <img src={slide} alt="travel image" className="image" />
//             )}
//           </div>
//         );
//       })}
//     </section>
//   );
// };

// export default function SomeClientComponent() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     async function fetchNews() {
//       let { news } = await getNewsById(id);
//       if (news) {
//         setData(news[0]);
//         console.log(news[0]);
//       }
//     }
//     if (id) fetchNews();
//   }, [id]);

//   // if (!data) {
//   //     return <p>Loading...</p>
//   // }

//   console.log(data);

//   return (
//     <div className="w-full mx-auto flex  items-center flex-col mt-8 p-4 bg-white rounded-lg ">
//       <div className="max-w-lg">
//         <img className="w-full rounded" src={data?.cover_photo_url} />
//         <h1 className="text-2xl font-bold mb-4 mt-3">{data?.title}</h1>
//       </div>
//       <div>
//         <Preview markdown={data?.content} />
//       </div>
//       <ImageSlider slides={data?.photos} />
//       <div className="w-full">
//         <h2 className="text-lg font-semibold mb-2">Tags</h2>
//         <ul className="flex flex-wrap w-full">
//           {data?.tags.map((tag, i) => (
//             <li
//               key={i}
//               className="mr-2 mb-2 bg-gray-800 text-white rounded p-2 font-bold "
//             >
//               {tag.text}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
// import { GetBookmark } from "@/actions/bookmark/get-bookmark";
import {
  // DetailPostComment,
  // DetailPostFloatingBar,
  DetailPostHeading,
} from "@/components/news/detail/post";
import { DetailPostScrollUpButton } from "@/components/news/detail/post/buttons";
// import { seoData } from "@/config/root/seo";
// import { getOgImageUrl, getUrl } from "@/lib/utils";
// import {
//   CommentWithProfile,
//   PostWithCategoryWithProfile,
// } from "@/types/collection";
import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { format, parseISO } from "date-fns";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
// import readingTime, { ReadTimeResults } from "reading-time";

export const revalidate = 0;

interface NewsPageProps {
  params: {
    id: string[];
  };
}

// async function getBookmark(postId: string, userId: string) {
//   if (postId && userId) {
//     const bookmark = {
//       id: postId,
//       user_id: userId,
//     };
//     const response = await GetBookmark(bookmark);

//     return response;
//   }
// }

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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  // Get post data
  const news = await getNews(params);
  if (!news) {
    notFound();
  }
  // Set post views
  const id = params?.id;

  // Check user logged in or not
  // let username = null;
  // let profileImage = null;
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (session) {
  //   username = session.user?.user_metadata.full_name;
  //   profileImage =
  //     session?.user?.user_metadata.picture ||
  //     session?.user?.user_metadata.avatar_url;
  // }

  // Get bookmark status
  // const isBookmarked = await getBookmark(
  //   post.id as string,
  //   session?.user.id as string,
  // );

  // Get comments
  // const comments = await getComments(post.id as string);
  // const readTime = readingTime(post.content ? post.content : "");

  return (
    <>
      <div className="min-h-full">
        <div className="mx-auto max-w-7xl px-0 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto max-w-4xl rounded-xl  px-5 py-5 shadow-sm shadow-gray-300 ring-1 ring-black/5 ">
              <div className="relative mx-auto max-w-4xl">
                {/* Heading */}
                <DetailPostHeading
                  id={news.id}
                  title={news.title as string}
                  image={news.cover_photo_url as string}
                  // authorName={news.profiles.full_name as string}
                  // authorImage={news.profiles.avatar_url as string}
                  date={news.created_at as string}
                  // category={news.categories?.title as string}
                  // readTime={readTime as ReadTimeResults}
                />
                {/* Top Floatingbar */}
                <div className="mx-auto">
                  {/* <DetailPostFloatingBar
                    id={news.id as string}
                    title={news.title as string}
                    text={news.description as string}
                    // url={`${getUrl()}${encodeURIComponent(
                    //   `/news/${news.id}`,
                    // )}`}
                    // totalComments={comments?.length}
                    // isBookmarked={isBookmarked}
                  /> */}
                </div>
              </div>
              {/* Content */}
              <div className="relative mx-auto max-w-3xl border-slate-500/50 py-5">
                <div
                  className="lg:prose-md prose"
                  dangerouslySetInnerHTML={{ __html: news.content || "" }}
                />
              </div>
              <div className="mx-auto mt-10">
                {/* Bottom Floatingbar */}
                {/* <DetailPostFloatingBar
                  id={news.id as string}
                  title={news.title as string}
                  text={news.description as string}
                  // url={`${getUrl()}${encodeURIComponent(
                  //   `/news/${news.id}`,
                  // )}`}
                  // totalComments={comments?.length}
                  // isBookmarked={isBookmarked}
                /> */}
              </div>
            </div>
          </div>
          {/* <DetailPostComment
            postId={post.id as string}
            comments={comments as CommentWithProfile[]}
          /> */}
        </div>
        <DetailPostScrollUpButton />
      </div>
    </>
  );
}

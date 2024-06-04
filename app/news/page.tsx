'use client'
import {
  getAllPlayers,
  getAllMatches,
  getAllStats,
  getTeamByTeamID,
  getPlayersByTeamID,
  getAllTeams,
  getAllNews,
} from "@/utils/supabase/functions";
import { Link } from "lucide-react";
import React, { useEffect, useState } from 'react';



const NewsSnippet = ({ newsItem }) => {
  const { title, content, cover_photo_url, created_at } = newsItem;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <a href={`/news/${newsItem.id}`}>
        <img className="w-full" src={cover_photo_url} alt="News Cover" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
        <p>
            {new Date(created_at).toLocaleDateString()}
        </p>
        </div>
          

      </a>


    </div>
  );
};

const NewsPage = ({ news }) => {
  return (
    <div className="flex flex-wrap w-full">
      {news.map(newsItem => (
        <NewsSnippet key={newsItem.id} newsItem={newsItem} />
      ))}
    </div>
  );
};


// export default async function News() {
//   const { allMatches: matchesData } = await getAllMatches();
//   const { allTeams: teams } = await getAllTeams();
//   const { allNews: news } = await getAllNews();

//   return (
//     <div className=" flex flex-col gap-3">
//       {/* <pre className="text-center">{JSON.stringify(teams, null, 2)}</pre> */}
//       {/* <Calendar matches={matchesData} allTeams={teams} gamesToShow={6} /> */}

//       <p className="text-center text-lg font-bold">

//         NEWS Page

//       </p>
//       <NewsPage news={news}/>
//     </div>
//   );
// }

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      const { allNews: newsData } = await getAllNews();
      setNews(newsData);
    };

    fetchData();
  }, []);

  return (
    <div className=" flex flex-col gap-3">
      <p className="text-center text-lg font-bold">NEWS Page</p>
      <NewsPage news={news} />
    </div>
  );
};

export default News;

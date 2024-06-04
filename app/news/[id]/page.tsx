"use client";

import Preview from "@/components/Preview/Preview";
import { getNewsById } from "@/utils/supabase/functions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";

const ImageSlider = ({ slides }) => {
  if (!slides) {
    return null;
  }

  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <section className="slider">
      <button className="left-arrow" onClick={prevSlide}>
        ←
      </button>
      <button className="right-arrow" onClick={nextSlide}>
        →
      </button>
      {slides.map((slide, index) => {
        return (
          <div
            className={index === current ? "slide active" : "slide"}
            key={index}
          >
            {index === current && (
              <img src={slide} alt="travel image" className="image" />
            )}
          </div>
        );
      })}
    </section>
  );
};

export default function SomeClientComponent() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      let { news } = await getNewsById(id);
      if (news) {
        setData(news[0]);
        console.log(news[0]);
      }
    }
    if (id) fetchNews();
  }, [id]);

  // if (!data) {
  //     return <p>Loading...</p>
  // }

  console.log(data);

  return (
    <div className="w-full mx-auto flex  items-center flex-col mt-8 p-4 bg-white rounded-lg ">
      <div className="max-w-lg">
        <img className="w-full rounded" src={data?.cover_photo_url} />
        <h1 className="text-2xl font-bold mb-4 mt-3">{data?.title}</h1>
      </div>
      <div>
        <Preview markdown={data?.content} />
      </div>
      <ImageSlider slides={data?.photos} />
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-2">Tags</h2>
        <ul className="flex flex-wrap w-full">
          {data?.tags.map((tag, i) => (
            <li
              key={i}
              className="mr-2 mb-2 bg-gray-800 text-white rounded p-2 font-bold "
            >
              {tag.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

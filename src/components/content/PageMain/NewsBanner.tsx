"use client";
import React from "react";

const slides = [
  {
    title: "BẢNG TIN MỚI",
    img: "https://cdn.builder.io/api/v1/image/assets/TEMP/07004a68e56887642bf80162be8e8825d5f6a086?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866",
  },
  {
    title: "BẢNG TIN MỚI",
    img: "https://cdn.builder.io/api/v1/image/assets/TEMP/07004a68e56887642bf80162be8e8825d5f6a086?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866",
  },
  {
    title: "BẢNG TIN MỚI",
    img: "https://cdn.builder.io/api/v1/image/assets/TEMP/07004a68e56887642bf80162be8e8825d5f6a086?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866",
  },
  {
    title: "BẢNG TIN MỚI",
    img: "https://cdn.builder.io/api/v1/image/assets/TEMP/07004a68e56887642bf80162be8e8825d5f6a086?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866",
  },
];

export const NewsBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-100 min-h-32 w-full">
      <div
        className="flex items-center gap-10 animate-marquee"
        style={{
          width: "max-content",
          animation: "marquee 18s linear infinite",
        }}
      >
        {slides.concat(slides).map((slide, idx) => (
          <div className="flex gap-3 items-center p-[5px]" key={idx}>
            <h2 className="self-stretch my-auto text-5xl font-black text-center text-pink-800 w-[457px] max-md:max-w-full">
              {slide.title}
            </h2>
            <div className="flex overflow-hidden gap-2.5 justify-center items-center px-1 min-h-16 w-[66px]">
              <img
                src={slide.img}
                alt="Hot news icon"
                className="object-contain w-10 aspect-[0.91]"
              />
            </div>
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </section>
  );
};
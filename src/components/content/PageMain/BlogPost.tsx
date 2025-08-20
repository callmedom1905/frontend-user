import React from "react";
import { BlogPostProps } from "@/types/blog";
import Link from "next/link";

export const BlogPost: React.FC<BlogPostProps> = ({ title, description, imageUrl, id, slug }) => {
  return (
    <article className="flex flex-col text-center self-stretch my-auto bg-white rounded-xl min-w-60 w-[460px] max-md:max-w-full">
      <img
        src={imageUrl}
        alt={title}
        className="object-contain self-center max-w-full rounded-xl aspect-[1.53] w-[460px]"
      />
      <div className="flex flex-col py-3 w-full max-md:max-w-full">
        <h3 className="flex-1 shrink gap-2.5 self-stretch px-4 py-3 w-full text-2xl font-medium basis-0 max-md:max-w-full">
          {title}
        </h3>
        <p className="flex-1 shrink gap-2.5 self-stretch px-4 py-3 w-full font-light basis-0 max-md:max-w-full">
          {description}
        </p>
        <Link href={slug ? `/tin-tuc/${slug}` : id ? `/tin-tuc/${id}` : "#"}>
          <button className="gap-2.5 px-2.5 py-3.5 w-60 max-w-full leading-none text-center min-h-[50px]">
            Xem chi tiết
          </button>
        </Link>
      </div>
    </article>
  );
};

import React from "react";
import { BlogPost } from "./BlogPost";
import { BlogPostProps } from "@/types/blog";

interface BlogSectionProps {
  posts: BlogPostProps[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <section className="flex flex-col items-center self-center mt-10 w-full max-w-[1420px] max-md:max-w-full">
      <h2 className="gap-2.5 self-stretch px-2.5 py-5 w-full text-5xl font-bold leading-none text-center text-black min-h-[110px] max-md:max-w-full max-md:text-4xl">
        Tin tức mới nhất
      </h2>
      <div className="flex flex-wrap gap-5 items-center text-lg leading-6 text-black max-md:max-w-full">
        {posts.map((post, index) => (
          <BlogPost
            key={index}
            title={post.title}
            description={post.description}
            imageUrl={post.imageUrl}
            id={post.id}
            slug={post.slug}
          />
        ))}
      </div>
    </section>
  );
};

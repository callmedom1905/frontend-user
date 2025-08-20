import * as React from "react";
import { PostCard } from "./PostCard";

interface PostGridProps {
  posts: Array<{
    id: number;
    image: string;
    title: string;
    description: string;
    slug?: string;
  }>;
}

export const PostGrid: React.FC<PostGridProps> = ({ posts }) => {
  return (
    <section className="flex flex-col items-center w-full text-lg leading-6 text-black max-w-[1420px] px-4 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            imageUrl={post.image}
            title={post.title}
            description={post.description}
            slug={post.slug}
            id={post.id}
          />
        ))}
      </div>
    </section>
  );
}; 
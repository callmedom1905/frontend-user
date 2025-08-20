import React, { useEffect, useState } from "react";
import { BlogPost } from "./BlogPost";
import { BlogPostProps, ApiBlogPost } from "@/types/blog";
import { apiClient } from "@/lib/apiClient";

export const PromotionSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get<ApiBlogPost[]>("/users/posts/sort/featured");
        console.log("Featured posts API response:", res);
        const featuredPosts = Array.isArray(res) ? res.map((post: ApiBlogPost) => ({
          title: post.title,
          description: post.description,
          imageUrl: post.image || post.og_image || post.image_url || post.imageUrl || "",
          id: post.id,
          slug: post.slug,
        })) : [];
        console.log("Featured posts set:", featuredPosts);
        setPosts(featuredPosts);
      } catch (error) {
        console.error("Failed to fetch featured posts", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedPosts();
  }, []);
  return (
    <section className="flex flex-col items-center self-center mt-10 w-full max-w-[1420px] max-md:max-w-full">
      <h2 className="gap-2.5 self-stretch px-2.5 py-5 w-full text-5xl font-bold leading-none text-center text-black min-h-[110px] max-md:max-w-full max-md:text-4xl">
        Chương trình khuyến mãi
      </h2>
      <div className="flex flex-wrap gap-5 items-center text-lg leading-6 text-black max-md:max-w-full">
        {loading ? (
          <p className="text-gray-500 text-center w-full py-8">
            Đang tải chương trình khuyến mãi...
          </p>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <BlogPost
              key={index}
              title={post.title}
              description={post.description}
              imageUrl={post.imageUrl}
              id={post.id}
              slug={post.slug}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center w-full py-8">
            Hiện tại chưa có chương trình khuyến mãi nào.
          </p>
        )}
      </div>
    </section>
  );
};

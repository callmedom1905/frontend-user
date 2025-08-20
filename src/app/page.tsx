"use client";
import React, { useEffect, useState } from "react";
import { Hero } from "@/components/content/PageMain/hero";
import { ProductCarousel } from "@/components/content/PageMain/ProductCarousel";
import { NewsBanner } from "@/components/content/PageMain/NewsBanner";
import { BlogSection } from "@/components/content/PageMain/BlogSection";
import { QuoteSection } from "@/components/content/PageMain/QuoteSection";
import { PromotionSection } from "@/components/content/PageMain/PromotionSection";
import { BlogPostProps, ApiBlogPost } from "@/types/blog";
import { apiClient } from "@/lib/apiClient";
import { CartActionButton } from "@/components/content/PageCart/CartActionButton";


const Home: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostProps[]>([]);
  const [hasCart, setHasCart] = useState(false);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await apiClient.get<ApiBlogPost[]>("/users/posts/sort/latest");
        console.log("API response:", res);
        const posts = Array.isArray(res) ? res.slice(0, 3).map((post: ApiBlogPost) => ({
          title: post.title,
          description: post.description,
          imageUrl: post.image || post.og_image || post.image_url || post.imageUrl || "",
          id: post.id,
          slug: post.slug,
        })) : [];
        console.log("posts set:", posts);
        setBlogPosts(posts);
      } catch (error) {
        console.error("Failed to fetch latest posts", error);
      }
    };
    fetchLatestPosts();
  }, []);

  useEffect(() => {
    const checkCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setHasCart(cart.length > 0);
    };
    checkCart();
    window.addEventListener('cartUpdated', checkCart);
    return () => window.removeEventListener('cartUpdated', checkCart);
  }, []);



  return (
    <main className="flex overflow-hidden flex-col bg-stone-100">
      <Hero />
      <ProductCarousel
        title="Món Mới"
        type="latest"
      />
      <ProductCarousel
        title="Best Seller"
        type="most-sold"
      />
      <NewsBanner />
      <BlogSection posts={blogPosts} />
      <QuoteSection />
      <PromotionSection />
      {hasCart && <CartActionButton />}
    </main>
  );
};

export default Home;

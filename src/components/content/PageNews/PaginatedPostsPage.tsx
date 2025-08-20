"use client";

import React, { useState, useEffect } from 'react';
import { Hero, FeaturedImage, PostGrid, Pagination } from "./index";
import apiClient from "@/lib/apiClient";

interface Post {
  id: number;
  image: string;
  title: string;
  description: string;
  status: boolean;
  slug?: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Post[];
}

export const PaginatedPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/user/posts?page=${page}&per_page=6&sort=-created_at`);
      
      // Check if response.data is the actual data or if we need to go deeper
      let actualData = response.data;
      let actualMeta = (response as any).meta;
      
      // If response has data.data structure (Laravel Resource wrapped)
      if (response.data && (response.data as any).data) {
        actualData = (response.data as any).data;
        actualMeta = (response.data as any).meta;
      }
      
      if (actualData && Array.isArray(actualData)) {
        setPosts(actualData);
        setCurrentPage(actualMeta?.current_page || 1);
        setLastPage(actualMeta?.last_page || 1);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
      // Scroll to top khi chuyển trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-stone-100">
      <Hero />
      <FeaturedImage />
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="text-lg">Đang tải...</div>
        </div>
      ) : (
        <>
          <PostGrid posts={posts} />
          <Pagination 
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

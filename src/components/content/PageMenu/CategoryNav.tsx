"use client";

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

interface Category {
  id: number;
  name: string;
}

export const CategoryNav = ({ onCategorySelect }: { onCategorySelect: (categoryId: number|null) => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number|null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get('/users/categories/user');
        // Backend đã lọc danh mục có status = 1
        const allCategories = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCategories(allCategories);
      } catch (error) {
        console.error('Lỗi lấy danh mục:', error);
        setCategories([]);
      }
    };
    fetchCategories();  
  }, []);

  const handleSelect = (id: number|null) => {
    setSelectedCategory(id);
    onCategorySelect(id);
  };

  return (
    <nav className="flex overflow-hidden flex-col justify-center items-center px-16 py-px w-full text-lg text-center text-black whitespace-nowrap bg-orange-300 border-white max-md:px-5 max-md:max-w-full">
      <div className="flex overflow-hidden flex-wrap justify-center items-center px-24 w-full max-w-[1420px] max-md:px-5 max-md:max-w-full">
        <div
          className={`flex-1 shrink gap-2.5 self-stretch px-2.5 py-3.5 my-auto basis-0 min-h-[50px] cursor-pointer rounded transition-colors duration-200 ${
            selectedCategory === null 
              ? 'bg-white text-orange-500 font-bold shadow-md' 
              : 'hover:bg-orange-200'
          }`}
          onClick={() => handleSelect(null)}
        >
          Tất cả
        </div>
        {categories.map((cat: Category) => (
          <div
            key={cat.id}
            className={`flex-1 shrink gap-2.5 self-stretch px-2.5 py-3.5 my-auto basis-0 min-h-[50px] cursor-pointer rounded transition-colors duration-200 ${
              selectedCategory === cat.id 
                ? 'bg-white text-orange-500 font-bold shadow-md' 
                : 'hover:bg-orange-200'
            }`}
            onClick={() => handleSelect(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </nav>
  );
};

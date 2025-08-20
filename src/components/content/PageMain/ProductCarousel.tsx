"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "./ProductCart";
import { CartItem } from "@/types/cart";
import { ProductCarouselProps, ApiProduct, IProductProps } from "@/types/product";
import apiClient from "@/lib/apiClient";
import Link from "next/link";

  
export const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products: propProducts, type }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [products, setProducts] = useState<IProductProps[]>([]);

  const PRODUCTS_PER_SLIDE = 4;
  const totalSlides = Math.ceil(products.length / PRODUCTS_PER_SLIDE);
  const startIdx = activeSlide * PRODUCTS_PER_SLIDE;
  const endIdx = startIdx + PRODUCTS_PER_SLIDE;
  const visibleProducts = products.slice(startIdx, endIdx);

  const addToCart = (product: IProductProps) => {
    // Lấy giỏ hàng hiện tại từ localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Tìm sản phẩm đã có trong giỏ hàng
    const existingItemIndex = currentCart.findIndex((item: CartItem) => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã có, tăng số lượng
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // Nếu sản phẩm chưa có, thêm mới
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        slug: product.slug,
        quantity: 1
      });
    }
    
    // Lưu giỏ hàng mới vào localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Dispatch event để cập nhật số lượng trên CartButton
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Hiển thị thông báo thành công
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    notification.textContent = 'Đã thêm vào giỏ hàng!';
    document.body.appendChild(notification);
    
    // Xóa thông báo sau 2 giây
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let endpoint = '/users/product';
        
        // Sử dụng API tương ứng với type
        if (type === 'latest') {
          endpoint = '/users/products/latest';
        } else if (type === 'most-sold') {
          endpoint = '/users/products/most-sold-products';
        }
        
        const res = await apiClient.get(endpoint);
        console.log('API Response:', res);
        
        // Xử lý dữ liệu từ API
        let productsData = [];
        if (Array.isArray(res)) {
          // Nếu response là array trực tiếp
          productsData = res;
        } else if (Array.isArray(res.data)) {
          // Nếu response có cấu trúc { data: [...] }
          productsData = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          // Nếu response có cấu trúc { data: { data: [...] } }
          productsData = res.data.data;
        }
        
        console.log('Products Data:', productsData);
        
        const limitedAndMappedProducts = productsData
          .map((product: ApiProduct) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.image || "https://via.placeholder.com/300",
            slug: product.slug,
            description: product.description || product.meta_description,
            category: product.id_category,
            status: product.status,
            quantity_sold: product.quantity_sold
          }))
          .slice(0, 16);
        
        console.log('Mapped Products:', limitedAndMappedProducts);
        setProducts(limitedAndMappedProducts);
      } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error);
        setProducts([]);
      }
    };

    // Nếu có products được truyền từ props, sử dụng chúng
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
    } else {
      // Nếu không có, fetch từ API
      fetchProducts();
    }
  }, [propProducts, type]);

  return (
    <section className="flex flex-col justify-center self-center pb-10 mt-1.5 w-full max-w-[1560px] max-md:max-w-full">
      <h2 className="gap-2.5 self-stretch px-2.5 py-5 w-full text-5xl font-bold leading-none text-center text-black min-h-[110px] max-md:max-w-full max-md:text-4xl">
        {title}
      </h2>
      <div className="flex flex-wrap gap-5 items-center w-full text-center max-md:flex-col max-md:gap-3 max-md:px-2 max-md:max-w-full">
        <button
          aria-label="Previous slide"
          className="max-md:hidden"
          onClick={() => setActiveSlide((prev) => Math.max(prev - 1, 0))}
          disabled={activeSlide === 0}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac3202b32bf7f827881e86bd32eea7e93dc92e7f?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866"
            alt="Previous"
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[50px]"
          />
        </button>

        {visibleProducts.map((product, index) => (
          <div
            key={index}
            className="max-md:w-full max-md:flex max-md:justify-center"
          >
            <div className="max-md:w-[90%] max-md:max-w-xs">
                <div className="cursor-pointer">
                  <ProductCard  
                    name={product.name}
                    price={typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                    imageUrl={product.imageUrl}
                    onAddToCart={() => {
                      addToCart(product);
                    }}
                    slug={product.slug}
                  />
                </div>
            </div>
          </div>
        ))} 

        <button
          aria-label="Next slide"
          className="max-md:hidden"
          onClick={() => setActiveSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
          disabled={activeSlide === totalSlides - 1}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4908225cc646149bc536546beb3117fe75c41bd1?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866"
            alt="Next"
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[50px]"
          />
        </button>
      </div>

      <div className="flex gap-3 justify-center items-center self-center py-3">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            className={`flex shrink-0 self-stretch my-auto w-3 h-3 ${activeSlide === idx ? 'bg-yellow-900' : 'bg-neutral-300 bg-opacity-90'} rounded-full`}
            onClick={() => setActiveSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col justify-center self-center px-2.5 py-5 max-w-full rounded-[8px] text-lg leading-none text-center text-stone-800 w-[260px]">
        <Link href="/menu">
        <button className="self-stretch px-7 py-3.5 w-full rounded-[8px] border border-solid border-stone-800 min-h-[50px] max-md:px-5">
          Xem thêm
        </button>
        </Link>
      </div>
    </section>
  );
};

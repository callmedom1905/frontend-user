"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types/cart';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  imageUrl: string;
  name: string;
  price: string;
  variant?: 'square' | 'horizontal' | 'mobile';
  slug?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  name,
  price,
  variant = 'horizontal',
  slug
}) => {
  const [showAddedPopup, setShowAddedPopup] = useState(false);
  const router = useRouter();

  // Hàm xử lý lưu vào localStorage và hiện pop-up
  const handleOrder = (product: { imageUrl: string; name: string; price: string }) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const numericPrice = Number(product.price.replace(/[^\d]/g, '')) || 0;
    const existing = cart.find((item: CartItem) => item.name === product.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ 
        ...product, 
        price: numericPrice, 
        quantity: 1 
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setShowAddedPopup(true);
    setTimeout(() => setShowAddedPopup(false), 1500);
  };

  const handleCardClick = () => {
    if (slug && router) {
      router.push(`/menu/${slug}`);
    }
  };

  if (variant === 'horizontal') {
    return (
      <article className="flex overflow-hidden grow shrink items-start self-stretch my-auto bg-white rounded-xl min-w-60 w-[365px] max-md:max-w-full cursor-pointer">
        <img
          src={imageUrl}
          alt={name}
          className="object-contain shrink-0 aspect-[1.22] w-[205px]"
          onClick={handleCardClick}
        />
        <div className="flex flex-col flex-1 shrink justify-center px-4 py-4 basis-0 min-h-[168px] min-w-60">
          <div className="w-full text-lg font-medium leading-none min-h-[90px]">
            <h3 className="gap-2.5 self-stretch w-full text-black leading-[var(--sds-size-icon-small)]">
              {name}
            </h3>
            <p className="gap-2.5 self-stretch mt-3 w-full text-pink-800 whitespace-nowrap leading-[var(--sds-size-icon-small)]">
              {price}
            </p>
          </div>
          <div className="flex flex-col justify-center items-end mt-3 w-full text-base whitespace-nowrap text-stone-800">
            <button
              className="flex gap-2 justify-center items-center rounded-[8px] border border-solid border-stone-800 min-h-8 w-[68px]"
              onClick={e => { e.stopPropagation(); handleOrder({ imageUrl, name, price }); }}
            >
              <span className="w-4 h-4 flex items-center justify-center rounded-full border border-[#3B2219] bg-white">
                <Plus className="w-3 h-3 text-[#3B2219]" />
              </span>
              <span className="self-stretch my-auto">Đặt</span>
            </button>
          </div>
        </div>
        {showAddedPopup && (
          <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
            Đã thêm vào giỏ hàng!
          </div>
        )}
      </article>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col sm:flex-row items-center bg-gray-50 gap-3 w-full rounded-[12px] border border-gray-200 shadow-sm hover:shadow transition p-4 cursor-pointer">
      <div
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="w-full aspect-[16/10] overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
            {name}
          </h3>
          <p className="text-lg font-bold text-orange-500 mb-4">
            {price}
          </p>
          <div className="flex justify-end">
          <button
            className="flex gap-2 justify-center items-center rounded-[8px] border border-solid border-stone-800 min-h-8 w-[68px]"
            onClick={e => { e.stopPropagation(); handleOrder({ imageUrl, name, price }); }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/3262cfa1a5e84abee65d00d1af984c4d09c90038?placeholderIfAbsent=true"
              alt="Order icon"
              className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
            />
            <span className="self-stretch my-auto text-[#3B2219] font-medium">Đặt</span>
          </button>
          </div>
        </div>
        {showAddedPopup && (
          <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
            Đã thêm vào giỏ hàng!
          </div>
        )}
      </div>
      </div>
    );
  }

  // Variant square (mặc định)
  return (
    <article className="overflow-hidden self-stretch my-auto bg-white rounded-xl min-w-60 w-[340px] cursor-pointer">
      <img
        src={imageUrl}
        alt={name}
        className="object-contain w-full aspect-square"
        onClick={handleCardClick}
      />
      <div className="flex flex-col justify-center px-4 py-3">
        <div className="w-full text-lg font-medium leading-none">
          <h3 className="gap-2.5 self-stretch w-full text-black leading-[var(--sds-size-icon-small)]">
            {name}
          </h3>
          <p className="gap-2.5 self-stretch mt-3 w-full text-pink-800 whitespace-nowrap leading-[var(--sds-size-icon-small)]">
            {price}
          </p>
        </div>
        <div className="flex flex-col justify-center items-end mt-3 w-full text-base whitespace-nowrap text-stone-800">
          <button
            className="flex gap-2 justify-center items-center rounded-[8px] border border-solid border-stone-800 min-h-8 w-[68px]"
            onClick={e => { e.stopPropagation(); handleOrder({ imageUrl, name, price }); }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/3262cfa1a5e84abee65d00d1af984c4d09c90038?placeholderIfAbsent=true"
              alt="Order icon"
              className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
            />
            <span className="self-stretch my-auto">Đặt</span>
          </button>
        </div>
      </div>
      {showAddedPopup && (
        <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
          Đã thêm vào giỏ hàng!
        </div>
      )}
    </article>
  );
};

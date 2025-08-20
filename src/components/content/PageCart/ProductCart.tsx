"use client";

import React from 'react';

interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string;
  slug?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ imageSrc, title, price, slug }) => {
  const handleCardClick = () => {
    if (slug) {
      window.location.href = `/menu/${slug}`;
    }
  };

  return (
    <article className="overflow-hidden grow w-full text-center bg-white rounded-xl cursor-pointer" onClick={handleCardClick}>
      <img
        src={imageSrc}
        className="object-contain overflow-hidden w-full aspect-square"
        alt={title}
      />
      <div className="flex flex-col justify-center px-4 py-3">
        <div className="w-full text-lg font-medium leading-none">
          <h3 className="gap-2.5 self-stretch w-full text-black leading-[var(--sds-size-icon-small)]">
            {title}
          </h3>
          <p className="gap-2.5 self-stretch mt-3 w-full text-pink-800 whitespace-nowrap leading-[var(--sds-size-icon-small)]">
            {price}
          </p>
        </div>
        <div className="flex flex-col justify-center items-end mt-3 w-full text-base whitespace-nowrap text-stone-800">
          <button className="flex gap-2 justify-center items-center rounded-[8px] border border-solid border-stone-800 min-h-8 w-[68px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/9d2446bb4e1f9695882c702707347c56bb424715?placeholderIfAbsent=true"
              className="object-contain overflow-hidden shrink-0 self-stretch my-auto w-3.5 aspect-square"
              alt="Order icon"
            />
            <span className="self-stretch my-auto">Đặt</span>
          </button>
        </div>
      </div>
    </article>
  );
};

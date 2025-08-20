import React from "react";
import { IProductProps } from "@/lib/types";

export interface IProductCardProps extends IProductProps {
  slug?: string;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<IProductCardProps> = ({ name, price, imageUrl, slug, onAddToCart }) => {
  const handleCardClick = () => {
    if (slug) {
      window.location.href = `/menu/${slug}`;
    }
  };

  return (
    <article
      className="overflow-hidden grow shrink self-stretch my-auto bg-white rounded-xl min-w-60 w-[330px] cursor-pointer hover:shadow-lg transition-shadow"
    >
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
             className="flex gap-2 justify-center items-center rounded-[8px] border border-solid border-stone-800 min-h-8 w-[68px] hover:bg-stone-100 transition-colors"
             onClick={e => {
               e.stopPropagation();
               onAddToCart && onAddToCart();
             }}
           >
             <img
               src="https://cdn.builder.io/api/v1/image/assets/TEMP/3262cfa1a5e84abee65d00d1af984c4d09c90038?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866"
               alt="Order icon"
               className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
             />
             <span className="self-stretch my-auto">Đặt</span>
           </button>
         </div>
      </div>
    </article>
  );
};

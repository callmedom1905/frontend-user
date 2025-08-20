import React from 'react';
import { ProductCard } from '@/components/content/PageCart/ProductCart';

export const ProductGrid: React.FC = () => {
  const products = Array(9).fill({
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/b3a3b40a9a4a92578fb77c7ea4d53bd6fdeb4e39?placeholderIfAbsent=true",
    title: "Bánh mì",
    price: "25,000"
  });

  return (
    <section className="w-full">
        <div className="flex gap-5 max-md:flex-col max-md:">
          {products.slice(0, 3).map((product, index) => (
            <div key={index} className="w-[33%] max-md:ml-0 max-md:w-full">
              <div className="">
                <ProductCard {...product} />
              </div>
            </div>
          ))}
        </div>
        
      <div className=" mt-3 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:">
          {products.slice(0, 3).map((product, index) => (
            <div key={index} className="w-[33%] max-md:ml-0 max-md:w-full">
              <div className="max-md:mt-5">
                <ProductCard {...product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

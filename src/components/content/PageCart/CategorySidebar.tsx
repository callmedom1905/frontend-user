import React from 'react';

export const CategorySidebar: React.FC = () => {
  const categories = [
    'Khai vị',
    'Salad - Nộm',
    'Món chính',
    'Burger',
    'Sandwiches',
    'Nước uống'
  ];

  return (
    <aside className="flex flex-col w-full max-md:mt-5">
      <nav>
        {categories.map((category, index) => (
          <div key={index}>
            <div className="text-lg leading-none text-black max-md:ml-2.5">
              {category}
            </div>
            <div className="shrink-0 self-stretch h-0 border-black" />
            {index < categories.length - 1 && <div className="mt-2.5" />}
          </div>
        ))}
      </nav>

      <section className="mt-10">
        <h2 className="text-4xl font-bold leading-none text-amber-400 max-md:mt-10">
          MÓN MỚI
        </h2>
        <div className="shrink-0 self-stretch mt-5 h-0 border border-black border-solid" />

        <div className="flex gap-5">
          <div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/014e15942605b22b13f1365ac497c2fdb4a0f07e?placeholderIfAbsent=true"
              className="object-contain overflow-hidden mt-6 rounded-md aspect-square w-[99px]"
              alt="Bánh mì"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/014e15942605b22b13f1365ac497c2fdb4a0f07e?placeholderIfAbsent=true"
              className="object-contain overflow-hidden mt-6 rounded-md aspect-square w-[99px]"
              alt="Bánh mì"
            />
                        <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/014e15942605b22b13f1365ac497c2fdb4a0f07e?placeholderIfAbsent=true"
              className="object-contain overflow-hidden mt-6 rounded-md aspect-square w-[99px]"
              alt="Bánh mì"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/014e15942605b22b13f1365ac497c2fdb4a0f07e?placeholderIfAbsent=true"
              className="object-contain overflow-hidden mt-6 rounded-md aspect-square w-[99px]"
              alt="Bánh mì"
            />
          </div>
          <div className="flex flex-col my-auto text-base font-medium text-center text-black">
            <h3 className="self-start ">Bánh mì</h3>
            <p className="mt-1.5 text-pink-800">25,000 đ</p>
            <h3 className="self-start mt-16 max-md:mt-10">Bánh mì</h3>
            <p className="mt-1.5 text-pink-800">25,000 đ</p>
            <h3 className="self-start mt-16 max-md:mt-10">Bánh mì</h3>
            <p className="mt-1.5 text-pink-800">25,000 đ</p>
            <h3 className="self-start mt-16 max-md:mt-10">Bánh mì</h3>
            <p className="mt-1.5 text-pink-800">25,000 đ</p>
          </div>
        </div>
      </section>
    </aside>
  );
};

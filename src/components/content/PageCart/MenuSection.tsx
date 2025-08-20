import React from 'react';

export const MenuSection: React.FC = () => {
  return (
    <section className="flex items-center justify-between px-[230px] bg-stone-100 min-h-[142px] max-md:px-5 max-md:flex-col max-md:gap-4 max-sm:px-4">
      {/* Left: Title & Description */}
      <div className="flex-1 min-w-60 max-w-[560px]">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 uppercase">
          Menu
        </h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg font-light text-black">
          Mô tả đôi ít về thông tin liên hệ của quán khoản 25 đến 30 chữ
        </p>
      </div>
      {/* Right: Search Bar */}
      <div className="flex-1 flex justify-end min-w-60 max-w-[560px] max-md:justify-start">
        <div className="flex items-center pl-[20px] h-[46px] w-[700px] bg-white border-[1px] border-gray-500 rounded-[4px] px-5 py-2 shadow-sm max-md:w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/69d184bed472915ee9ac902afac6fa523b3d210c?placeholderIfAbsent=true"
            className="w-5 h-5 mr-3 opacity-70"
            alt="Search icon"
          />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn, đồ uống..."
            className="flex-1 outline-none bg-transparent text-black placeholder-stone-400 text-sm sm:text-base"
          />
        </div>
      </div>
    </section>
  );
};

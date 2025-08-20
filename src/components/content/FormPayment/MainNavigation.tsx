import React from 'react';

export const MainNavigation: React.FC = () => {
  return (
    <nav className="flex overflow-hidden flex-wrap justify-center items-center px-24 w-full text-lg text-center text-white max-w-[1420px] max-md:px-5 max-md:max-w-full">
      <a href="#" className="flex-1 shrink gap-2.5 self-stretch px-2.5 py-3.5 my-auto basis-0 min-h-[50px] hover:text-orange-300 transition-colors">
        Trang chủ
      </a>
      <a href="#" className="flex-1 shrink gap-2.5 self-stretch px-2.5 py-3.5 my-auto whitespace-nowrap basis-0 min-h-[50px] hover:text-orange-300 transition-colors">
        Menu
      </a>
      <a href="#" className="flex-1 shrink gap-2.5 self-stretch px-2.5 py-3.5 my-auto basis-0 min-h-[50px] hover:text-orange-300 transition-colors">
        Giới thiệu
      </a>
      <a href="#" className="flex-1 shrink gap-2.5 self-stretch px-2.5 py-3.5 my-auto basis-0 min-h-[50px] hover:text-orange-300 transition-colors">
        Tin tức
      </a>
      <a href="#" className="flex-1 shrink gap-2.5 self-stretch px-2.5 py-3.5 my-auto basis-0 min-h-[50px] hover:text-orange-300 transition-colors">
        Liên hệ
      </a>
      <button className="gap-2.5 self-stretch px-2.5 py-3.5 my-auto text-orange-300 rounded-lg border-2 border-orange-300 border-solid min-h-[50px] w-[178px] hover:bg-orange-300 hover:text-black transition-colors">
        Đặt bàn
      </button>
    </nav>
  );
};

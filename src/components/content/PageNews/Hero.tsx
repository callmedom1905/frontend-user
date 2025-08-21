import * as React from "react";

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col justify-center w-full bg-zinc-100 min-h-[167px] px-4">
      <div className="my-auto w-full max-w-[1420px] mx-auto">
        <h1 className="text-4xl font-black text-[#D4AF37] uppercase text-left">
          Tin tức
        </h1>
        <p className="mt-4 text-lg font-light text-black text-left">
          Nơi cập nhật nhanh nhất những sự kiện nóng hổi, chương trình khuyến
          mại,khách hàng và thông tin thương hiệu.
        </p>
      </div>
    </section>
  );
}; 
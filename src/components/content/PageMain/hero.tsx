import React from "react";

export const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <img
        src="images/banner/428618785_795566112611982_156172194641821905_n.jpg"
        alt="Hero banner"
        className="object-contain w-full max-md:max-w-full"
      />
      <h1 className="gap-2.5 self-center px-2.5 py-12 w-full text-6xl font-black text-center uppercase leading-[100px] text-neutral-700 max-md:max-w-full max-md:text-4xl max-md:leading-[74px]">
        Đặt chỗ dễ dàng
        <br />
        Trải nghiệm hoàn hảo
      </h1>
    </section>
  );
};

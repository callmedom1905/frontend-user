import React from "react";

export const QuoteSection: React.FC = () => {
  return (
    <section className="flex flex-wrap gap-3 justify-center items-center px-64 mt-10 w-full text-3xl font-bold text-right text-black bg-yellow-50 leading-[56px] max-md:px-5 max-md:max-w-full">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8bf137dfe1de98c5d5b73259fc99978a57cad8e8?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866"
        alt="Restaurant ambiance"
        className="object-contain grow shrink self-stretch my-auto aspect-square min-w-60 w-[350px] max-md:max-w-full"
      />
      <blockquote className="grow shrink self-stretch my-auto w-[750px] max-md:max-w-full">
        "Where Prime Cuts Meet Perfection" <br />
        Nơi những miếng thịt thượng hạng chạm đến sự hoàn hảo.
      </blockquote>
    </section>
  );
};

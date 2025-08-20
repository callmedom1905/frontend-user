import * as React from "react";
import { ContactFormFields } from "./ContactFormFields";

export function ContactForm() {
  return (
    <main className="flex flex-col justify-center self-center py-10 w-full max-w-[1440px] max-md:max-w-full">
      <div className="flex flex-wrap gap-10 justify-center items-start py-10 w-full bg-white rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.25)] max-md:max-w-full px-4 md:px-10">
        <section className="flex flex-col items-start min-w-60 w-[538px]">
          <div className="self-stretch w-full text-black">
            <h2 className="text-6xl font-bold max-md:text-4xl">
            Moo Beef Steak Prime
            </h2>
            <p className="mt-5 text-base font-light max-md:max-w-full">
            “Where Prime Cuts Meet Perfection” – Nơi những miếng thịt thượng hạng chạm đến sự hoàn hảo.
            </p>
          </div>

          <address className="flex flex-col items-start mt-14 text-base text-black max-md:mt-10 not-italic">
            <div className="flex gap-3 justify-center items-center self-stretch">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/1ff2b704144f52daf061241f92d17cae7dcf4aa4?placeholderIfAbsent=true&apiKey=41b57356558447c3bfc6c635dc5fd619"
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                alt="Location icon"
              />
              <div className="self-stretch my-auto">
                35 Ngô Đức Kế, Bến Nghé, Quận 1.
              </div>
            </div>
            <div className="flex gap-3 justify-center items-center mt-3 whitespace-nowrap">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2dd578f5e599ec3c84390d638e4fd33e7515c1bd?placeholderIfAbsent=true&apiKey=41b57356558447c3bfc6c635dc5fd619"
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                alt="Email icon"
              />
              <div className="self-stretch my-auto">
              momobeef@gmail.com
              </div>
            </div>
            <div className="flex gap-3 justify-center items-center mt-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/436cd8c9ada4e57ffced9f79ba1074ecb764afa9?placeholderIfAbsent=true&apiKey=41b57356558447c3bfc6c635dc5fd619"
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                alt="Phone icon"
              />
              <div className="self-stretch my-auto">1900636323</div>
            </div>
          </address>

          <div className="flex gap-5 items-start mt-14 max-md:mt-10">
            <a href="https://www.facebook.com/prime.moobeefsteak?mibextid=LQQJ4d" target="_blank">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/657418ade814bf10e4759a97445312ce4f0d6396?placeholderIfAbsent=true&apiKey=41b57356558447c3bfc6c635dc5fd619"
              className="object-contain shrink-0 aspect-[1.04] w-[25px]"
              alt="Social media"
            />
            </a>
          </div>
        </section>

        <ContactFormFields />
      </div>
    </main>
  );
} 
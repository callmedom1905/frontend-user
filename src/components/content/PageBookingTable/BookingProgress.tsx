"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

export const BookingProgress: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  // Xác định step dựa vào url
  let currentStep: 1 | 2 | 3 = 1;
  if (pathname.includes("dat-ban")) currentStep = 1;
  else if (pathname.includes("meal") || pathname.includes("menu")) currentStep = 2;
  else if (pathname.includes("payment") || pathname.includes("form-payment")) currentStep = 3;
  const handleBack = () => {
    if (typeof window !== 'undefined') window.history.back();
  };

  return (
    <section className="flex flex-wrap gap-5 items-center px-64 w-full bg-zinc-100 min-h-[200px] max-md:px-5 max-md:max-w-full">
        <button
          className="flex items-center gap-2 px-6 py-2 text-black font-bold text-lg transition"
          onClick={handleBack}
        >
          <span>
            <svg width="24" height="24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#4B2E23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          TRỞ LẠI
        </button> 

      <div className="flex grow shrink gap-4 justify-center items-center self-stretch my-auto font-black text-center uppercase min-h-28 min-w-60 w-[896px] max-md:max-w-full">
        <div className="flex flex-wrap gap-10 justify-center items-start self-stretch my-auto min-w-60 max-md:max-w-full">
          <div className="flex flex-col justify-center items-center w-[93px]">
            <div className={`px-2.5 text-2xl text-white whitespace-nowrap ${currentStep === 1 ? 'bg-orange-300' : 'bg-stone-300'} rounded-3xl h-[50px] w-[50px] flex items-center justify-center`}>
              1
            </div>
            <div className={`mt-3 text-xl ${currentStep === 1 ? 'text-orange-300' : 'text-black'}`}>Đặt bàn</div>
          </div>
          <div className="flex flex-col justify-center items-center w-28">
            <div className={`px-2.5 text-2xl whitespace-nowrap ${currentStep === 2 ? 'bg-orange-300' : 'bg-stone-300'} rounded-3xl h-[50px] w-[50px] flex items-center justify-center`}>
              2
            </div>
            <div className={`mt-3 text-xl ${currentStep === 2 ? 'text-orange-300' : 'text-black'}`}>Thực đơn</div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className={`px-2.5 text-2xl whitespace-nowrap ${currentStep === 3 ? 'bg-orange-300' : 'bg-stone-300'} rounded-3xl h-[50px] w-[50px] flex items-center justify-center`}>
              3
            </div>
            <div className={`mt-3 text-xl text-center ${currentStep === 3 ? 'text-orange-300' : 'text-black'}`}>
              Xác thực <br />
              thanh toán
            </div>
          </div>
        </div>
      </div>

      <div className="flex grow shrink gap-4 self-stretch w-10 h-[46px]" />
    </section>
  );
};

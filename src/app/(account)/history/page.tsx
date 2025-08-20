"use client";

import { BookingHistoryTable } from "@/components/content/History/BookingHistoryTable";
import { ProfileTabs } from "@/components/content/History/ProfileTabs";
import * as React from "react";


export default function History() {
  return (
    <div className="flex overflow-hidden flex-col bg-stone-100">

      <section className="self-center mt-10 w-full max-w-[1420px] max-md:max-w-full">

        <div className="self-stretch my-auto min-w-60 w-[700px]">
          <h1 className="text-4xl font-black text-amber-400 uppercase">
            Thông tin cá nhân
          </h1>
          <p className="mt-4 text-lg font-light text-black max-md:max-w-full">
            Thông tin cá nhân của bạn sẽ được hiển thị ở đây
          </p>
        </div>
      </section>

      <main className="self-center mt-10 w-full max-w-[1420px] max-md:max-w-full">
        <ProfileTabs />

        <div className="mt-2.5 mb-2.5">
          <BookingHistoryTable />
        </div>
      </main>

    </div>
  );
}



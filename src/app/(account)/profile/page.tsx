"use client";

import { PersonalInfoForm } from "@/components/content/Profile/PersonalInfoForm";
import { ProfileTabs } from "@/components/content/Profile/ProfileTabs";
import * as React from "react";


export default function Profile() {
  return (
    <div className="flex overflow-hidden flex-col bg-stone-100">

      {/* <section className="flex gap-5 items-center px-40 bg-zinc-100 min-h-[200px] max-md:px-5"> */}
      <section className="self-center mt-10 w-full max-w-[1420px] max-md:max-w-full">

        <div className="self-stretch my-auto min-w-60 w-[700px]">
          <h1 className="text-4xl font-black text-amber-400 uppercase">
            Thông tin cá nhân
          </h1>
          <p className="mt-4 text-lg font-light text-black max-md:max-w-full">
            Mô tả đôi ít về thông tin liên hệ của quán khoản 25 đến 30 chữ
          </p>
        </div>
      </section>

      <main className="self-center mt-10 w-full max-w-[1420px] max-md:max-w-full">
        <ProfileTabs />

        <div className="mt-2.5 mb-2.5">
          <PersonalInfoForm />
        </div>
      </main>

    </div>
  );
}



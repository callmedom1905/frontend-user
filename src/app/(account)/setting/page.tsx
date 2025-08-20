"use client";

import { NotificationSettings } from "@/components/content/Setting/NotificationSettings";
import { PrivacySettings } from "@/components/content/Setting/PrivacySettings";
import { ProfileTabs } from "@/components/content/Setting/ProfileTabs";
import * as React from "react";

export default function Profile() {
  return (
    <div className="flex flex-col overflow-hidden bg-stone-100">
      {/* <section className="flex gap-5 items-center px-40 bg-zinc-100 min-h-[200px] max-md:px-5"> */}
      <section className="mt-10 w-full max-w-[1420px] self-center max-md:max-w-full">
        <div className="my-auto w-[700px] min-w-60 self-stretch">
          <h1 className="text-4xl font-black uppercase text-amber-400">
            Thông tin cá nhân
          </h1>
          <p className="mt-4 text-lg font-light text-black max-md:max-w-full">
            Mô tả đôi ít về thông tin liên hệ của quán khoản 25 đến 30 chữ
          </p>
        </div>
      </section>

      <main className="mt-10 w-full max-w-[1420px] self-center max-md:max-w-full">
        <ProfileTabs />

        <div className="mb-2.5 mt-2.5">
          <section className="flex w-full flex-wrap items-start gap-5 overflow-hidden rounded-xl bg-white p-5 max-md:max-w-full">
            <NotificationSettings />
            <PrivacySettings />
          </section>
        </div>
      </main>
    </div>
  );
}


"use client";
import Link from "next/link";
import * as React from "react";

export const ProfileTabs = () => {
  return (
    <nav className="flex flex-row flex-nowrap justify-end gap-2.5 items-center w-full text-lg text-center text-black overflow-x-auto">
      <Link  href="/history" className="gap-2.5 self-stretch p-2.5 my-auto bg-white rounded-xl w-[220px]">
        Lịch sử
      </Link>
      <Link  href="/voucher" className="gap-2.5 self-stretch p-2.5 my-auto text-[#FAF3E0] rounded-xl bg-stone-800 w-[220px]">
        Voucher
      </Link>
    </nav>
  );
};

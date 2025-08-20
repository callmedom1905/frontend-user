"use client";
import * as React from "react";

export const PasswordUpdateForm = () => {
  return (
    <section className="flex flex-col grow shrink justify-center text-2xl font-black min-w-60 w-[976px] max-md:max-w-full">
      <h2 className="self-start mt-5 text-amber-400 uppercase">
        Cập nhật mật khẩu
      </h2>
      <form className="flex overflow-hidden flex-col p-5 w-full text-xs font-medium max-w-[1040px] max-md:max-w-full">
        <div className="flex gap-5 justify-center items-center w-full max-md:max-w-full">
          <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto w-full basis-0 min-w-60 max-md:max-w-full">
            <label className="leading-6 text-black max-md:max-w-full">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              className="gap-2.5 self-stretch px-2.5 py-3.5 mt-2 w-full text-left rounded bg-zinc-100 min-h-10 text-stone-300 max-md:max-w-full"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-5 justify-center items-center mt-5 w-full max-md:max-w-full">
          <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-0 min-w-60 max-md:max-w-full">
            <label className="leading-6 text-black max-md:max-w-full">
              Mật khẩu mới
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              className="gap-2.5 self-stretch px-2.5 py-3.5 mt-2 w-full text-left rounded bg-zinc-100 min-h-10 text-stone-300 max-md:max-w-full"
            />
          </div>
          <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-0 min-w-60 max-md:max-w-full">
            <label className="leading-6 text-black max-md:max-w-full">
              Xác nhận lại mật khẩu mới
            </label>
            <input
              type="password"
              placeholder="Xác nhận lại mật khẩu mới"
              className="gap-2.5 self-stretch px-2.5 py-3.5 mt-2 w-full text-left rounded bg-zinc-100 min-h-10 text-stone-300 max-md:max-w-full"
            />
          </div>
        </div>
        <button
          type="submit"
          className="gap-2.5 self-start px-7 py-1.5 mt-5 text-sm leading-6 text-center text-yellow-50 rounded bg-stone-800 max-md:px-5"
        >
          Cập nhật mật khẩu
        </button>
      </form>
    </section>
  );
};

"use client";
import * as React from "react";
import { PasswordUpdateForm } from "./PasswordUpdateForm";
import Cookies from "js-cookie";

export const PersonalInfoForm = () => {
  const [user, setUser] = React.useState({
    name: "",
    phone: "",
    email: "",
  })
  React.useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (err) {
        console.error("Lỗi khi đọc cookie user:", err);
      }
    }
  }, []);

  return (
    <section className="flex overflow-hidden flex-wrap gap-5 items-start p-5 w-full bg-white rounded-xl max-md:max-w-full">
      <div className="flex overflow-hidden flex-col grow shrink w-64 text-sm leading-6 text-center text-yellow-50 min-w-60">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/38b2e106282946ca81bcf78ec2ab79c6/d4c0a3cb67152437675c4e333896aacf21413b9c?placeholderIfAbsent=true"
          className="object-contain w-full rounded-xl aspect-square"
          alt="Profile avatar"
        />
        <button className="gap-2.5 self-center px-7 py-2.5 mt-2.5 rounded bg-stone-800 max-md:px-5">
          Sửa ảnh
        </button>
      </div>
      <div className="flex flex-col grow shrink justify-center text-2xl font-black min-w-60 w-[976px] max-md:max-w-full">
        <h2 className="self-start text-amber-400 uppercase">
          Thông tin cá nhân
        </h2>
        <form className="flex overflow-hidden flex-col p-5 w-full text-xs font-medium max-w-[1040px] max-md:max-w-full">
          <div className="flex gap-5 justify-center items-center w-full max-md:max-w-full">
            <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto w-full basis-0 min-w-60 max-md:max-w-full">
              <label className="leading-6 text-black max-md:max-w-full">
                Họ và tên
              </label>
              <input
                type="text"
                value={ user.name }
                className="gap-2.5 self-stretch px-2.5 py-3.5 mt-2 w-full text-left rounded bg-zinc-100 min-h-10 text-neutral-700 max-md:max-w-full"
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-5 justify-center items-center mt-5 w-full max-md:max-w-full">
            <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-0 min-w-60 max-md:max-w-full">
              <label className="leading-6 text-black max-md:max-w-full">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={ user.phone }
                className="gap-2.5 self-stretch px-2.5 py-3.5 mt-2 w-full text-left rounded bg-zinc-100 min-h-10 text-neutral-700 max-md:max-w-full"
                readOnly
              />
            </div>
            <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto whitespace-nowrap basis-0 min-w-60 max-md:max-w-full">
              <label className="leading-6 text-black max-md:max-w-full">
                Email
              </label>
              <input
                type="email"
                value={ user.email }
                className="gap-2.5 self-stretch px-2.5 py-3.5 mt-2 w-full text-left rounded bg-zinc-100 min-h-10 text-neutral-700 max-md:max-w-full"
                readOnly
              />
            </div>
          </div>
          <button
            type="submit"
            className="gap-2.5 self-start px-7 py-1.5 mt-5 text-sm leading-6 text-center text-yellow-50 rounded bg-stone-800 max-md:px-5"
          >
            Cập nhật thông tin
          </button>
        </form>
        <PasswordUpdateForm />
      </div>
    </section>
  );
};

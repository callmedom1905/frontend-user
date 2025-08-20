"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "@/components/layout/UserMenu";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleProfile = () => {
    router.push("/history");
    setDropdownOpen(false);
  };

  return (
    <header className="flex w-full flex-col items-center border-white bg-neutral-900 pb-2.5">
      <section className="text-[14px] w-full self-stretch bg-[#E6C67A] text-right text-base text-black max-md:max-w-full  max-md:pl-5">
        {user ? (
          <div
            className="relative inline-block text-left float-right"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className="min-h-10 px-4 py-2 text-black font-semibold rounded-t-md border-none focus:outline-none w-auto"
              style={{ background: 'none', minWidth: 0 }}
            >
              {user.name}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-0 z-50">
                <UserMenu
                  onAccountClick={handleProfile}
                  onLogoutClick={logout}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="min-h-10 gap-3 self-stretch p-2.5 font-bold">
              <Link href="/register">
                Đăng ký
              </Link>
            </button>
            <button className="min-h-10 gap-2.5 self-stretch p-2.5 font-bold">
              <Link href="/login">
                Đăng nhập
              </Link>
            </button>
          </>
        )}
      </section>

      {/* Mobile Header */}
      <div className="flex w-full items-end px-4 py-2 md:hidden ">
        {/* Hamburger icon */}
        <button
          className="h-5 w-4 flex items-center justify-center text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <div className="flex-1 text-center">
          <Link href="/" className="text-white font-bold text-xl">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/032a4d0af9ce85e2151c43f0580fb282e17da5a3?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866"
              alt="Restaurant logo"
              className="inline-block h-[50px] object-contain"
            />
          </Link>
          
        </div>
        <Link href="/dat-ban">
        <button className="h-[22px] w-[80px] justify-center rounded-[8px] border-2 border-yellow-400 px-[10px] text-[10px] text-yellow-400">
            Đặt Bàn
          </button>
        </Link>
      </div>

      {/* Mobile Slide Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex">
          <div className="w-3/4 max-w-xs bg-neutral-900 h-full p-6 flex flex-col gap-4 animate-slide-in-left">
            <button
              className="self-end mb-4 text-white text-2xl"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Đóng menu"
            >
              &times;
            </button>
            <Link href="/" className={`py-2 border-b border-neutral-700 ${pathname === "/" ? "text-orange-300" : "text-white"}`}>Trang chủ</Link>
            <Link href="/menu" className={`py-2 border-b border-neutral-700 ${pathname === "/menu" ? "text-orange-300" : "text-white"}`}>Menu</Link>
            <Link href="/gioi-thieu" className={`py-2 border-b border-neutral-700 ${pathname === "/gioi-thieu" ? "text-orange-300" : "text-white"}`}>Giới thiệu</Link>
            <Link href="/tin-tuc" className={`py-2 border-b border-neutral-700 ${pathname === "/tin-tuc" ? "text-orange-300" : "text-white"}`}>Tin tức</Link>
            <Link href="/lien-he" className={`py-2 border-b border-neutral-700 ${pathname === "/lien-he" ? "text-orange-300" : "text-white"}`}>Liên hệ</Link>
            <Link href="/dat-ban"><button className={`mt-4 rounded-[8px] border-2 border-yellow-400 px-4 py-2 text-yellow-400 ${pathname === "/dat-ban" ? "text-white border-white" : "text-white border-white"}`}>Đặt bàn</button></Link>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden w-[314px] min-h-[100px] max-w-full flex-col justify-center px-2.5 py-1.5 md:flex">
        <Link href="/" className="flex items-center justify-center w-full h-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/032a4d0af9ce85e2151c43f0580fb282e17da5a3?placeholderIfAbsent=true&apiKey=a20586ce4c1b41ce81ab28e7c7b82866"
            alt="Restaurant logo"
            className="aspect-[3.27] w-full object-contain"
          />
        </Link>
        
      </div>
      <nav className="hidden w-full max-w-[1420px] flex-wrap items-center justify-center px-24 text-center text-lg text-white md:flex max-md:max-w-full max-md:px-5">
        <Link
          href="/"
          className={`my-auto min-h-[50px] shrink flex-1 basis-0 self-stretch px-2.5 py-3.5 ${pathname === "/" ? "text-orange-300" : ""}`}
        >
          Trang chủ
        </Link>
        <Link
          href="/menu"
          className={`my-auto min-h-[50px] shrink flex-1 basis-0 self-stretch whitespace-nowrap px-2.5 py-3.5 ${pathname === "/menu" ? "text-orange-300" : ""}`}
        >
          Menu
        </Link>
        <Link
          href="/gioi-thieu"
          className={`my-auto min-h-[50px] shrink flex-1 basis-0 self-stretch px-2.5 py-3.5 ${pathname === "/gioi-thieu" ? "text-orange-300" : ""}`}
        >
          Giới thiệu
        </Link>
        <Link
          href="/tin-tuc"
          className={`my-auto min-h-[50px] shrink flex-1 basis-0 self-stretch px-2.5 py-3.5 ${pathname === "/tin-tuc" ? "text-orange-300" : ""}`}
        >
          Tin tức
        </Link>
        <Link
          href="/lien-he"
          className={`my-auto min-h-[50px] shrink flex-1 basis-0 self-stretch px-2.5 py-3.5 ${pathname === "/lien-he" ? "text-orange-300" : ""}`}
        >
          Liên hệ
        </Link>
        <Link href="/dat-ban">
        <button className={`my-auto min-h-[50px] w-[178px] self-stretch rounded-[8px] border-2 border-solid ${pathname === "/dat-ban" ? "border-white text-orange-300" : "border-orange-300 text-white"} px-2.5 py-3.5`}>
            Đặt Bàn
        </button>
        </Link>
      </nav>
    </header> 
  );
};

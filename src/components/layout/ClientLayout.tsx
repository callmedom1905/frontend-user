"use client";
import React, { useEffect, useRef } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { usePathname } from 'next/navigation';
import { LoginSuccessNotification, RegisterSuccessNotification } from "@/components/common";
import "@/app/globals.css";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/new-pass') || pathname.startsWith('/forgot-pass');
  const csrfCalled = useRef(false);

  useEffect(() => {
    if (!csrfCalled.current) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://moobeefsteak.online';
      fetch(`${apiBaseUrl}/api/csrf-token`, {
        credentials: "include"
      });
      csrfCalled.current = true;
    }
  }, []);

  return (
    <>
      {!isAuthPage && <Header />}
      {children}
      {!isAuthPage && <Footer />}
      
      {/* Component thông báo đăng nhập/đăng ký thành công - hiển thị trên mọi trang */}
      <LoginSuccessNotification />
      <RegisterSuccessNotification />
    </>
  );
} 
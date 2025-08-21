"use client";
import * as React from "react";
import { InputField } from "./InputField";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authAPI } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { LoginResponse } from "@/lib/types";

export function LoginForm() {
  const [identifier, setIdentifier] = useState(""); // email hoặc phone
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const router = useRouter();
  const { setUser, triggerLoginSuccess } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authAPI.initialize();
      let res: LoginResponse;
      if (/^\d{8,}$/.test(identifier)) {
        // Nếu là số điện thoại
        res = (await authAPI.loginByPhone(identifier, password) as unknown) as LoginResponse;
      } else {
        // Email
        res = (await authAPI.login(identifier, password) as unknown) as LoginResponse;
      }
      
      console.log("Full response:", res);
      
      // Kiểm tra nếu email chưa được verify
      if (res?.email_not_verified) {
        setShowVerificationMessage(true);
        setError("Vui lòng xác nhận email trước khi đăng nhập.");
        return;
      }
      
      // Lưu token và user vào cookie
      if (res && res.access_token && res.user) {
        Cookies.set("token", res.access_token);
        Cookies.set("user", JSON.stringify(res.user));
        
        console.log("Token saved:", res.access_token);
        console.log("User saved:", res.user);
        
        // Trigger login success và chuyển về trang chủ
        triggerLoginSuccess(res.user);
        router.push("/");
      } else {
        console.error("Response structure:", res);
        setError("Đăng nhập thành công nhưng không thể lưu thông tin phiên đăng nhập");
        return;
      }
      
      // Không cần logic chuyển hướng ở đây nữa vì đã chuyển hướng ở trên
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await authAPI.resendVerificationEmail(identifier);
      setError("Email xác nhận đã được gửi lại thành công!");
    } catch (err: any) {
      setError(err?.message || "Gửi lại email thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý đăng nhập Google
  const handleGoogleLogin = () => {
    // Luôn dùng URL tuyệt đối
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://moobeefsteak.online"}/api/auth/google/redirect`;
  };

  // Hàm xử lý đăng nhập Facebook
  const handleFacebookLogin = () => {
    // Luôn dùng URL tuyệt đối
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://moobeefsteak.online"}/api/auth/facebook/redirect`;
  };

  if (showVerificationMessage) {
    return (
      <div className="flex flex-col items-center w-full max-w-[340px] mt-2">
        <h1 className="text-xl font-bold text-white mb-6 tracking-wide text-center">
          XÁC NHẬN EMAIL
        </h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center w-full">
          <div className="text-red-400 text-sm mb-4">
            {error}
          </div>
          <p className="text-white text-sm mb-4">
            Tài khoản của bạn chưa được xác nhận email.
          </p>
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full py-3 bg-[#44291a] text-white text-lg font-semibold rounded-2xl hover:bg-[#5a3622] transition-colors shadow-lg mb-4"
          >
            {loading ? "Đang gửi..." : "Gửi lại email xác nhận"}
          </button>
          <button
            onClick={() => {
              setShowVerificationMessage(false);
              setError("");
            }}
            className="w-full py-3 bg-transparent text-white text-lg font-semibold rounded-2xl border border-white hover:bg-white/10 transition-colors"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-[340px] mt-2">
      <h1 className="text-xl font-bold text-white mb-6 tracking-wide text-center">
        ĐĂNG NHẬP
      </h1>
      <div className="w-full">
        <InputField
          label="Số điện thoại hoặc email"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/94f94d6857d9d359508848f2604192d772f8d77c?placeholderIfAbsent=true"
          type="text"
          value={identifier}
          onChange={setIdentifier}
        />
      </div>
      <div className="w-full">
        <InputField
          label="Mật khẩu"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/f9a649a9766e19c99f883e2ddae6df415bf265d4?placeholderIfAbsent=true"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      <button
        type="submit"
        className="w-full py-3 mt-2 bg-[#44291a] text-white text-lg font-semibold rounded-2xl hover:bg-[#5a3622] transition-colors shadow-lg"
        disabled={loading}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      
      <div className="w-full text-right mt-2">
        <Link href="/forgot-pass" className="text-[#ffd600] hover:text-yellow-300 text-sm font-semibold">
          Quên mật khẩu?
        </Link>
      </div>
      
      {/* Container cho 2 nút đăng nhập mạng xã hội */}
      <div className="w-full flex gap-3 mt-3 justify-center">
        {/* Nút đăng nhập Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-32 h-10 flex items-center justify-center gap-2 py-1 bg-white text-[#44291a] text-sm font-semibold rounded-xl border border-[#44291a] hover:bg-gray-100 transition-colors shadow-lg"
        >
          <Image src="/images/logo/Google__G__logo.svg.webp" alt="Google" width={20} height={20} />
          Google
        </button>
        {/* Nút đăng nhập Facebook */}
        <button
          type="button"
          onClick={handleFacebookLogin}
          className="w-32 h-10 flex items-center justify-center gap-2 py-1 bg-[#1877f2] text-white text-sm font-semibold rounded-xl hover:bg-[#166fe5] transition-colors shadow-lg"
        >
          <Image src="/images/logo/Facebook_Logo_(2019).png" alt="Facebook" width={20} height={20} />
          Facebook
        </button>
      </div>
      
      <div className="mt-4 text-center text-sm text-white">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-[#ffd600] hover:text-yellow-300 font-semibold">
          Đăng ký ngay
        </Link>
      </div>
    </form>
    </>
  );
}

export default LoginForm;

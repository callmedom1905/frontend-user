"use client";
import * as React from "react";
import { InputField } from "./InputField";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authAPI } from "@/lib/apiClient";
import { useRouter, useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Token không hợp lệ");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    setLoading(true);

    try {
      await authAPI.initialize();
      const res = await authAPI.resetPassword(token, password, confirmPassword);
      
      if (res?.status) {
        setSuccess("Mật khẩu đã được đặt lại thành công! Đang chuyển đến trang đăng nhập...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(res?.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err?.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center w-full max-w-[340px] mt-2">
        <h1 className="text-xl font-bold text-white mb-6 tracking-wide text-center">
          LỖI
        </h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center w-full">
          <div className="text-red-400 text-sm mb-4">
            Token không hợp lệ hoặc đã hết hạn
          </div>
          <Link
            href="/forgot-pass"
            className="text-[#ffd600] hover:text-yellow-300 font-semibold"
          >
            Yêu cầu link mới
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-[340px] mt-2">
      <h1 className="text-xl font-bold text-white mb-6 tracking-wide text-center">
        ĐẶT LẠI MẬT KHẨU
      </h1>
      <p className="text-white text-sm text-center mb-6">
        Nhập mật khẩu mới cho tài khoản của bạn
      </p>
      
      <div className="w-full">
        <InputField
          label="Mật khẩu mới"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/f9a649a9766e19c99f883e2ddae6df415bf265d4?placeholderIfAbsent=true"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Nhập mật khẩu mới"
        />
      </div>
      
      <div className="w-full">
        <InputField
          label="Xác nhận mật khẩu"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/f9a649a9766e19c99f883e2ddae6df415bf265d4?placeholderIfAbsent=true"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Nhập lại mật khẩu mới"
        />
      </div>
      
      {error && <div className="text-red-400 text-sm mt-2 w-full text-center">{error}</div>}
      {success && <div className="text-green-400 text-sm mt-2 w-full text-center">{success}</div>}
      
      <button
        type="submit"
        className="w-full py-3 mt-4 bg-[#44291a] text-white text-lg font-semibold rounded-2xl hover:bg-[#5a3622] transition-colors shadow-lg"
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
      </button>
      
      <div className="mt-4 text-center text-sm text-white">
        Nhớ mật khẩu?{" "}
        <Link href="/login" className="text-[#ffd600] hover:text-yellow-300 font-semibold">
          Đăng nhập
        </Link>
      </div>
    </form>
  );
}

export default ResetPasswordForm; 
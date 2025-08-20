"use client";
import * as React from "react";
import { InputField } from "./InputField";
import Link from "next/link";
import { useState } from "react";
import { authAPI } from "@/lib/apiClient";

export function FormForGotPass() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authAPI.initialize();
      const res = await authAPI.forgotPassword(email);
      
      if (res?.status) {
        setSuccess("Email đặt lại mật khẩu đã được gửi thành công! Vui lòng kiểm tra hộp thư của bạn.");
        setEmail("");
      } else {
        setError(res?.message || "Gửi email thất bại");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(err?.message || "Gửi email thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-[340px] mt-2">
      <h1 className="text-xl font-bold text-white mb-6 tracking-wide text-center">
        QUÊN MẬT KHẨU
      </h1>
      <p className="text-white text-sm text-center mb-6">
        Nhập email của bạn để nhận link đặt lại mật khẩu
      </p>
      
      <div className="w-full">
        <InputField
          label="Email"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/9407924fa9f7e377cec238d93ea7315b3312ea41?placeholderIfAbsent=true"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Nhập email của bạn"
        />
      </div>
      
      {error && <div className="text-red-400 text-sm mt-2 w-full text-center">{error}</div>}
      {success && <div className="text-green-400 text-sm mt-2 w-full text-center">{success}</div>}
      
      <button
        type="submit"
        className="w-full py-3 mt-4 bg-[#44291a] text-white text-lg font-semibold rounded-2xl hover:bg-[#5a3622] transition-colors shadow-lg"
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi email"}
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

export default FormForGotPass;

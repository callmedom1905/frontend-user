"use client";
import * as React from "react";
import { FormField } from "./FormField";
import Link from "next/link";
import { useState } from "react";
import { authAPI } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface RegisterFormProps {
  onSubmit?: (formData: RegisterFormData) => void;
  onLoginClick?: () => void;
}

interface RegisterFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onLoginClick,
}) => {
  const [formData, setFormData] = React.useState<RegisterFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const router = useRouter();
  const { triggerRegisterSuccess } = useAuth();

  const handleFieldChange = (field: keyof RegisterFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    try {
      await authAPI.initialize();
      const res = await authAPI.register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
      });
      
      if (res?.data?.email_verification_sent) {
        setShowVerificationMessage(true);
        setSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
      } else if (res?.data?.access_token && res?.data?.user) {
        Cookies.set("token", res.data.access_token);
        Cookies.set("user", JSON.stringify(res.data.user));
        
        // Trigger register success và chuyển về trang chủ
        triggerRegisterSuccess(res.data.user);
        router.push("/");
      } else {
        setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err: any) {
      setError(err?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await authAPI.resendVerificationEmail(formData.email);
      setSuccess("Email xác nhận đã được gửi lại thành công!");
    } catch (err: any) {
      setError(err?.message || "Gửi lại email thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý đăng ký Google
  const handleGoogleRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://moobeefsteak.online"}/api/auth/google/redirect`;
  };

  // Hàm xử lý đăng ký Facebook
  const handleFacebookRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://moobeefsteak.online"}/api/auth/facebook/redirect`;
  };

  if (showVerificationMessage) {
    return (
      <div className="flex flex-col w-full max-w-[400px] mx-auto">
        <header className="text-center text-2xl font-bold text-white mb-6 tracking-wider">
          XÁC NHẬN EMAIL
        </header>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <div className="text-green-400 text-sm mb-4">
            {success}
          </div>
          <p className="text-white text-sm mb-4">
            Chúng tôi đã gửi email xác nhận đến <strong>{formData.email}</strong>
          </p>
          <p className="text-white text-sm mb-6">
            Vui lòng kiểm tra hộp thư và nhấn vào link xác nhận để kích hoạt tài khoản.
          </p>
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full py-3 bg-[#44291a] text-white text-lg font-semibold rounded-2xl hover:bg-[#5a3622] transition-colors shadow-lg mb-4"
          >
            {loading ? "Đang gửi..." : "Gửi lại email"}
          </button>
          <button
            onClick={() => {
              setShowVerificationMessage(false);
              setSuccess("");
              setError("");
            }}
            className="w-full py-3 bg-transparent text-white text-lg font-semibold rounded-2xl border border-white hover:bg-white/10 transition-colors"
          >
            Quay lại đăng ký
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[400px] mx-auto">
      <header className="text-center text-2xl font-bold text-white mb-6 tracking-wider">
        ĐĂNG KÝ
      </header>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          label="Họ và tên"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/74aafc7490cd84f3b708895f7ce3aea07ad0638e?placeholderIfAbsent=true"
          value={formData.fullName}
          onChange={handleFieldChange("fullName")}
          placeholder="Họ và tên"
        />
        <FormField
          label="Số điện thoại"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/58a548b51911073d50c4d91f6d03db26037bad41?placeholderIfAbsent=true"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleFieldChange("phoneNumber")}
          placeholder="Số điện thoại"
        />
        <FormField
          label="Email"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/9407924fa9f7e377cec238d93ea7315b3312ea41?placeholderIfAbsent=true"
          type="email"
          value={formData.email}
          onChange={handleFieldChange("email")}
          placeholder="Email"
        />
        <FormField
          label="Mật khẩu"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/8d0462abdb69f194db6d8fd26b1b13eb3e4c6ce2?placeholderIfAbsent=true"
          type="password"
          value={formData.password}
          onChange={handleFieldChange("password")}
          placeholder="Mật khẩu"
        />
        <FormField
          label="Xác nhận mật khẩu"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/146d2af84d806de396cb8904ca79ae2d67332b3a?placeholderIfAbsent=true"
          type="password"
          value={formData.confirmPassword}
          onChange={handleFieldChange("confirmPassword")}
          placeholder="Xác nhận mật khẩu"
        />
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-400 text-sm mt-2">{success}</div>}
        <button
          type="submit"
          className="w-full py-3 mt-2 bg-[#44291a] text-white text-lg font-semibold rounded-2xl hover:bg-[#5a3622] transition-colors shadow-lg"
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {/* Container cho 2 nút đăng ký mạng xã hội */}
        <div className="w-full flex gap-3 mt-3 justify-center">
          {/* Nút đăng ký Google */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-32 h-10 flex items-center justify-center gap-2 py-1 bg-white text-[#44291a] text-sm font-semibold rounded-xl border border-[#44291a] hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Image src="/images/logo/Google__G__logo.svg.webp" alt="Google" width={20} height={20} />
            Google
          </button>
          {/* Nút đăng ký Facebook */}
          <button
            type="button"
            onClick={handleFacebookRegister}
            className="w-32 h-10 flex items-center justify-center gap-2 py-1 bg-[#1877f2] text-white text-sm font-semibold rounded-xl hover:bg-[#166fe5] transition-colors shadow-lg"
          >
            <Image src="/images/logo/Facebook_Logo_(2019).png" alt="Facebook" width={20} height={20} />
            Facebook
          </button>
        </div>

        <div className="text-center text-white text-sm mt-4">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-[#44291a] font-semibold hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}; 
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

export default function EmailVerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Lấy token từ pathname
        const pathname = window.location.pathname;
        const token = pathname.split("/verify-email/")[1];
        
        if (!token) {
          setStatus("error");
          setMessage("Token xác nhận không hợp lệ");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://moobeefsteak.online"}/api/verify-email/${token}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.status === true && data.data?.access_token && data.data?.user) {
          // Lưu token và user vào cookie
          Cookies.set("token", data.data.access_token);
          Cookies.set("user", JSON.stringify(data.data.user));
          setUser(data.data.user);
          
          setStatus("success");
          setMessage("Email đã được xác nhận thành công! Đang chuyển đến trang chủ...");
          
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Xác nhận email thất bại");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage("Xác nhận email thất bại");
      }
    };

    verifyEmail();
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Đang xác nhận email...
              </h2>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Xác nhận thành công!
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Xác nhận thất bại
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => router.push("/login")}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Đi đến trang đăng nhập
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
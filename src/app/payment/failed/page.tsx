"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const error = searchParams.get("error");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/dat-ban";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "07":
        return "Trừ tiền thành công. Giao dịch bị nghi ngờ gian lận.";
      case "09":
        return "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking.";
      case "13":
        return "Giao dịch không thành công do: Nhập sai mật khẩu xác thực giao dịch (OTP).";
      case "24":
        return "Khách hàng hủy giao dịch.";
      case "51":
        return "Giao dịch không thành công do: Tài khoản của khách hàng không đủ số dư để thực hiện giao dịch.";
      case "65":
        return "Giao dịch không thành công do: Tài khoản Khách hàng đã bị khóa.";
      case "75":
        return "Ngân hàng thanh toán đang bảo trì.";
      case "79":
        return "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.";
      case "99":
        return "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê).";
      default:
        return "Thanh toán không thành công. Vui lòng thử lại sau.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thanh toán thất bại!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đơn hàng #{orderId} của bạn chưa được thanh toán.
          </p>
          <p className="mt-2 text-sm text-red-600 font-medium">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Thông tin đơn hàng
            </h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-1">
              <div>
                <dt className="text-sm font-medium text-gray-500">Mã đơn hàng</dt>
                <dd className="mt-1 text-sm text-gray-900">#{orderId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                <dd className="mt-1 text-sm text-red-600 font-semibold">
                  Thanh toán thất bại
                </dd>
              </div>
              {error && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mã lỗi</dt>
                  <dd className="mt-1 text-sm text-gray-900">{error}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Tự động chuyển về trang đặt bàn sau {countdown} giây...
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dat-ban"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Thử lại
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { VoucherCard } from "./VoucherCard";
import Cookies from "js-cookie";

interface Voucher {
  id: number;
  name: string;
  start_date: string;
  end_date?: string;
  logo_url?: string;
  code?: string; // Thêm trường code nếu cần
  status: number; // 0. Chưa kích hoạt 1. Chưa sử dụng = Đang hoạt động, 2. Đã sử dụng = Hết hạn, 3. Hết hạn = Hết hạn
}

export const VoucherGrid: React.FC = () => {
  const [user, setUser] = useState({ id: "" });
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
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

  const userId = user.id;

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await apiClient.get(`/users/vouchers/${userId}/user`);
        const voucherData = response.data || response.data;
        setVouchers(voucherData);
        console.log("Vouchers fetched:", voucherData);
        const mapped = Array.isArray(voucherData)
          ? voucherData.map((item: any) => ({
              id: item.voucher?.id,
              name: item.voucher?.name,
              start_date: item.voucher?.start_date,
              end_date: item.voucher?.end_date,
              logo_url: item.voucher?.logo_url,
              code: item.voucher?.code, // Thêm trường code nếu cần
              status: item.voucher?.status,
            }))
          : [];
        setVouchers(mapped);
        console.log("Vouchers mapped:", mapped);
      } catch (error) {
        console.error("Failed to fetch user vouchers:", error);
      }
    };

    if (userId) fetchVouchers();
  }, [userId]);

  // ✅ Hàm xác định trạng thái sử dụng của voucher
  const getVoucherStatus = (voucher: Voucher): string => {
    const now = new Date();
    const startDate = new Date(voucher.start_date);
    const endDate = new Date(voucher.end_date || voucher.start_date);

    // Ưu tiên trạng thái từ DB nếu là đã sử dụng
    if (voucher.status === 2) {
      return "Đã sử dụng";
    }

    // Nếu đã hết hạn
    if (now > endDate || voucher.status === 4) return "Đã hết hạn";

    // Nếu chưa đến ngày bắt đầu
    if (now < startDate) {
      return "Chưa có hiệu lực";
    } else {
      // Nếu còn hiệu lực -> tính số ngày còn lại
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Còn ${diffDays} ngày`;
    }
  };

  return (
    <section className="w-full overflow-hidden rounded-xl bg-white p-10 max-md:max-w-full max-md:px-5">
      <div className="flex flex-wrap items-start justify-start gap-10">
        {vouchers.filter((voucher) => voucher.status !== 0).length === 0 ? (
          <div className="text-gray-500 text-lg w-full text-center py-10">Bạn chưa có voucher nào</div>
        ) : (
          vouchers
            .filter((voucher) => voucher.status !== 0)
            .map((voucher) => (
              <VoucherCard
                key={voucher.id}
                discount={voucher.name}
                code={voucher.code}
                duration={getVoucherStatus(voucher)}
                logoSrc={voucher.logo_url}
                status={voucher.status}
                start_date={voucher.start_date}
              />
            ))
        )}
      </div>
    </section>
  );
};

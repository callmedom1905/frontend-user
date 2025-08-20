"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import apiClient from "@/lib/apiClient";
import {
  OrderItem,
  UserVoucher,
  PaymentMethod,
  OrderData,
} from "@/types/booking";
import { getAvailableTimes, getBookingTimeError } from "@/utils/bookingUtils";

export const PaymentForm: React.FC = () => {
  // Lấy món ăn từ localStorage
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  // Tổng tiền
  const total = orderItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  // State cho voucher
  const [selectedVoucher, setSelectedVoucher] = useState<UserVoucher | null>(
    null,
  );
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  // Tính toán sau khi áp dụng voucher
  const subtotal = total;
  const finalTotal = Math.max(0, subtotal - voucherDiscount);
  // Tiền cọc (30% tổng tiền sau khi áp dụng voucher)
  const depositAmount = Math.round(finalTotal * 0.3);

  // State cho form
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "", // Thêm email
    table: "",
    guest: "",
    date: "",
    time: "",
    note: "",
    payment: "sepay",
    deposit_amount: 0, // Thêm tiền cọc
  });

  // State cho VNPay
  const [vnpayError, setVnpayError] = useState<string | null>(null);
  const [vnpayQRImageUrl, setVnpayQRImageUrl] = useState<string | undefined>(
    undefined,
  );
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrCreated, setQrCreated] = useState(false);

  // State cho phương thức thanh toán
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPayment, setLoadingPayment] = useState(true);

  // State cho SePay
  const [sepayQRCode, setSepayQRCode] = useState<string | null>(null);
  const [sepayPaymentUrl, setSepayPaymentUrl] = useState<string | null>(null);
  const [sepayLoading, setSepayLoading] = useState(false);
  const [sepayError, setSepayError] = useState<string | null>(null);
  const [showSepayQR, setShowSepayQR] = useState(false);
  const [isWaitingSePay, setIsWaitingSePay] = useState(false);
  const [canConfirmSePay, setCanConfirmSePay] = useState(false);
  const pollingRef = React.useRef<NodeJS.Timeout | null>(null);

  // Thêm state cho minDate và maxDate
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  // Thêm state cho loading và error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State cho popup
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  // Thêm state cho bước thanh toán
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  // State cho popup hỏi gửi hóa đơn
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const [invoiceEmail, setInvoiceEmail] = useState("");

  // State cho countdown timer (5 phút = 300 giây)
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  // Key cho localStorage để lưu thời gian bắt đầu countdown
  const COUNTDOWN_STORAGE_KEY = "order_countdown_start";
  const ORDER_ID_STORAGE_KEY = "pending_order_id";

  // Lấy dữ liệu user và cart khi load trang
  useEffect(() => {
    // Lấy cart từ localStorage
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      try {
        setOrderItems(JSON.parse(cartData));
      } catch {
        setOrderItems([]);
      }
    } else {
      setOrderItems([]);
    }

    // Gộp logic lấy user và bookingInfo
    const userCookie = Cookies.get("user");
    const bookingInfo = localStorage.getItem("bookingInfo");
    let name = "";
    let phone = "";
    let email = "";
    let table = "";
    let guest = "";
    let date = "";
    let time = "";
    let note = "";

    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        name = user.name || "";
        phone = user.phone || "";
        email = user.email || "";
      } catch {}
    }
    if (bookingInfo) {
      try {
        const info = JSON.parse(bookingInfo);
        if (!name) name = info.name || "";
        if (!phone) phone = info.phone || "";
        if (!email) email = info.email || "";
        if (info.tableIds && Array.isArray(info.tableIds)) {
          table = info.tableIds.join(",");
        } else {
          table = info.tableId ? String(info.tableId) : "";
        }
        guest = info.guestCount ? String(info.guestCount) : "";
        date = info.date || "";
        time = info.time || "";
        note = info.note || "";
        // Khôi phục voucher đã chọn từ bookingInfo
        if (info.selectedVoucher) {
          setSelectedVoucher(info.selectedVoucher);
          setVoucherDiscount(info.selectedVoucher.discount || 0);
        }
      } catch {}
    }

    setForm((prev) => ({
      ...prev,
      name,
      phone,
      email,
      table,
      guest,
      date,
      time,
      note,
      deposit_amount: depositAmount,
    }));

    // Lấy phương thức thanh toán từ API
    const fetchPaymentMethods = async () => {
      setLoadingPayment(true);
      try {
        const res = await apiClient.get("/users/payment-method");
        setPaymentMethods(
          Array.isArray(res.data) ? res.data : res.data?.data || [],
        );
      } catch {
        setPaymentMethods([]);
      } finally {
        setLoadingPayment(false);
      }
    };
    fetchPaymentMethods();

    // Lấy voucher của user nếu đã đăng nhập
    const fetchUserVouchers = async () => {
      if (!userCookie) return;

      setLoadingVouchers(true);
      try {
        const user = JSON.parse(userCookie);
        const userId = user.id || user.user_id;

        if (userId) {
          const response = await apiClient.get(`/users/vouchers/${userId}`);
          const vouchers = response.data?.data || response.data || [];
          // Lọc voucher hợp lệ (có status = 1 và chưa hết hạn)
          const validVouchers = vouchers.filter((voucher: UserVoucher) => {
            const voucherData = voucher.voucher || voucher;
            const now = new Date();
            const startDate = new Date(voucherData.start_date || "");
            const endDate = new Date(voucherData.end_date || "");
            return (
              voucherData.status === 1 && startDate <= now && endDate >= now
            );
          });
          setUserVouchers(validVouchers);
        }
      } catch (error) {
        console.error("Lỗi khi lấy voucher của user:", error);
        setUserVouchers([]);
      } finally {
        setLoadingVouchers(false);
      }
    };
    fetchUserVouchers();

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    let minDateValue = today;
    if (now.getHours() >= 21) {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      minDateValue = tomorrow.toISOString().split("T")[0];
    }
    setMinDate(minDateValue);
    const maxDateObj = new Date(minDateValue);
    maxDateObj.setMonth(maxDateObj.getMonth() + 1);
    setMaxDate(maxDateObj.toISOString().split("T")[0]);

    console.log(orderItems);

    // Khôi phục countdown nếu có order đang chờ thanh toán
    const savedCountdownStart = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
    const savedOrderId = localStorage.getItem(ORDER_ID_STORAGE_KEY);

    if (savedCountdownStart && savedOrderId) {
      const startTime = parseInt(savedCountdownStart);
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000); // số giây đã trôi qua
      const remaining = 300 - elapsed; // 300 giây = 5 phút

      if (remaining > 0) {
        // Còn thời gian, khôi phục countdown
        setCreatedOrderId(parseInt(savedOrderId));
        setIsPaymentStep(true);
        setTimeLeft(remaining);

        if (remaining <= 60) {
          setShowTimeoutWarning(true);
        }
      } else {
        // Đã hết thời gian, xóa order
        handleOrderTimeoutFromStorage(parseInt(savedOrderId));
      }
    }
  }, []);

  // Hàm tính discount từ voucher
  const calculateVoucherDiscount = (
    voucher: UserVoucher,
    totalAmount: number,
  ) => {
    const voucherData = voucher.voucher || voucher;
    if (!voucherData || totalAmount < (voucherData.min_price || 0)) {
      return 0;
    }

    if (voucherData.discount_type === 1) {
      // Giảm theo phần trăm
      return Math.round(
        (totalAmount * (voucherData.discount_value || 0)) / 100,
      );
    } else if (voucherData.discount_type === 2) {
      // Giảm theo số tiền cố định
      return Math.min(voucherData.discount_value || 0, totalAmount);
    }
    return 0;
  };

  // Hàm chọn voucher
  const handleSelectVoucher = (voucher: UserVoucher) => {
    setSelectedVoucher(voucher);
    const discount = calculateVoucherDiscount(voucher, total);
    setVoucherDiscount(discount);
  };

  // Hàm bỏ chọn voucher
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setVoucherDiscount(0);
  };

  // Cập nhật voucher discount khi total thay đổi
  useEffect(() => {
    if (selectedVoucher) {
      const discount = calculateVoucherDiscount(selectedVoucher, total);
      setVoucherDiscount(discount);
    }
  }, [total, selectedVoucher]);

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Reset QR state khi thay đổi payment method
    if (e.target.name === "payment") {
      setQrCreated(false);
      setVnpayQRImageUrl(undefined);
      setShowQRCode(false);
      setQrLoading(false);
      setVnpayError(null);

      // Reset SePay state
      setSepayQRCode(null);
      setSepayPaymentUrl(null);
      setShowSepayQR(false);
      setSepayLoading(false);
      setSepayError(null);
    }
  };

  // Hàm gửi email xác nhận
  const sendConfirmationEmail = async (orderData: OrderData) => {
    try {
      await apiClient.post("/users/send-confirmation-email", {
        email: orderData.customerEmail || form.email,
        orderData: {
          ...orderData,
          items: orderItems,
          total: finalTotal,
          originalTotal: total,
          voucherDiscount: voucherDiscount,
          selectedVoucher: selectedVoucher,
          customerName: form.name,
          customerPhone: form.phone,
          bookingDate: `${form.date} ${form.time}:00`,
        },
      });
    } catch (error) {
      console.error("Lỗi gửi email:", error);
      // Không throw error vì không ảnh hưởng đến việc đặt bàn
    }
  };

  // Xử lý submit (bước 1: tạo order status=0, chưa gửi order-items)
  const handleGoToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate món ăn
    if (orderItems.length === 0) {
      setError("Bạn chưa chọn món ăn nào!");
      return;
    }

    // Validate thời gian sử dụng utility function chung
    const timeError = getBookingTimeError(form.date, form.time);
    if (timeError) {
      setError(timeError);
      return;
    }

    setLoading(true);
    try {
      // Lấy thông tin bàn từ bookingInfo
      const bookingInfo = localStorage.getItem("bookingInfo");
      let tableIds: number[] = [];
      if (bookingInfo) {
        try {
          const info = JSON.parse(bookingInfo);
          if (info.tableIds && Array.isArray(info.tableIds)) {
            tableIds = info.tableIds;
          } else if (info.tableId) {
            tableIds = [info.tableId];
          }
        } catch {}
      }

      if (tableIds.length === 0) {
        throw new Error("Không có bàn nào được chọn!");
      }

      // Kiểm tra tính khả dụng của bàn trước khi tạo order
      try {
        const availabilityCheck = await apiClient.post(
          "/users/check-table-availability",
          {
            table_ids: tableIds,
            date: `${form.date} ${form.time}:00`,
          },
        );

        if (!availabilityCheck.data?.all_available) {
          const conflictedTables =
            availabilityCheck.data?.conflicted_tables || [];
          const tableNumbers = conflictedTables
            .map((t: unknown) => (t as { table_id: string }).table_id)
            .join(", ");
          throw new Error(
            `Bàn ${tableNumbers} đã được đặt vào thời điểm này. Vui lòng chọn bàn khác hoặc thời gian khác!`,
          );
        }
      } catch (availabilityError: unknown) {
        const error = availabilityError as {
          response?: { status?: number; data?: { message?: string } };
          message?: string;
        };
        if (error?.response?.status === 409) {
          setError(
            error?.response?.data?.message || "Bàn đã được đặt bởi người khác!",
          );
        } else {
          setError(
            error?.response?.data?.message ||
              error.message ||
              "Có lỗi khi kiểm tra tính khả dụng của bàn!",
          );
        }
        setLoading(false);
        return;
      }

      // Lấy user từ cookie
      const userCookie = Cookies.get("user");
      let user = null;
      if (userCookie) {
        user = JSON.parse(userCookie);
      }

      let orderId;
      // Chỉ gọi 1 API duy nhất tùy theo số lượng bàn
      if (tableIds.length > 1) {
        // Nếu là ghép bàn, chỉ gọi API này
        const orderRes = await apiClient.post("/users/orders-multi-table", {
          table_ids: tableIds,
          id_user: user?.id ? Number(user.id) : null,
          id_payment: null, // Chưa chọn payment
          id_voucher: selectedVoucher?.id ? Number(selectedVoucher.id) : null,
          voucher_code: selectedVoucher?.code || null,
          voucher_discount_amount: voucherDiscount
            ? Number(voucherDiscount)
            : null,
          original_total_payment: total ? Number(total) : null,
          name_user: form.name,
          phone: form.phone || null,
          email: form.email || null, // Thêm email
          date: `${form.date} ${form.time}:00`,
          number_table: tableIds.length,
          capacity: Number(form.guest),
          total_payment: Number(finalTotal),
          deposit_amount: Number(depositAmount), // Thêm tiền cọc
          status: 0, // Chưa đặt bàn
        });
        orderId = orderRes.data?.data?.id || orderRes.data?.id;
      } else if (tableIds.length === 1) {
        // Chỉ 1 bàn, gọi API cũ
        const orderRes = await apiClient.post("/users/orders", {
          id_table: tableIds[0],
          id_user: user?.id ? Number(user.id) : null,
          id_payment: null, // Chưa chọn payment
          id_voucher: selectedVoucher?.id ? Number(selectedVoucher.id) : null,
          voucher_code: selectedVoucher?.code || null,
          voucher_discount_amount: voucherDiscount
            ? Number(voucherDiscount)
            : null,
          original_total_payment: total ? Number(total) : null,
          name_user: form.name,
          phone: form.phone || null,
          email: form.email || null, // Thêm email
          date: `${form.date} ${form.time}:00`,
          number_table: tableIds.length,
          capacity: Number(form.guest),
          total_payment: Number(finalTotal),
          deposit_amount: Number(depositAmount), // Thêm tiền cọc
          status: 0, // Chưa đặt bàn
        });
        orderId = orderRes.data?.id;
      } else {
        throw new Error("Không có bàn nào được chọn!");
      }
      if (!orderId) throw new Error("Không lấy được ID đơn hàng!");
      setCreatedOrderId(orderId);
      setIsPaymentStep(true);

      // Bắt đầu countdown 5 phút (300 giây)
      setTimeLeft(300);
      setShowTimeoutWarning(false);

      // Lưu thời gian bắt đầu và order ID vào localStorage
      const startTime = Date.now();
      localStorage.setItem(COUNTDOWN_STORAGE_KEY, startTime.toString());
      localStorage.setItem(ORDER_ID_STORAGE_KEY, orderId.toString());
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message || error.message || "Có lỗi xảy ra!",
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nút hủy (cải thiện logic)
  const handleCancel = () => {
    if (isPaymentStep && createdOrderId) {
      // Nếu đang ở bước thanh toán và đã tạo order, hiển thị popup xác nhận
      setShowConfirmPopup(true);
    } else {
      // Nếu chưa tạo order, hủy ngay
      confirmCancel();
    }
  };

  // Xử lý xác nhận hủy
  const confirmCancel = async () => {
    setShowConfirmPopup(false);
    setLoading(true);

    try {
      // Nếu đã tạo order, xóa order vì bàn chưa được đặt
      if (createdOrderId) {
        try {
          await apiClient.delete(`/users/orders/${createdOrderId}`);
        } catch (deleteError) {
          // Nếu không xóa được, chỉ cập nhật status = 4
          await apiClient.put(`/users/orders/${createdOrderId}`, { status: 4 });
        }
      }

      // Xóa cart và bookingInfo từ localStorage
      localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
      localStorage.removeItem(ORDER_ID_STORAGE_KEY);
      localStorage.removeItem("cart");
      localStorage.removeItem("bookingInfo");
      setOrderItems([]);
      setCreatedOrderId(null);
      setIsPaymentStep(false);

      // Dừng countdown
      setTimeLeft(null);
      setShowTimeoutWarning(false);

      setShowCancelPopup(true);

      // Tự động chuyển trang sau 2 giây
      setTimeout(() => {
        window.location.href = "/dat-ban";
      }, 2000);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Có lỗi khi hủy đặt bàn!",
      );
    } finally {
      setLoading(false);
    }
  };

  // Tạo giao dịch VNPay

  // Tạo QR Code VNPay
  const createVNPayQRCode = async () => {
    setQrLoading(true);
    setVnpayError(null);
    setShowQRCode(false);

    try {
      const response = await apiClient.post("/users/payment/vnpay/qr", {
        order_id: createdOrderId,
        amount: depositAmount,
        order_info: `Thanh toan don hang #${createdOrderId}`,
      });

      console.log("VNPay QR Response:", response.data);

      // Kiểm tra response structure - có thể là direct data hoặc wrapped
      const responseData = response.data;
      let qrImageUrl = null;

      if (responseData.success && responseData.data?.qr_image_url) {
        // Wrapped response: {success: true, data: {qr_image_url: "..."}}
        qrImageUrl = responseData.data.qr_image_url;
      } else if (responseData.qr_image_url) {
        // Direct response: {qr_image_url: "..."}
        qrImageUrl = responseData.qr_image_url;
      }

      if (qrImageUrl) {
        console.log("Setting QR Image URL:", qrImageUrl);
        setVnpayQRImageUrl(qrImageUrl);
        setShowQRCode(true);
        setQrCreated(true);
        console.log(
          "QR Code state updated - showQRCode:",
          true,
          "vnpayQRImageUrl:",
          qrImageUrl,
        );
      } else {
        console.error("QR Image URL not found in response:", responseData);
        setVnpayError("Không thể tạo QR Code VNPay - thiếu QR image URL");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      console.error("VNPay QR Code error:", error);
      setVnpayError(
        error.response?.data?.message ||
          error.message ||
          "Lỗi tạo QR Code VNPay",
      );

      // Fallback: Tạo QR code URL từ dữ liệu có sẵn
      if (createdOrderId && finalTotal) {
        const fallbackQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=2&data=VNPay_Order_${createdOrderId}_${depositAmount}`;
        console.log("Using fallback QR URL:", fallbackQRUrl);
        setVnpayQRImageUrl(fallbackQRUrl);
        setShowQRCode(true);
      }
    } finally {
      setQrLoading(false);
    }
  };

  // Polling order status để bắt webhook SePay (theo cách admin)
  const startPollingOrderStatus = (orderId: number) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        // Try different endpoint patterns - prioritize the working one
        let res;
        try {
          // Try without users prefix first (likely working based on no more 404s)
          res = await apiClient.get(`/orders/${orderId}`);
        } catch (err) {
          try {
            // Fallback to users pattern
            res = await apiClient.get(`/users/orders/${orderId}`);
          } catch (err2) {
            try {
              // Final fallback to admin pattern
              res = await apiClient.get(`/admin/orders/${orderId}`);
            } catch (err3) {
              console.warn(
                "All polling endpoints failed - SePay webhook may update status directly",
              );
              return; // Exit gracefully, webhook will handle status update
            }
          }
        }
        let status = undefined;
        if (res.data?.data?.status !== undefined) {
          status = res.data.data.status;
        } else if (res.data?.status !== undefined) {
          status = res.data.status;
        }

        console.log("Polling order status:", {
          orderId,
          status,
          response: res.data,
          fullResponse: res,
        });

        // Nếu status = 1 thì SePay đã nhận được thanh toán đặt cọc (user chỉ đặt cọc 30%)
        if (status === 1) {
          console.log("SePay deposit payment confirmed! Enabling button...");
          setCanConfirmSePay(true);
          setIsWaitingSePay(false);
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      } catch (err) {
        console.warn("Polling error:", err);
        // ignore polling errors but log for debugging
      }
    }, 3000);
  };

  // Tạo thanh toán SePay (theo cách admin)
  const createSePayPayment = async () => {
    setSepayLoading(true);
    setSepayError(null);
    setShowSepayQR(false);

    try {
      // Sử dụng cách tương tự admin: tạo QR code trực tiếp từ SePay service
      // Không cần gọi API backend
      const amount = depositAmount;
      const description = `Thanh Toan Ban So ${form.table}`;

      // Tạo QR code SePay trực tiếp như admin
      const sepayQRUrl = `https://qr.sepay.vn/img?acc=VQRQADFUC9149&bank=MBBank&amount=${amount}&des=${encodeURIComponent(description)}`;
      const sepayPaymentUrl = "https://my.sepay.vn/payment-link-demo";

      setSepayQRCode(sepayQRUrl);
      setSepayPaymentUrl(sepayPaymentUrl);
      setShowSepayQR(true);
      setSepayError(null);

      // Bắt đầu waiting mode và polling
      setIsWaitingSePay(true);
      setCanConfirmSePay(false);

      // Bắt đầu polling để bắt webhook SePay
      if (createdOrderId) {
        startPollingOrderStatus(createdOrderId);
      }

      console.log("SePay QR created successfully:", {
        qr_code: sepayQRUrl,
        payment_url: sepayPaymentUrl,
        order_id: createdOrderId,
        amount: amount,
        table: form.table,
        description: description,
      });
    } catch (error: unknown) {
      console.error("SePay Error:", error);
      setSepayError("Không tạo được QR code SePay");
    } finally {
      setSepayLoading(false);
    }
  };

  // Xử lý hoàn thành thanh toán (bước 2: cập nhật order status=1, gửi order-items)
  const handleCompletePayment = async () => {
    setError(null);
    setLoading(true);
    try {
      // Kiểm tra createdOrderId
      if (!createdOrderId) {
        setError("Không tìm thấy thông tin đơn hàng. Vui lòng thử lại!");
        setLoading(false);
        return;
      }

      // Ensure order ID is a valid number
      const orderId = Number(createdOrderId);
      if (isNaN(orderId) || orderId <= 0) {
        setError("ID đơn hàng không hợp lệ. Vui lòng thử lại!");
        setLoading(false);
        return;
      }

      // Lấy user từ cookie
      const userCookie = Cookies.get("user");
      let user = null;
      if (userCookie) {
        user = JSON.parse(userCookie);
      }

      // Gửi order-items
      const mappedOrderItems = orderItems.map((item) => ({
        ...item,
        id: item.id || item.productId,
      }));

      for (const item of mappedOrderItems) {
        // Validate required fields
        if (!item.id || !item.name || !item.price || !item.quantity) {
          setError("Dữ liệu món ăn không hợp lệ. Vui lòng thử lại!");
          setLoading(false);
          return;
        }

        // Ensure product ID is a valid number
        const productId = Number(item.id);
        if (isNaN(productId) || productId <= 0) {
          setError(`ID sản phẩm không hợp lệ cho món "${item.name}"`);
          setLoading(false);
          return;
        }

        // Ensure price is a valid positive number
        const price = Number(item.price);
        if (isNaN(price) || price < 0) {
          setError(`Giá không hợp lệ cho món "${item.name}"`);
          setLoading(false);
          return;
        }

        // Ensure quantity is a valid positive number
        const quantity = Number(item.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          setError(`Số lượng không hợp lệ cho món "${item.name}"`);
          setLoading(false);
          return;
        }
        const orderItemData = {
          id_order: orderId,
          id_product: productId,
          id_user: user?.id ? Number(user.id) : null,
          name: item.name,
          image: item.image,
          price: price,
          status: true,
          meta_description: item.meta_description || "",
          detail_description: item.detail_description || "",
          quantity_sold: quantity,
        };

        console.log("Sending order item data:", orderItemData);

        try {
          await apiClient.post("/users/order-items", orderItemData);
        } catch (itemError: unknown) {
          const error = itemError as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          console.error("Lỗi khi tạo order item:", error);
          setError(
            `Lỗi khi thêm món "${item.name}": ${error?.response?.data?.message || error.message || "Lỗi không xác định"}`,
          );
          setLoading(false);
          return;
        }
      }

      // Cập nhật order status=1 và id_payment
      const selectedPaymentMethod = paymentMethods.find(
        (m) => m.payment_method === form.payment,
      );
      const orderData = {
        status: 1,
        id_payment: selectedPaymentMethod?.id
          ? Number(selectedPaymentMethod.id)
          : null,
      };

      console.log("Updating order with data:", orderData);

      try {
        await apiClient.put(`/users/orders/${orderId}`, orderData);
      } catch (orderError: unknown) {
        const error = orderError as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        console.error("Lỗi khi cập nhật order:", error);
        setError(
          `Lỗi khi cập nhật đơn hàng: ${error?.response?.data?.message || error.message || "Lỗi không xác định"}`,
        );
        setLoading(false);
        return;
      }

      // Link bàn với order (chỉ khi hoàn thành thanh toán)
      try {
        // Lấy thông tin bàn từ bookingInfo
        const bookingInfo = localStorage.getItem("bookingInfo");
        let tableIds: number[] = [];
        if (bookingInfo) {
          try {
            const info = JSON.parse(bookingInfo);
            if (info.tableIds && Array.isArray(info.tableIds)) {
              tableIds = info.tableIds;
            } else if (info.tableId) {
              tableIds = [info.tableId];
            }
          } catch {}
        }

        // Nếu là multi-table, cần link tables
        if (tableIds.length > 1) {
          await apiClient.post("/users/orders-multi-table-link", {
            order_id: orderId,
            table_ids: tableIds,
          });
        } else {
          // Single table, sử dụng API link-tables
          await apiClient.post(`/users/orders/${orderId}/link-tables`);
        }
      } catch (linkError: unknown) {
        const error = linkError as {
          response?: { status?: number; data?: { message?: string } };
          message?: string;
        };
        // Nếu bàn đã bị đặt bởi người khác, thông báo lỗi
        if (error?.response?.status === 409) {
          setError(
            "Bàn này đã được đặt bởi người khác. Vui lòng chọn bàn khác hoặc thời gian khác!",
          );
          return;
        }
        console.error("Lỗi link bàn:", error);
      }

      // Gửi email xác nhận nếu có email
      if (form.email) {
        await sendConfirmationEmail({
          orderId: orderId,
          ...orderData,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          bookingDate: `${form.date} ${form.time}:00`,
          tableIds: form.table,
          guestCount: form.guest,
          note: form.note,
        });

        // Xóa cart, thông báo thành công, reset form
        localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
        localStorage.removeItem(ORDER_ID_STORAGE_KEY);
        localStorage.removeItem("cart");
        localStorage.removeItem("bookingInfo");
        setOrderItems([]);
        setForm({
          name: user?.name || "",
          phone: user?.phone || "",
          email: user?.email || "",
          table: "",
          guest: "",
          date: "",
          time: "",
          note: "",
          payment: "",
          deposit_amount: 0,
        });
        setIsPaymentStep(false);
        setCreatedOrderId(null);

        // Dừng countdown và xóa thông tin localStorage
        setTimeLeft(null);
        setShowTimeoutWarning(false);
        localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
        localStorage.removeItem(ORDER_ID_STORAGE_KEY);

        setShowSuccessPopup(true);
      } else {
        // Nếu không có email, hiển thị popup hỏi có muốn gửi hóa đơn không
        setShowInvoicePopup(true);
        return; // Dừng ở đây để chờ người dùng quyết định
      }
    } catch (err: unknown) {
      const error = err as {
        response?: {
          status?: number;
          data?: {
            conflict_details?: { table_id: string; date: string };
            message?: string;
          };
        };
        message?: string;
      };
      if (error?.response?.status === 409) {
        const conflictDetails = error?.response?.data?.conflict_details;
        let errorMessage =
          "Bàn này đã được đặt bởi người khác. Vui lòng chọn bàn khác hoặc thời gian khác!";

        if (conflictDetails) {
          errorMessage = `Bàn ${conflictDetails.table_id} đã được đặt vào ${conflictDetails.date} bởi đơn hàng khác. Vui lòng chọn bàn khác hoặc thời gian khác!`;
        }

        setError(errorMessage);
        setIsPaymentStep(false);
        setCreatedOrderId(null);
        localStorage.removeItem("bookingInfo");
      } else {
        setError(
          error?.response?.data?.message || error.message || "Có lỗi xảy ra!",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý quay lại ở bước thanh toán
  const handleBackFromPayment = async () => {
    if (!createdOrderId) {
      setIsPaymentStep(false);
      return;
    }
    setLoading(true);
    try {
      // Xóa order vì bàn chưa được đặt
      try {
        await apiClient.delete(`/users/orders/${createdOrderId}`);
      } catch (deleteError) {
        // Nếu không xóa được, chỉ cập nhật status = 4
        await apiClient.put(`/users/orders/${createdOrderId}`, { status: 4 });
      }
      setIsPaymentStep(false);
      setCreatedOrderId(null);

      // Dừng countdown
      setTimeLeft(null);
      setShowTimeoutWarning(false);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Có lỗi khi hủy thanh toán!",
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gửi hóa đơn với email mới
  const handleSendInvoice = async () => {
    if (!invoiceEmail.trim()) {
      setError("Vui lòng nhập email để gửi hóa đơn!");
      return;
    }

    setLoading(true);
    try {
      // Gửi email xác nhận với email mới
      await sendConfirmationEmail({
        orderId: createdOrderId,
        status: 1,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: invoiceEmail,
        bookingDate: `${form.date} ${form.time}:00`,
        tableIds: form.table,
        guestCount: form.guest,
        note: form.note,
        depositAmount: depositAmount,
      });

      // Đóng popup và hoàn thành
      setShowInvoicePopup(false);
      setInvoiceEmail("");

      // Xóa cart, thông báo thành công, reset form
      localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
      localStorage.removeItem(ORDER_ID_STORAGE_KEY);
      localStorage.removeItem("cart");
      localStorage.removeItem("bookingInfo");
      setOrderItems([]);
      setForm({
        name: "",
        phone: "",
        email: "",
        table: "",
        guest: "",
        date: "",
        time: "",
        note: "",
        payment: "sepay",
        deposit_amount: 0,
      });
      setIsPaymentStep(false);
      setCreatedOrderId(null);

      // Dừng countdown
      setTimeLeft(null);
      setShowTimeoutWarning(false);

      setShowSuccessPopup(true);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Có lỗi khi gửi hóa đơn!",
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý không gửi hóa đơn
  const handleSkipInvoice = () => {
    setShowInvoicePopup(false);
    setInvoiceEmail("");

    // Xóa cart, thông báo thành công, reset form
    localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
    localStorage.removeItem(ORDER_ID_STORAGE_KEY);
    localStorage.removeItem("cart");
    localStorage.removeItem("bookingInfo");
    setOrderItems([]);
    setForm({
      name: "",
      phone: "",
      email: "",
      table: "",
      guest: "",
      date: "",
      time: "",
      note: "",
      payment: "sepay",
      deposit_amount: 0,
    });
    setIsPaymentStep(false);
    setCreatedOrderId(null);

    // Dừng countdown
    setTimeLeft(null);
    setShowTimeoutWarning(false);

    setShowSuccessPopup(true);
  };

  // Xử lý khi order hết thời gian (5 phút)
  const handleOrderTimeout = async () => {
    if (!createdOrderId) return;
    await handleOrderTimeoutFromStorage(createdOrderId);
  };

  // Xử lý timeout cho order từ localStorage
  const handleOrderTimeoutFromStorage = async (orderId: number) => {
    setLoading(true);
    try {
      // Xóa order vì đã hết thời gian
      try {
        await apiClient.delete(`/users/orders/${orderId}`);
      } catch (deleteError) {
        // Nếu không xóa được, chỉ cập nhật status = 4
        await apiClient.put(`/users/orders/${orderId}`, { status: 4 });
      }

      // Xóa tất cả thông tin liên quan trong localStorage
      localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
      localStorage.removeItem(ORDER_ID_STORAGE_KEY);
      localStorage.removeItem("cart");
      localStorage.removeItem("bookingInfo");

      // Reset states
      setTimeLeft(null);
      setShowTimeoutWarning(false);
      setCreatedOrderId(null);
      setIsPaymentStep(false);
      setOrderItems([]);

      // Reset form
      setForm({
        name: "",
        phone: "",
        email: "",
        table: "",
        guest: "",
        date: "",
        time: "",
        note: "",
        payment: "sepay",
        deposit_amount: 0,
      });

      // Hiển thị thông báo hết thời gian
      setError(
        "Đơn hàng đã hết thời gian thanh toán (5 phút). Vui lòng đặt bàn lại!",
      );

      // Tự động chuyển về trang đặt bàn sau 3 giây
      setTimeout(() => {
        window.location.href = "/dat-ban";
      }, 3000);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      console.error("Lỗi khi xử lý timeout:", error);
      setError("Có lỗi xảy ra khi xử lý hết thời gian. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Tự động ẩn thông báo thành công sau 3 giây
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
        window.location.href = "/";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  // Tự động ẩn thông báo hủy sau 3 giây
  useEffect(() => {
    if (showCancelPopup) {
      const timer = setTimeout(() => {
        setShowCancelPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCancelPopup]);

  // Tự động tạo QR code khi chọn VNPay và đã có order (chỉ tạo 1 lần)
  useEffect(() => {
    if (
      form.payment === "VNPay" &&
      createdOrderId &&
      !qrCreated &&
      !qrLoading
    ) {
      console.log("Auto creating QR code for VNPay...");
      createVNPayQRCode();
    }
  }, [form.payment, createdOrderId, qrCreated, qrLoading]);

  // Tự động tạo SePay payment khi chọn SePay và đã có order
  useEffect(() => {
    if (
      form.payment === "sepay" &&
      createdOrderId &&
      !sepayQRCode &&
      !sepayLoading
    ) {
      console.log("Auto creating SePay payment...");
      createSePayPayment();
    }
  }, [form.payment, createdOrderId, sepayQRCode, sepayLoading]);

  // Cleanup polling interval khi component unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log(
      "State Debug - showQRCode:",
      showQRCode,
      "vnpayQRImageUrl:",
      vnpayQRImageUrl,
      "qrLoading:",
      qrLoading,
    );
  }, [showQRCode, vnpayQRImageUrl, qrLoading]);

  // Countdown timer cho order có status = 0
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPaymentStep && createdOrderId && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        // Kiểm tra lại thời gian từ localStorage để đảm bảo tính chính xác
        const savedCountdownStart = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
        if (savedCountdownStart) {
          const startTime = parseInt(savedCountdownStart);
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);
          const remaining = 300 - elapsed;

          if (remaining <= 0) {
            // Hết thời gian, tự động xóa order
            handleOrderTimeout();
            return;
          }

          setTimeLeft(remaining);

          // Hiển thị cảnh báo khi còn 1 phút
          if (remaining <= 60 && !showTimeoutWarning) {
            setShowTimeoutWarning(true);
          }
        } else {
          // Không có thông tin countdown trong localStorage, dừng timer
          setTimeLeft(null);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaymentStep, createdOrderId, timeLeft, showTimeoutWarning]);

  // Xử lý khi người dùng thoát khỏi trang
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Nếu đang có order chờ thanh toán, cảnh báo người dùng
      if (
        isPaymentStep &&
        createdOrderId &&
        timeLeft !== null &&
        timeLeft > 0
      ) {
        const message =
          "Bạn có đơn hàng đang chờ thanh toán. Nếu thoát, đơn hàng sẽ tự động hủy sau khi hết thời gian.";
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    const handleUnload = () => {
      // Không thể gọi API trong unload event, chỉ có thể dựa vào backend tự động xóa
      // Backend sẽ tự động xóa order status = 0 sau 5 phút
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [isPaymentStep, createdOrderId, timeLeft]);

  // Lắng nghe message từ popup window VNPay
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "VNPAY_PAYMENT_SUCCESS") {
        // Thanh toán VNPay thành công
        handleVNPaySuccess();
      } else if (event.data.type === "VNPAY_PAYMENT_FAILED") {
        setVnpayError(event.data.error || "Thanh toán thất bại");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Xử lý thanh toán VNPay thành công
  const handleVNPaySuccess = async () => {
    setLoading(true);
    try {
      // Kiểm tra createdOrderId
      if (!createdOrderId) {
        setError("Không tìm thấy thông tin đơn hàng. Vui lòng thử lại!");
        setLoading(false);
        return;
      }

      // Ensure order ID is a valid number
      const orderId = Number(createdOrderId);
      if (isNaN(orderId) || orderId <= 0) {
        setError("ID đơn hàng không hợp lệ. Vui lòng thử lại!");
        setLoading(false);
        return;
      }

      // Lấy user từ cookie
      const userCookie = Cookies.get("user");
      let user = null;
      if (userCookie) {
        user = JSON.parse(userCookie);
      }

      // Gửi order-items (tương tự như handleCompletePayment)
      const mappedOrderItems = orderItems.map((item) => ({
        ...item,
        id: item.id || item.productId,
      }));

      for (const item of mappedOrderItems) {
        // Validate required fields
        if (!item.id || !item.name || !item.price || !item.quantity) {
          setError("Dữ liệu món ăn không hợp lệ. Vui lòng thử lại!");
          setLoading(false);
          return;
        }

        // Ensure product ID is a valid number
        const productId = Number(item.id);
        if (isNaN(productId) || productId <= 0) {
          setError(`ID sản phẩm không hợp lệ cho món "${item.name}"`);
          setLoading(false);
          return;
        }

        // Ensure price is a valid positive number
        const price = Number(item.price);
        if (isNaN(price) || price < 0) {
          setError(`Giá không hợp lệ cho món "${item.name}"`);
          setLoading(false);
          return;
        }

        // Ensure quantity is a valid positive number
        const quantity = Number(item.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          setError(`Số lượng không hợp lệ cho món "${item.name}"`);
          setLoading(false);
          return;
        }

        const orderItemData = {
          id_order: orderId,
          id_product: productId,
          id_user: user?.id ? Number(user.id) : null,
          name: item.name,
          image: item.image,
          price: price,
          status: true,
          meta_description: item.meta_description || "",
          detail_description: item.detail_description || "",
          quantity_sold: quantity,
        };

        try {
          await apiClient.post("/users/order-items", orderItemData);
        } catch (itemError: unknown) {
          const error = itemError as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          console.error("Lỗi khi tạo order item:", error);
          setError(
            `Lỗi khi thêm món "${item.name}": ${error?.response?.data?.message || error.message || "Lỗi không xác định"}`,
          );
          setLoading(false);
          return;
        }
      }

      // Gọi API để cập nhật trạng thái đơn hàng
      await apiClient.put(`/users/orders/${orderId}`, {
        status: 1,
        payment_status: "completed",
      });

      // Link bàn với order (chỉ khi hoàn thành thanh toán)
      try {
        // Lấy thông tin bàn từ bookingInfo
        const bookingInfo = localStorage.getItem("bookingInfo");
        let tableIds: number[] = [];
        if (bookingInfo) {
          try {
            const info = JSON.parse(bookingInfo);
            if (info.tableIds && Array.isArray(info.tableIds)) {
              tableIds = info.tableIds;
            } else if (info.tableId) {
              tableIds = [info.tableId];
            }
          } catch {}
        }

        // Nếu là multi-table, cần link tables
        if (tableIds.length > 1) {
          await apiClient.post("/users/orders-multi-table-link", {
            order_id: orderId,
            table_ids: tableIds,
          });
        } else {
          // Single table, sử dụng API link-tables
          await apiClient.post(`/users/orders/${orderId}/link-tables`);
        }
      } catch (linkError: unknown) {
        const error = linkError as {
          response?: { status?: number; data?: { message?: string } };
          message?: string;
        };
        // Nếu bàn đã bị đặt bởi người khác, thông báo lỗi
        if (error?.response?.status === 409) {
          setError(
            "Bàn này đã được đặt bởi người khác. Vui lòng chọn bàn khác hoặc thời gian khác!",
          );
          return;
        }
        console.error("Lỗi link bàn:", error);
      }

      // Gửi email xác nhận nếu có email
      if (form.email) {
        await sendConfirmationEmail({
          orderId: orderId,
          status: 1,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          bookingDate: `${form.date} ${form.time}:00`,
          tableIds: form.table,
          guestCount: form.guest,
          note: form.note,
          depositAmount: depositAmount,
          total: finalTotal,
          originalTotal: total,
          voucherDiscount: voucherDiscount,
          selectedVoucher: selectedVoucher,
        });
      }

      // Xóa cart, thông báo thành công, reset form
      localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
      localStorage.removeItem(ORDER_ID_STORAGE_KEY);
      localStorage.removeItem("cart");
      localStorage.removeItem("bookingInfo");
      setOrderItems([]);
      setForm({
        name: "",
        phone: "",
        email: "",
        table: "",
        guest: "",
        date: "",
        time: "",
        note: "",
        payment: "sepay",
        deposit_amount: 0,
      });
      setIsPaymentStep(false);
      setCreatedOrderId(null);

      // Reset SePay state
      setSepayQRCode(null);
      setSepayPaymentUrl(null);
      setShowSepayQR(false);
      setSepayLoading(false);
      setSepayError(null);

      // Dừng countdown
      setTimeLeft(null);
      setShowTimeoutWarning(false);

      setShowSuccessPopup(true);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message || error.message || "Có lỗi xảy ra!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f8f8] px-4 py-6">
      <div className="flex w-full max-w-[1100px] flex-col overflow-hidden rounded-[8px] bg-white shadow lg:flex-row">
        {/* Cột trái: Món ăn */}
        <div className="flex w-full flex-col justify-between bg-[#44291a] p-4 lg:w-[35%] lg:p-8">
          <div>
            <h2 className="mb-4 text-xl font-bold text-white lg:text-2xl">
              Món ăn
            </h2>
            {orderItems.length === 0 ? (
              <div className="text-white">Không có món nào trong giỏ hàng.</div>
            ) : (
              orderItems.map((item, idx) => (
                <div key={idx} className="mb-6 flex last:mb-0 lg:mb-8">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="mr-3 h-[80px] w-[80px] flex-shrink-0 rounded-[8px] object-cover lg:mr-4 lg:h-[100px] lg:w-[100px]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 truncate text-base font-semibold text-white lg:text-lg">
                      {item.name}
                    </div>
                    <div className="mb-1 text-xs text-[#efd08a] lg:text-sm">
                      Đơn giá{" "}
                      <span className="float-right text-white">
                        {Number(item.price).toLocaleString()} đ
                      </span>
                    </div>
                    <div className="mb-1 text-xs text-[#efd08a] lg:text-sm">
                      Số lượng{" "}
                      <span className="float-right text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="text-xs text-[#efd08a] lg:text-sm">
                      Tổng{" "}
                      <span className="float-right text-white">
                        {(
                          Number(item.price) * Number(item.quantity)
                        ).toLocaleString()}{" "}
                        đ
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#efd08a] pt-4 lg:mt-8 lg:pt-6">
            <span className="text-lg font-bold text-white lg:text-xl">
              Tổng tiền
            </span>
            <span className="text-xl font-bold text-[#efd08a] lg:text-2xl">
              {total.toLocaleString()}
            </span>
          </div>

          {/* Hiển thị voucher discount nếu có */}
          {selectedVoucher && voucherDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-white lg:text-lg">
                Giảm giá voucher
              </span>
              <span className="text-lg font-bold text-green-400 lg:text-xl">
                -{voucherDiscount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Hiển thị tổng tiền sau khi áp dụng voucher */}
          {selectedVoucher && voucherDiscount > 0 && (
            <div className="flex items-center justify-between border-t border-[#efd08a] pt-2">
              <span className="text-lg font-bold text-white lg:text-xl">
                Tổng thanh toán
              </span>
              <span className="text-xl font-bold text-white lg:text-2xl">
                {finalTotal.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-white lg:text-lg">
              Tiền cọc (30%)
            </span>
            <span className="text-lg font-bold text-[#efd08a] lg:text-xl">
              {depositAmount.toLocaleString()}
            </span>
          </div>
        </div>
        {/* Cột phải: Form */}
        <form
          className="flex-1 bg-white p-4 lg:p-10"
          onSubmit={isPaymentStep ? undefined : handleGoToPayment}
        >
          {/* Thông tin của bạn */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#eab308]">
              Thông tin của bạn
            </h3>
            <div className="grid-cols mb-4 grid gap-x-6 gap-y-3 text-black">
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-gray-500" htmlFor="name">
                  Tên của bạn
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="rounded border border-gray-300 px-3 py-2 focus:outline-yellow-400"
                  placeholder="Nhập tên"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-gray-500" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="rounded border border-gray-300 px-3 py-2 focus:outline-yellow-400"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-gray-500" htmlFor="email">
                  Email (không bắt buộc)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="rounded border border-gray-300 px-3 py-2 focus:outline-yellow-400"
                  placeholder="Nhập email để nhận xác nhận đặt bàn"
                />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-3 text-black">
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-gray-500" htmlFor="guest">
                  Số lượng khách
                </label>
                <input
                  id="guest"
                  name="guest"
                  value={form.guest}
                  onChange={handleChange}
                  readOnly
                  className="rounded border border-gray-300 px-3 py-2 focus:outline-yellow-400"
                  placeholder="Nhập số lượng khách"
                  required
                />
              </div>
              <div className="flex flex-col text-black">
                <label className="mb-1 text-xs text-gray-500" htmlFor="table">
                  Vị trí bàn
                </label>
                <input
                  id="table"
                  name="table"
                  value={form.table}
                  onChange={handleChange}
                  readOnly
                  className="disabled rounded border border-gray-300 px-3 py-2 focus:outline-yellow-400"
                  placeholder="Nhập vị trí bàn"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-gray-500" htmlFor="date">
                  Ngày đặt
                </label>
                <input
                  id="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="rounded border border-gray-300  px-3 py-2 text-gray-500 focus:outline-yellow-400"
                  placeholder="Chọn ngày"
                  readOnly
                  type="date"
                  required
                  min={minDate}
                  max={maxDate}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-gray-500" htmlFor="time">
                  Thời gian
                </label>
                <select
                  id="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="rounded border border-gray-300 px-3 py-2 text-gray-500 focus:outline-yellow-400"
                  required
                  disabled={getAvailableTimes(form.date).length === 0}
                >
                  <option value="" disabled>
                    Chọn thời gian
                  </option>
                  {getAvailableTimes(form.date).map((h) => (
                    <option
                      key={h}
                      value={h.toString().padStart(2, "0") + ":00"}
                    >
                      {h.toString().padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
                {form.date && getAvailableTimes(form.date).length === 0 && (
                  <span className="mt-1 text-xs text-red-500">
                    Đã quá thời gian đặt bàn cho hôm nay, vui lòng chọn ngày
                    khác!
                  </span>
                )}
              </div>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="mb-1 text-xs text-black" htmlFor="note">
                Ghi chú
              </label>
              <input
                id="note"
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:outline-yellow-400"
                placeholder="Nhập ghi chú (nếu có)"
              />
            </div>

            {/* Hiển thị voucher của user nếu có */}
            {Cookies.get("user") && (
              <div className="mb-4">
                <label className="mb-2 block text-xs text-black">
                  Voucher của bạn
                </label>
                {loadingVouchers ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600"></span>
                      <span className="text-sm text-gray-600">
                        Đang tải voucher...
                      </span>
                    </div>
                  </div>
                ) : userVouchers.length > 0 ? (
                  <div className="space-y-2">
                    {userVouchers.map((voucher, index) => {
                      const voucherData = voucher.voucher || voucher;
                      const discountText =
                        voucherData.discount_type === 1
                          ? `-${voucherData.discount_value || 0}%`
                          : `-${(voucherData.discount_value || 0).toLocaleString()}đ`;
                      const isSelected = selectedVoucher?.id === voucher.id;
                      const canUse = total >= (voucherData.min_price || 0);

                      return (
                        <div
                          key={index}
                          className={`rounded border p-3 transition-colors ${
                            isSelected
                              ? "border-green-200 bg-green-50"
                              : canUse
                                ? "border-gray-200 bg-white hover:bg-gray-50"
                                : "border-gray-200 bg-gray-50 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="text-sm font-semibold text-blue-900">
                                  {voucherData.code}
                                </span>
                                <span className="text-sm font-medium text-blue-700">
                                  {discountText}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                <div>
                                  Đơn hàng tối thiểu:{" "}
                                  {(
                                    voucherData.min_price || 0
                                  ).toLocaleString()}
                                  đ
                                </div>
                                <div>
                                  Hạn sử dụng:{" "}
                                  {new Date(
                                    voucherData.end_date || "",
                                  ).toLocaleDateString("vi-VN")}
                                </div>
                              </div>
                            </div>
                            {isSelected ? (
                              <button
                                type="button"
                                onClick={handleRemoveVoucher}
                                className="rounded bg-red-600 px-3 py-1 text-xs text-white transition-colors hover:bg-red-700"
                              >
                                Bỏ chọn
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectVoucher(voucher)}
                                disabled={!canUse}
                                className={`rounded px-3 py-1 text-xs transition-colors ${
                                  canUse
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "cursor-not-allowed bg-gray-400 text-gray-600"
                                }`}
                              >
                                {canUse ? "Sử dụng" : "Chưa đủ điều kiện"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 17.93V20h-2v-.07A8.001 8.001 0 014.07 13H4v-2h.07A8.001 8.001 0 0111 4.07V4h2v.07A8.001 8.001 0 0119.93 11H20v2h-.07A8.001 8.001 0 0113 19.93z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        Bạn chưa có voucher nào
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hiển thị voucher đã chọn */}
            {selectedVoucher && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-green-800">
                        Voucher đã chọn:{" "}
                        <span className="font-bold">
                          {selectedVoucher.voucher?.code ||
                            selectedVoucher.code}
                        </span>
                      </span>
                      {voucherDiscount > 0 && (
                        <div className="text-xs text-green-700">
                          Giảm giá: {voucherDiscount.toLocaleString()}đ
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Phương thức thanh toán */}
          <div className="mb-6">
            {/* Ẩn phương thức thanh toán và QR code ở đây, chỉ hiện khi isPaymentStep */}
            {!isPaymentStep && (
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  className="flex-1 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                  disabled={loading}
                  onClick={handleCancel}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded bg-[#eab308] px-4 py-2 font-bold text-white hover:bg-yellow-500"
                  disabled={loading}
                >
                  {loading ? "Đang đặt bàn..." : "Đi đến thanh toán"}
                </button>
              </div>
            )}
            {isPaymentStep && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#eab308]">
                    Phương thức thanh toán
                  </h3>
                  {timeLeft !== null && timeLeft > 0 && (
                    <div
                      className={`text-sm font-medium ${timeLeft <= 60 ? "text-red-600" : "text-gray-600"}`}
                    >
                      Thời gian còn lại: {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </div>
                  )}
                </div>

                {/* Cảnh báo khi còn 1 phút */}
                {showTimeoutWarning &&
                  timeLeft !== null &&
                  timeLeft > 0 &&
                  timeLeft <= 60 && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-5 w-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-red-800">
                            Cảnh báo!
                          </div>
                          <div className="text-sm text-red-700">
                            Đơn hàng sẽ tự động hủy sau {timeLeft} giây nữa. Vui
                            lòng hoàn thành thanh toán!
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                <div className="mb-3 flex items-center gap-6 text-gray-500">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/sepay.svg"
                    alt="sepay"
                    className=" h-8 w-8 text-gray-500"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                    alt="Mastercard"
                    className="h-8 w-8"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    alt="GPay"
                    className="h-8 w-8"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/8a/VNPay_logo.svg"
                    alt="VNPay"
                    className="h-8 w-8"
                  />
                </div>
                <select
                  name="payment"
                  value={form.payment}
                  onChange={handleChange}
                  className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-gray-500 focus:outline-yellow-400"
                  required
                >
                  {loadingPayment ? (
                    <option>Đang tải...</option>
                  ) : paymentMethods.length === 0 ? (
                    <option>Không có phương thức thanh toán</option>
                  ) : (
                    paymentMethods
                      .filter((method: PaymentMethod) => method.id !== 1)
                      .map((method: PaymentMethod) => (
                        <option key={method.id} value={method.payment_method}>
                          {method.payment_method}
                        </option>
                      ))
                  )}
                </select>

                {/* Hiển thị giao diện thanh toán tùy theo phương thức */}
                {form.payment === "VNPay" ? (
                  /* QR code VNPay cho phương thức VNPay */
                  <div className="mb-6 text-center">
                    {qrLoading ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
                        <p className="text-gray-600">
                          Đang tạo QR Code VNPay...
                        </p>
                      </div>
                    ) : showQRCode && vnpayQRImageUrl ? (
                      <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                          <svg
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z"
                            />
                          </svg>
                        </div>
                        <h4 className="mb-2 text-lg font-semibold text-gray-900">
                          QR Code VNPay
                        </h4>
                        <p className="mb-4 text-gray-600">
                          Đơn hàng #{createdOrderId} -{" "}
                          {finalTotal.toLocaleString("vi-VN")} VNĐ
                        </p>

                        {/* QR Code Image */}
                        <div className="mb-4 flex justify-center">
                          <div className="rounded-lg border-2 border-green-200 bg-white p-4 shadow-lg">
                            <img
                              src={vnpayQRImageUrl}
                              alt="VNPay QR Code"
                              className="h-48 w-48"
                              onError={(e) => {
                                console.error("QR Image load error:", e);
                                const target =
                                  e.currentTarget as HTMLImageElement;
                                target.style.display = "none";
                                const nextElement =
                                  target.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = "block";
                                }
                              }}
                            />
                            <div
                              style={{ display: "none" }}
                              className="flex h-48 w-48 items-center justify-center bg-gray-100 text-sm text-red-500"
                            >
                              Không thể load QR code
                            </div>
                          </div>
                        </div>

                        {/* Hướng dẫn thanh toán */}
                        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                          <h5 className="mb-2 font-medium text-blue-900">
                            📱 Hướng dẫn thanh toán:
                          </h5>
                          <ol className="space-y-1 text-left text-sm text-blue-800">
                            <li>1. Mở ứng dụng VNPay trên điện thoại</li>
                            <li>2. Chọn tính năng &quot;Quét mã QR&quot;</li>
                            <li>3. Quét mã QR code bên trên</li>
                            <li>
                              4. Kiểm tra thông tin và xác nhận thanh toán
                            </li>
                            <li>5. Hoàn tất thanh toán trong ứng dụng</li>
                          </ol>
                        </div>

                        {/* Thông tin giao dịch */}
                        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <div className="text-sm text-gray-600">
                            <div className="mb-1 flex justify-between">
                              <span>Mã đơn hàng:</span>
                              <span className="font-medium">
                                #{createdOrderId}
                              </span>
                            </div>
                            <div className="mb-1 flex justify-between">
                              <span>Số tiền:</span>
                              <span className="font-medium text-green-600">
                                {finalTotal.toLocaleString("vi-VN")} VNĐ
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Thời gian:</span>
                              <span className="font-medium">
                                {new Date().toLocaleString("vi-VN")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setShowQRCode(false)}
                            className="flex items-center gap-2 rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                              />
                            </svg>
                            Quay lại
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
                        <p className="text-gray-600">
                          Đang tạo QR Code VNPay...
                        </p>
                      </div>
                    )}
                  </div>
                ) : form.payment === "sepay" ? (
                  /* QR code SePay */
                  <div className="mb-6 text-center">
                    {sepayLoading ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <p className="text-gray-600">
                          Đang tạo thanh toán SePay...
                        </p>
                      </div>
                    ) : showSepayQR && sepayQRCode ? (
                      <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                          <svg
                            className="h-8 w-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z"
                            />
                          </svg>
                        </div>
                        <h4 className="mb-2 text-lg font-semibold text-gray-900">
                          QR Code SePay
                        </h4>
                        <p className="mb-4 text-gray-600">
                          Đơn hàng #{createdOrderId} - Bàn số {form.table}
                        </p>
                        <p className="mb-4 text-gray-600">
                          Số tiền: {depositAmount.toLocaleString("vi-VN")} VNĐ
                        </p>

                        {/* QR Code Image - kích thước lớn hơn */}
                        <div className="mb-4 flex justify-center">
                          <div className="rounded-lg bg-white p-6 shadow-lg">
                            <img
                              src={sepayQRCode}
                              alt="SePay QR Code"
                              className="h-60 w-60"
                              onError={(e) => {
                                console.error("SePay QR Image load error:", e);
                                setSepayError("Lỗi hiển thị QR Code SePay");
                              }}
                            />
                          </div>
                        </div>

                        {/* Trạng thái chờ thanh toán */}
                        {isWaitingSePay && !canConfirmSePay && (
                          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent"></div>
                              <span className="text-sm font-medium text-yellow-800">
                                Đang chờ xác nhận thanh toán...
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-yellow-700">
                              Hệ thống sẽ tự động phát hiện khi bạn chuyển khoản
                              thành công
                            </p>
                          </div>
                        )}

                        {/* Xác nhận thanh toán thành công */}
                        {canConfirmSePay && (
                          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="flex items-center justify-center gap-2">
                              <svg
                                className="h-5 w-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-sm font-medium text-green-800">
                                Đã nhận được thanh toán!
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-green-700">
                              Bạn có thể nhấn nút &quot;Xác nhận đã thanh
                              toán&quot; để hoàn tất
                            </p>
                          </div>
                        )}
                      </div>
                    ) : sepayError ? (
                      <div className="py-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
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
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <p className="mb-2 font-semibold text-red-600">
                          Lỗi tạo thanh toán SePay
                        </p>
                        <p className="mb-4 text-gray-600">{sepayError}</p>
                        <button
                          onClick={createSePayPayment}
                          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                          disabled={sepayLoading}
                        >
                          {sepayLoading ? "Đang tạo..." : "Thử lại"}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <p className="text-gray-600">
                          Đang tạo thanh toán SePay...
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  form.payment !== "VNPay" &&
                  form.payment !== "sepay" && (
                    /* QR code cho các phương thức khác */
                    <div className="mb-6 flex justify-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=thanh-toan"
                        alt="QR code"
                        className="rounded bg-white p-4 shadow"
                      />
                    </div>
                  )
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    className="flex-1 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                    disabled={loading}
                    onClick={handleBackFromPayment}
                  >
                    Quay lại
                  </button>
                  {form.payment !== "VNPay" && (
                    <button
                      type="button"
                      className={`flex-1 rounded px-4 py-2 font-bold text-white transition-colors ${
                        form.payment === "sepay" && !canConfirmSePay
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-[#eab308] hover:bg-yellow-500"
                      }`}
                      disabled={
                        loading ||
                        !form.payment ||
                        (form.payment === "sepay" &&
                          (!showSepayQR || !canConfirmSePay))
                      }
                      onClick={handleCompletePayment}
                    >
                      {loading
                        ? "Đang thanh toán..."
                        : form.payment === "sepay"
                          ? canConfirmSePay
                            ? "Xác nhận đã thanh toán"
                            : "Chờ xác nhận thanh toán..."
                          : "Hoàn thành hóa đơn"}
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* Hiển thị error/loading */}
            {error && <div className="mb-3 text-red-500">{error}</div>}
            {loading && (
              <div className="mb-3 text-yellow-600">Đang xử lý đặt bàn...</div>
            )}
          </div>
          {/* Nút */}
          {/* Nút */}
        </form>
      </div>
      {/* Popup chọn phương thức thanh toán */}
      {/* Toast Notifications */}
      {showSuccessPopup && (
        <div
          className="fixed right-4 top-4 z-50"
          style={{
            animation: "slideInRight 0.5s ease-out",
            transform: "translateX(0)",
          }}
        >
          <div className="flex min-w-[300px] items-center rounded-[8px] bg-green-500 px-6 py-4 text-white shadow-lg">
            <div className="mr-3">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <div className="font-semibold">Thành công!</div>
              <div className="text-sm">Đặt bàn của bạn đã được xác nhận</div>
            </div>
          </div>
        </div>
      )}

      {showCancelPopup && (
        <div
          className="fixed right-4 top-4 z-50"
          style={{
            animation: "slideInRight 0.5s ease-out",
            transform: "translateX(0)",
          }}
        >
          <div className="flex min-w-[300px] items-center rounded-[8px] bg-blue-500 px-6 py-4 text-white shadow-lg">
            <div className="mr-3">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div className="font-semibold">Đã hủy!</div>
              <div className="text-sm">Đang chuyển về trang đặt bàn...</div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="mx-4 w-full max-w-md rounded-[8px] bg-white p-8 text-black"
            style={{
              animation: "zoomIn 0.3s ease-out",
            }}
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Xác nhận hủy đặt bàn
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                Bạn có chắc chắn muốn hủy đặt bàn không? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
                  onClick={() => setShowConfirmPopup(false)}
                >
                  Không, giữ lại
                </button>
                <button
                  className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                  onClick={confirmCancel}
                >
                  Có, hủy đặt bàn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Popup */}
      {showInvoicePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="mx-4 w-full max-w-md rounded-[8px] bg-white p-8 text-black"
            style={{
              animation: "zoomIn 0.3s ease-out",
            }}
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Gửi hóa đơn xác nhận
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Bạn có muốn nhận hóa đơn xác nhận đặt bàn qua email không?
              </p>

              <div className="mb-4">
                <input
                  type="email"
                  value={invoiceEmail}
                  onChange={(e) => setInvoiceEmail(e.target.value)}
                  placeholder="Nhập email để nhận hóa đơn"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-yellow-400"
                />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
                  onClick={handleSkipInvoice}
                  disabled={loading}
                >
                  Không gửi
                </button>
                <button
                  className="rounded-md bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
                  onClick={handleSendInvoice}
                  disabled={loading || !invoiceEmail.trim()}
                >
                  {loading ? "Đang gửi..." : "Gửi hóa đơn"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

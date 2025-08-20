"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '@/lib/apiClient';
import { toZonedTime, format } from "date-fns-tz";
import { UserVoucher, ApiTable } from '@/types/booking';
import { getAvailableTimes } from '@/utils/bookingUtils';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export const BookingForm: React.FC = () => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const timeZone = "Asia/Ho_Chi_Minh";
  const nowInVN = toZonedTime(new Date(), timeZone);
  const minDate = format(nowInVN, "yyyy-MM-dd", { timeZone });
  const [date, setDate] = React.useState(minDate);
  const [time, setTime] = React.useState("14:00");
  const [guestCount, setGuestCount] = React.useState(0);
  const [selectedTableIds, setSelectedTableIds] = React.useState<number[]>([]);
  const [note, setNote] = React.useState("");
  const [promotion, setPromotion] = React.useState("");
  const [voucherCode, setVoucherCode] = React.useState("");
  const [userVouchers, setUserVouchers] = React.useState<UserVoucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = React.useState(false);
  const [selectedVoucher, setSelectedVoucher] = React.useState<UserVoucher | null>(null);
  const [voucherDiscount, setVoucherDiscount] = React.useState(0);

  // Modal chọn bàn gợi ý
  const [suggestedTables, setSuggestedTables] = React.useState<ApiTable[] | null>(null);
  // const [showSuggestModal, setShowSuggestModal] = React.useState(false);
  const [aiSuggestConfirmTable, setAiSuggestConfirmTable] = React.useState<ApiTable | null>(null);
  const [tables, setTables] = React.useState<ApiTable[]>([]);
  const [loading, setLoading] = React.useState(true);
  // Thêm state loading cho AI suggest
  const [aiSuggestLoading, setAiSuggestLoading] = React.useState(false);

  // Thêm state kiểm tra đăng nhập
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // State cho bàn có sẵn theo ngày và giờ
  const [availableTables, setAvailableTables] = React.useState<ApiTable[]>([]);
  const [loadingAvailableTables, setLoadingAvailableTables] = React.useState(false);

  // Tự động điền dữ liệu từ localStorage nếu có bookingInfo
  React.useEffect(() => {
    const bookingInfoStr = localStorage.getItem("bookingInfo");
    if (bookingInfoStr) {
      try {
        const bookingInfo = JSON.parse(bookingInfoStr);
        setName(bookingInfo.name || "");
        setPhone(bookingInfo.phone || "");
        setDate(bookingInfo.date || minDate); 
        setTime(bookingInfo.time || "14:00");
        setGuestCount(bookingInfo.guestCount || 1);
        setSelectedTableIds(bookingInfo.tableIds || []);
        setNote(bookingInfo.note || "");
        setPromotion(bookingInfo.promotion || "");
        setVoucherCode(bookingInfo.voucherCode || "");
      } catch {}
    }
  }, []);

  React.useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await apiClient.get('/users/tables');
        setTables(response.data?.data || response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bàn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
    const interval = setInterval(fetchTables, 5000); // Cập nhật mỗi 5s
    return () => clearInterval(interval);
  }, []);

  // Hàm lấy bàn có sẵn theo ngày và giờ
  const fetchAvailableTables = async (selectedDate: string, selectedTime: string) => {
    if (!selectedDate || !selectedTime) {
      setAvailableTables([]);
      return;
    }

    setLoadingAvailableTables(true);
    try {
      const response = await apiClient.get(`/users/available-tables?date=${selectedDate}&time=${selectedTime}:00`);
      setAvailableTables(response.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bàn có sẵn:', error);
      setAvailableTables([]);
    } finally {
      setLoadingAvailableTables(false);
    }
  };

  // Cập nhật bàn có sẵn khi thay đổi ngày hoặc giờ
  React.useEffect(() => {
    if (date && time) {
      fetchAvailableTables(date, time);
    }
  }, [date, time]);

  const handleTableSelect = (table: ApiTable) => {
    // Kiểm tra bàn có trống và đủ capacity không
    if (!table.status || !table.is_available) return;
    
    // Kiểm tra capacity của bàn có đủ cho số lượng khách không
    if (guestCount > 1 && (table.capacity ?? 0) < guestCount) {
      toast.warn(`Bàn ${table.table_number} chỉ đủ cho ${table.capacity} người, không đủ cho ${guestCount} người!`);
      return;
    }
    
    setSelectedTableIds(prev => {
      // Nếu đã chọn rồi thì bỏ chọn
      if (prev.includes(table.id)) {
        return [];
      }
      // Chỉ cho chọn 1 bàn duy nhất
      return [table.id];
    });
  };
  // Lọc bàn theo số lượng khách - hiển thị tất cả bàn nhưng disable những bàn không phù hợp
  let filteredTables = availableTables.length > 0 ? availableTables : tables;
  const [selectedPurpose, setSelectedPurpose] = React.useState<string>("");
  if (selectedPurpose) {
    filteredTables = filteredTables.filter(table => table.purpose === selectedPurpose);
  }
  const topRowTables = filteredTables.slice(0, 6);
  const bottomRowTables = filteredTables.slice(6, 12);
  
  const availableTimes = getAvailableTimes(date);

  // Đảm bảo thời gian hiện tại luôn hợp lệ với ngày được chọn
  React.useEffect(() => {
    if (date && time) {
      const times = getAvailableTimes(date);
      const timeHour = parseInt(time.split(':')[0]);
      if (!times.includes(timeHour)) {
        // Nếu thời gian hiện tại không hợp lệ, chọn thời gian đầu tiên có sẵn
        if (times.length > 0) {
          setTime(times[0].toString().padStart(2, '0') + ':00');
        }
      }
    }
  }, [date]);

  React.useEffect(() => {
    const userCookie = getCookie("user");
    setIsLoggedIn(!!userCookie);
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie));
        setName(user.name || "");
        setPhone(user.phone || "");
        // Lấy voucher của user nếu đã đăng nhập
        fetchUserVouchers();
      } catch {}
    }
  }, []);

  // Hàm lấy voucher của user
  const fetchUserVouchers = async () => {
    setLoadingVouchers(true);
    try {
      // Lấy user ID từ cookie
      const userCookie = getCookie("user");
      if (userCookie) {
        const user = JSON.parse(decodeURIComponent(userCookie));
        const userId = user.id || user.user_id;
        
        if (userId) {
          const response = await apiClient.get(`/users/vouchers/${userId}`);
          const vouchers = response.data?.data || response.data || [];
          // Lọc voucher hợp lệ (có status = 1 và chưa hết hạn)
          const validVouchers = vouchers.filter((voucher: UserVoucher) => {
            const voucherData = voucher.voucher;
            if (!voucherData) return false;
            const now = new Date();
            const startDate = new Date(voucherData.start_date);
            const endDate = new Date(voucherData.end_date);
            return voucherData.status === 1 && startDate <= now && endDate >= now;
          });
          setUserVouchers(validVouchers);
        } else {
          console.error('Không tìm thấy user ID');
          setUserVouchers([]);
        }
      } else {
        setUserVouchers([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy voucher của user:', error);
      setUserVouchers([]);
    } finally {
      setLoadingVouchers(false);
    }
  };

  // Hàm tính discount từ voucher
  const calculateVoucherDiscount = (voucher: UserVoucher, totalAmount: number) => {
    const voucherData = voucher.voucher;
    if (!voucherData || totalAmount < voucherData.min_price) {
      return 0;
    }

    if (voucherData.discount_type === 1) {
      // Giảm theo phần trăm
      return Math.round((totalAmount * voucherData.discount_value) / 100);
    } else if (voucherData.discount_type === 2) {
      // Giảm theo số tiền cố định
      return Math.min(voucherData.discount_value, totalAmount);
    }
    return 0;
  };

  // Hàm chọn voucher
  const handleSelectVoucher = (voucher: UserVoucher) => {
    setSelectedVoucher(voucher);
    setVoucherCode(voucher.voucher?.code || voucher.code || "");
    const discount = calculateVoucherDiscount(voucher, 0); // Sẽ được tính lại khi có total
    setVoucherDiscount(discount);
  };

  // Hàm bỏ chọn voucher
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setVoucherCode("");
    setVoucherDiscount(0);
  };

  const [showGuestCountModal, setShowGuestCountModal] = React.useState(false);
  const [showMaxGuestModal, setShowMaxGuestModal] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guestCount === 0) {
      setShowGuestCountModal(true);
      return;
    }
    
    // Validate số điện thoại trước khi submit
    const phoneValidationError = validatePhone(phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      toast.error(phoneValidationError);
      return;
    }
    
    if (!name || !phone || !date || !time || selectedTableIds.length === 0) {
      toast.error("Vui lòng nhập đầy đủ thông tin và chọn bàn!");
      return;
    }
    localStorage.setItem("bookingInfo", JSON.stringify({ 
      name, 
      phone, 
      date, 
      time, 
      guestCount, 
      tableIds: selectedTableIds, 
      note, 
      promotion, 
      voucherCode,
      selectedVoucher: selectedVoucher ? {
        id: selectedVoucher.id,
        code: selectedVoucher.voucher?.code || selectedVoucher.code,
        discount: voucherDiscount
      } : null
    }));
    router.push(`/dat-ban/${selectedTableIds.join('-')}`);
  };

  // Hàm validation số điện thoại
  const validatePhone = (phoneNumber: string) => {
    // Loại bỏ tất cả ký tự không phải số
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Kiểm tra độ dài và format số điện thoại Việt Nam
    if (cleanPhone.length === 0) {
      return "Số điện thoại không được để trống";
    }
    
    if (cleanPhone.length < 10) {
      return "Số điện thoại phải có ít nhất 10 chữ số";
    }
    
    if (cleanPhone.length > 11) {
      return "Số điện thoại không được quá 11 chữ số";
    }
    
    // Kiểm tra đầu số Việt Nam
    const validPrefixes = ['03', '05', '07', '08', '09', '01'];
    const prefix = cleanPhone.substring(0, 2);
    
    if (!validPrefixes.includes(prefix)) {
      return "Số điện thoại không đúng định dạng Việt Nam";
    }
    
    return "";
  };

  // Hàm xử lý thay đổi số điện thoại
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    
    // Validate và hiển thị lỗi
    const error = validatePhone(value);
    setPhoneError(error);
  };

  const incrementGuests = () => {
    if (guestCount >= 10) {
      setShowMaxGuestModal(true);
      return;
    }
    setGuestCount(prev => prev + 1);
  };
  const decrementGuests = () => setGuestCount(prev => Math.max(1, prev - 1));

  // Hàm kiểm tra lịch sử đặt bàn
  const checkUserHasHistory = async () => {
    try {
      const res = await apiClient.get('/users/orders');
      return Array.isArray(res.data?.data) && res.data.length > 0;
    } catch {
      return false;
    }
  };

  // Hàm gọi API AI gợi ý bàn
  const handleAISuggestTable = async () => {
    setAiSuggestLoading(true);
    setSuggestedTables(null);
    setAiSuggestConfirmTable(null);
    let hasHistory = false;
    try {
      hasHistory = await checkUserHasHistory();
      let response;
      if (hasHistory) {
        response = await apiClient.get('/users/suggest-table');
      } else {
        response = await apiClient.post('/users/suggest-table', {
          num_people: guestCount,
        });
      }
      
      console.log('response:', response);
      
      // Extract suggested tables from response directly
      const suggestedTablesData = (response as { suggested_tables?: ApiTable[] }).suggested_tables || [];
      console.log(suggestedTablesData);
      
      if (suggestedTablesData && suggestedTablesData.length > 0) {
        // Show modal with all suggested tables
        setSuggestedTables(suggestedTablesData);
      } else {
        toast.error('Không tìm thấy bàn phù hợp!');
      }
    } catch (error) {
      console.error('Error suggesting tables:', error);
      toast.error('Lỗi khi gợi ý bàn!');
    } finally {
      setAiSuggestLoading(false);
    }
  };  

  // Hàm xác nhận chọn bàn AI gợi ý
  const handleConfirmAiSuggestTable = () => {
    if (aiSuggestConfirmTable) {
      setSelectedTableIds([aiSuggestConfirmTable.id]);
      toast.success(`Đã chọn bàn số ${aiSuggestConfirmTable.table_number} từ AI!`);
    }
    setAiSuggestConfirmTable(null);
  };
  const handleCancelAiSuggestTable = () => {
    setAiSuggestConfirmTable(null);
  };

  return (
    <main className="overflow-hidden self-center py-5 mt-10 max-w-full bg-white rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[940px] max-md:w-[95%] max-md:mt-5">
      <h1 className="gap-2.5 self-stretch px-2.5 py-5 w-full text-5xl font-bold leading-none text-center min-h-[110px] text-stone-800 max-md:max-w-full max-md:text-3xl max-md:min-h-[80px] max-md:py-3 flex items-center justify-center">
        Đặt bàn
      </h1>

      {/* Ẩn form booking nếu chưa đăng nhập */}
      <form onSubmit={handleSubmit}>
        <section>
          <h2 className="gap-2.5 self-stretch px-12 py-3 w-full text-2xl font-semibold leading-none text-center text-neutral-900 max-md:px-5 max-md:max-w-full max-md:text-xl">
            Thông tin của bạn
          </h2>
          <div className="px-12 py-3 w-full text-base text-center text-black  max-md:max-w-full max-md:px-4">
            <input
              type="text"
              placeholder="Tên của bạn"
              className="gap-2.5 self-stretch px-2.5 py-3 w-full rounded border border-solid border-stone-300 min-h-[46px] max-md:max-w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Số điện thoại (VD: 0901234567)"
              className={`gap-2.5 self-stretch px-2.5 py-3 mt-5 w-full rounded border border-solid min-h-[46px] max-md:max-w-full ${
                phoneError ? 'border-red-500' : 'border-stone-300'
              }`}
              value={phone}
              onChange={handlePhoneChange}
              required
            />
            {phoneError && (
              <div className="mt-2 text-red-500 text-sm px-2.5">
                {phoneError}
              </div>
            )}
          </div>
        </section>
        <section>
          <h2 className="gap-2.5 self-stretch px-12 py-3 w-full text-2xl font-semibold leading-none text-center text-neutral-900 max-md:px-5 max-md:max-w-full max-md:text-xl">
            Thông tin đặt bàn
          </h2>
          <div className="flex flex-wrap gap-10 justify-between items-center px-12 py-3 w-full max-md:px-5 max-md:max-w-full max-md:flex-col max-md:gap-6">
            <div className="self-stretch my-auto min-w-60 w-[254px] items-center max-md:w-full">
              <div className="gap-2.5 self-stretch px-2.5 py-3 w-full text-lg font-medium leading-none text-center text-black max-md:text-base">
                Số lượng khách
              </div>
              <div className="flex justify-center items-center rounded border border-solid border-stone-300 min-w-60 w-[254px] max-md:w-full">
                <button
                  type="button"
                  onClick={decrementGuests}
                  className="flex overflow-hidden flex-col justify-center items-center text-black self-stretch px-0.5 py-5 my-auto min-h-[60px] w-[60px]"
                >-</button>
                <div className="self-stretch px-2.5 py-5 my-auto text-xl font-bold leading-tight text-center text-black whitespace-nowrap border-r border-l border-stone-300 min-h-[60px] w-[122px] flex items-center justify-center">
                  {guestCount}
                </div>
                <button
                  type="button"
                  onClick={incrementGuests}
                  className="flex overflow-hidden gap-2.5 justify-center items-center text-black self-stretch px-0.5 py-[22px] my-auto min-h-[60px] w-[66px]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="self-stretch my-auto min-w-60 w-[254px] max-md:w-full">
              <label className="gap-2.5 self-stretch px-2.5 py-3 w-full text-lg font-medium leading-none text-center text-black block max-md:text-base">
                Ngày đặt
              </label>
              <div className="flex justify-center items-center w-full rounded border border-solid border-stone-300">
                <input      
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={minDate}
                  className="self-stretch px-2.5 py-5 my-auto text-xl font-bold leading-tight text-center text-black whitespace-nowrap min-h-[60px] w-[188px] bg-transparent border-none outline-none"
                />
              </div>
            </div>

            <div className="self-stretch my-auto min-w-60 w-[254px] max-md:w-full">
              <label className="gap-2.5 self-stretch px-2.5 py-3 w-full text-lg font-medium leading-none text-center text-black block max-md:text-base">
                Thời gian
              </label>
              <div className="flex justify-center items-center w-full rounded border border-solid border-stone-300">
                <select
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="self-stretch px-2.5 py-5 my-auto text-xl font-bold leading-tight text-center text-black min-h-[60px] w-[188px] bg-transparent border-none outline-none"
                >
                  {availableTimes.map(h => (
                    <option key={h} value={h.toString().padStart(2, '0') + ":00"}>
                      {h.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Nút AI gợi ý bàn thông minh */} 
            {isLoggedIn && (
              <div className="self-stretch my-auto min-w-60 w-[254px] flex flex-col items-center justify-center max-md:w-full">
                <button
                  type="button"
                  onClick={suggestedTables && suggestedTables.length > 0 ? () => setSuggestedTables(null) : handleAISuggestTable}
                  disabled={aiSuggestLoading}
                  className="px-4 py-3 rounded  text-black font-semibold transition-colors w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {aiSuggestLoading ? (
                    <span className="animate-spin mr-2 w-5 h-5 border-2 border-t-amber-600 border-amber-200 rounded-full inline-block"></span>
                  ) : suggestedTables && suggestedTables.length > 0 ? (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 19h12v2H6v-2zm6-17C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#b45309"/></svg>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 17.93V20h-2v-.07A8.001 8.001 0 014.07 13H4v-2h.07A8.001 8.001 0 0111 4.07V4h2v.07A8.001 8.001 0 0119.93 11H20v2h-.07A8.001 8.001 0 0113 19.93z" fill="#b45309"/></svg>
                  )}
                  {suggestedTables && suggestedTables.length > 0 ? 'Quay lại danh sách bàn' : 'Gợi ý bàn thông minh'}
                </button>
              </div>
            )}
          </div>
        </section>
        <section className="flex flex-col justify-center px-12 py-3 w-full max-w-[940px] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-row items-center justify-between max-w-full w-full mb-2 max-md:flex-col max-md:gap-3 max-md:items-start">
            <h3 className="text-lg font-medium leading-none text-black max-md:text-base">
              Chọn vị trí bàn
            </h3>
            <div className="flex items-center max-md:w-full">
              <select
                value={selectedPurpose}
                onChange={e => setSelectedPurpose(e.target.value)}
                className="px-2 py-1 text-base border border-stone-300 text-black rounded-[6px] w-[160px] max-md:w-full"
                style={{ minWidth: 120 }}
              >
                <option value="">Tất cả mục đích</option>
                <option value="Hẹn hò">Hẹn hò</option>
                <option value="Gia đình">Gia đình</option>
                <option value="Cặp đôi">Cặp đôi</option>
                <option value="Tiệc sinh nhật">Tiệc sinh nhật</option>
              </select>
            </div>
          </div>
          {loading ? (
            <p className="text-center py-10">Đang tải danh sách bàn...</p>
          ) : loadingAvailableTables && date && time ? (
            <p className="text-center py-10">Đang kiểm tra bàn có sẵn...</p>
          ) : suggestedTables && suggestedTables.length > 0 ? (
            <div className="flex flex-col items-center mb-4">

              <div className="flex flex-wrap gap-4 justify-center">
                {suggestedTables.map((table) => (
                      <button
                      type="button"
                      key={table.id}
                      className={
                         (selectedTableIds.includes(table.id)
                           ? "gap-2.5 self-stretch px-2.5 my-auto text-white bg-amber-400 rounded-[8px] border-2 border-solid border-amber-500 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center cursor-pointer"
                           : !table.is_available
                           ? "gap-2.5 self-stretch px-2.5 my-auto bg-gray-100 rounded-[8px] border-2 border-solid border-gray-300 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center opacity-50 cursor-not-allowed"
                           : (guestCount > 1 && (table.capacity ?? 0) < guestCount)
                           ? "gap-2.5 self-stretch px-2.5 my-auto bg-red-50 rounded-[8px] border-2 border-solid border-red-300 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center opacity-70 cursor-not-allowed"
                           : "gap-2.5 self-stretch px-2.5 my-auto bg-white rounded-[8px] border-2 border-solid border-green-400 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center cursor-pointer hover:bg-green-50"
                         ) 
                       }
                      onClick={() => handleTableSelect(table)}
                      disabled={!table.is_available || (guestCount > 1 && (table.capacity ?? 0) < guestCount)}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[16px] mb-1 text-black">Bàn {table.table_number}</span>
                        <span className="text-sm">{table.name}</span>
                        {typeof table.capacity === 'number' && (
                          <span className={`text-xs mt-1 flex items-center gap-1 ${
                            (guestCount > 1 && (table.capacity ?? 0) < guestCount) 
                              ? 'text-red-600 font-semibold' 
                              : 'text-white'
                          }`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="bg-white rounded-full"><circle cx="12" cy="7" r="4" fill="white"/><path d="M5.5 21v-2a4.5 4.5 0 0 1 9 0v2" fill="white"/></svg>
                            {table.capacity}
                          </span>
                        )}
                      </div>
                    </button>
                ))}
              </div>
            </div>
          ) : (
            // Nếu không có bàn AI gợi ý, show danh sách bàn thường
            <div className="flex flex-col items-center mb-4">
              {date && time && availableTables.length === 0 && !loadingAvailableTables && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-center">
                    Không có bàn trống vào thời gian này. Vui lòng chọn thời gian khác!
                  </p>
                </div>
              )}
              <div className="flex flex-row gap-5 justify-center items-left w-full text-base text-center max-md:max-w-full max-md:flex-col max-md:gap-3">
                {/* <div
                  className="flex items-center justify-center bg-neutral-900 rounded w-[45px] h-[220px] text-white max-md:w-full max-md:h-[40px] max-md:writing-mode-horizontal"
                  style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                  Lối vào
                </div> */}
                <div className="flex flex-col gap-5 max-md:gap-3">
                  {/* Hàng trên */}
                  <div className="flex flex-row gap-5 rounded-[8px] items-center max-md:max-w-full max-md:flex-wrap max-md:justify-center">
                    {topRowTables.map(table => (
                      <button
                        type="button"
                        key={table.id}
                        className={
                          (selectedTableIds.includes(table.id)
                            ? "gap-2.5 self-stretch px-2.5 my-auto text-white bg-amber-400 rounded-[8px] border-2 border-solid border-amber-500 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center cursor-pointer max-md:h-[80px] max-md:w-[80px]"
                            : !table.is_available
                            ? "gap-2.5 self-stretch px-2.5 my-auto bg-gray-100 rounded-[8px] border-2 border-solid border-gray-300 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center opacity-50 cursor-not-allowed max-md:h-[80px] max-md:w-[80px]"
                            : (guestCount > 1 && (table.capacity ?? 0) < guestCount)
                            ? "gap-2.5 self-stretch px-2.5 my-auto bg-red-50 rounded-[8px] border-2 border-solid border-red-300 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center opacity-70 cursor-not-allowed max-md:h-[80px] max-md:w-[80px]"
                            : "gap-2.5 self-stretch px-2.5 my-auto bg-white rounded-[8px] border-2 border-solid border-green-400 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center cursor-pointer hover:bg-green-50 max-md:h-[80px] max-md:w-[80px]"
                          ) 
                        }
                        onClick={() => handleTableSelect(table)}
                        disabled={!table.is_available || (guestCount > 1 && (table.capacity ?? 0) < guestCount)}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[16px] mb-1 text-black max-md:text-sm">Bàn {table.table_number}</span>
                          <span className="text-sm max-md:text-xs">{table.name}</span>
                          {typeof table.capacity === 'number' && (
                            <span className={`text-xs mt-1 max-md:text-[10px] ${
                              (guestCount > 1 && (table.capacity ?? 0) < guestCount) 
                                ? 'text-red-600 font-semibold' 
                                : 'text-gray-700'
                            }`}>
                              👤 {table.capacity}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {/* Hàng dưới */}
                  <div className="flex flex-row gap-5 items-center rounded-[8px] max-md:max-w-full max-md:flex-wrap max-md:justify-center">
                    {bottomRowTables.map(table => (
                      <button
                        key={table.id}
                        className={
                          (selectedTableIds.includes(table.id)
                            ? "gap-2.5 self-stretch px-2.5 my-auto text-white bg-amber-400 rounded-[8px] border-2 border-solid border-amber-500 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center cursor-pointer max-md:h-[80px] max-md:w-[80px]"
                            : !table.is_available
                            ? "gap-2.5 self-stretch px-2.5 my-auto bg-gray-100 rounded-[8px] border-2 border-solid border-gray-300 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center opacity-50 cursor-not-allowed max-md:h-[80px] max-md:w-[80px]"
                            : (guestCount > 1 && (table.capacity ?? 0) < guestCount)
                            ? "gap-2.5 self-stretch px-2.5 my-auto bg-red-50 rounded-[8px] border-2 border-solid border-red-300 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center opacity-70 cursor-not-allowed max-md:h-[80px] max-md:w-[80px]"
                            : "gap-2.5 self-stretch px-2.5 my-auto bg-white rounded-[8px] border-2 border-solid border-green-400 h-[100px] min-h-[100px] w-[100px] flex items-center justify-center cursor-pointer hover:bg-green-50 max-md:h-[80px] max-md:w-[80px]"
                          )
                        }
                        type="button"
                        onClick={() => handleTableSelect(table)}
                        disabled={!table.is_available || (guestCount > 1 && (table.capacity ?? 0) < guestCount)}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[16px] mb-1 text-black max-md:text-sm">Bàn {table.table_number}</span>
                          <span className="text-sm max-md:text-xs">{table.name}</span>
                          {typeof table.capacity === 'number' && (
                            <span className={`text-xs mt-1 max-md:text-[10px] ${
                              (guestCount > 1 && (table.capacity ?? 0) < guestCount) 
                                ? 'text-red-600 font-semibold' 
                                : 'text-gray-700'
                            }`}>
                              👤 {table.capacity}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
        <section className="flex flex-col justify-center px-12 py-3 w-full max-w-[940px] max-md:px-5 max-md:max-w-full">
          <div className="max-w-full text-lg font-medium leading-none text-black w-[254px] max-md:w-full">
            <label className="gap-2.5 self-stretch py-3 w-full block max-md:text-base">
              Chọn ưu đãi
            </label>
          </div>

          <div className="flex flex-wrap gap-10 justify-between items-center px-3 w-full rounded border border-solid border-stone-300 min-h-[46px] max-md:max-w-full max-md:gap-4">
            <div className="flex gap-2.5 justify-center items-center self-stretch my-auto text-base text-center text-stone-300">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/c750db0f8013e1c2e5839abd1b85acf405911bd7?placeholderIfAbsent=true"
                alt="Promotion icon"
                className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              />
              <span className="self-stretch my-auto">Chọn ưu đãi</span>
            </div>
            <div className="flex overflow-hidden gap-2.5 justify-center items-center self-stretch px-1.5 py-5 my-auto min-h-[46px] w-[51px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/5fe39db676920324a4a5117c9697ce7a59136d0b?placeholderIfAbsent=true"
                alt="Dropdown arrow"
                className="object-contain self-stretch my-auto w-4 aspect-[1.6]"
              />
            </div>
          </div>

                     {/* Hiển thị voucher của user nếu có */}
           {isLoggedIn && (
             <div className="mt-3">
               {loadingVouchers ? (
                 <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                   <div className="flex items-center gap-2">
                     <span className="animate-spin w-4 h-4 border-2 border-t-amber-600 border-amber-200 rounded-full"></span>
                     <span className="text-gray-600">Đang tải voucher...</span>
                   </div>
                 </div>
               ) : userVouchers.length > 0 ? (
                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                   <div className="flex items-center gap-2 mb-2">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                       <path d="M9 12l2 2 4-4"/>
                       <circle cx="12" cy="12" r="10"/>
                     </svg>
                     <span className="text-blue-800 font-medium">Voucher của bạn:</span>
                   </div>
                   <div className="space-y-2">
                     {userVouchers.map((voucher, index) => {
                       const voucherData = voucher.voucher;
                       if (!voucherData) return null;
                       const discountText = voucherData.discount_type === 1 
                         ? `-${voucherData.discount_value}%` 
                         : `-${voucherData.discount_value.toLocaleString()}đ`;
                       const isSelected = selectedVoucher?.id === voucher.id;
                       
                       return (
                         <div key={index} className={`flex items-center justify-between p-3 rounded border transition-colors ${
                           isSelected 
                             ? 'bg-green-50 border-green-200' 
                             : 'bg-white border-blue-100 hover:bg-blue-50'
                         }`}>
                           <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                               <span className="text-blue-900 font-semibold">{voucherData.code}</span>
                               <span className="text-sm text-blue-700 font-medium">{discountText}</span>
                             </div>
                             <div className="text-xs text-gray-600">
                               <div>Đơn hàng tối thiểu: {voucherData.min_price.toLocaleString()}đ</div>
                               <div>Hạn sử dụng: {new Date(voucherData.end_date).toLocaleDateString('vi-VN')}</div>
                             </div>
                           </div>
                           {isSelected ? (
                             <button
                               type="button"
                               onClick={handleRemoveVoucher}
                               className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                             >
                               Bỏ chọn
                             </button>
                           ) : (
                             <button
                               type="button"
                               onClick={() => handleSelectVoucher(voucher)}
                               className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                             >
                               Sử dụng
                             </button>
                           )}
                         </div>
                       );
                     })}
                   </div>
                 </div>
               ) : (
                 <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                   <div className="flex items-center gap-2">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                       <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 17.93V20h-2v-.07A8.001 8.001 0 014.07 13H4v-2h.07A8.001 8.001 0 0111 4.07V4h2v.07A8.001 8.001 0 0119.93 11H20v2h-.07A8.001 8.001 0 0113 19.93z"/>
                     </svg>
                     <span className="text-gray-600">Bạn chưa có voucher nào</span>
                   </div>
                 </div>
               )}
             </div>
           )}

           {/* Hiển thị voucher code đã chọn */}
           {selectedVoucher && (
             <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                     <path d="M9 12l2 2 4-4"/>
                     <circle cx="12" cy="12" r="10"/>
                   </svg>
                   <div>
                     <span className="text-green-800 font-medium">Voucher đã chọn: <span className="font-bold">{voucherCode}</span></span>
                     {voucherDiscount > 0 && (
                       <div className="text-sm text-green-700">
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
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M18 6L6 18M6 6l12 12"/>
                   </svg>
                 </button>
               </div>
             </div>
           )}

          <div className="w-full h-[188px] max-md:max-w-full max-md:h-auto">
            <div className="max-w-full text-lg font-medium leading-none text-black w-[254px] max-md:w-full">
              <label className="gap-2.5 self-stretch px-2.5 py-3 w-full block max-md:text-base">
                Ghi chú
              </label>
            </div>
            <div className="w-full min-h-[230px] max-md:max-w-full max-md:min-h-[150px]">
              <textarea
                placeholder="Nhập ghi chú của bạn..."
                className="flex gap-2.5 w-full text-black rounded-lg border border-solid border-stone-300 min-h-[140px] max-md:max-w-full p-3 resize-none outline-none max-md:min-h-[120px]"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-10 justify-between items-center px-12 py-5 w-full text-lg leading-none text-center text-yellow-50 max-w-[940px] max-md:px-5 max-md:max-w-full max-md:flex-col max-md:gap-4">
          <div className="flex shrink-0 gap-2.5 self-stretch my-auto w-60 h-[50px] max-md:hidden" />
          <button
            type="submit"
            className="self-stretch px-7 py-3.5 my-auto w-60 rounded-[8px] border border-solid bg-stone-800 border-stone-800 min-h-[50px] max-md:px-5 hover:bg-stone-700 transition-colors max-md:w-full"
          >
            Đặt bàn ngay
          </button>
        </div>
      </form>

      {aiSuggestConfirmTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-[90vw] w-[400px] relative animate-fade-in max-md:w-[95vw] max-md:p-6">
            <h2 className="text-xl font-bold mb-4 text-center text-stone-800 max-md:text-lg">AI đã chọn bàn phù hợp</h2>
            <div className="mb-4 text-center text-black max-md:text-sm">
              AI gợi ý bàn số <b>{aiSuggestConfirmTable.table_number}</b> ({aiSuggestConfirmTable.description}).<br/>
              Bạn có muốn sử dụng bàn này không?
            </div>
            <div className="flex justify-center gap-4 max-md:flex-col max-md:gap-3">
              <button
                className="px-6 py-2 rounded bg-stone-800 text-white hover:bg-stone-700 transition-colors max-md:w-full"
                onClick={handleConfirmAiSuggestTable}
                type="button"
              >
                Đồng ý
              </button>
              <button
                className="px-6 py-2 rounded border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 transition-colors max-md:w-full"
                onClick={handleCancelAiSuggestTable}
                type="button"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

             {showGuestCountModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 rounded-[8px]">
           <div className="bg-white rounded-[8px] shadow-lg p-8 max-w-[90vw] w-[350px] relative animate-fade-in max-md:w-[95vw] max-md:p-6">
             <h2 className="text-xl font-bold mb-4 text-center text-stone-800 max-md:text-lg">Cảnh báo</h2>
             <div className="mb-4 text-center text-black max-md:text-sm">
               Vui lòng chọn số lượng người trước khi đặt bàn!
             </div>
             <div className="flex justify-center">   
               <button
                 className="px-6 py-2 rounded-[8px] bg-stone-800 text-white hover:bg-stone-700 transition-colors max-md:w-full max-md:px-4"
                 onClick={() => setShowGuestCountModal(false)}
                 type="button"
               >
                 Đóng
               </button>
             </div>
           </div>
         </div>
       )}

       {showMaxGuestModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 rounded-[8px]">
           <div className="bg-white rounded-[8px] shadow-lg p-8 max-w-[90vw] w-[400px] relative animate-fade-in max-md:w-[95vw] max-md:p-6">
             <h2 className="text-xl font-bold mb-4 text-center text-stone-800 max-md:text-lg">Thông báo</h2>
             <div className="mb-6 text-center text-black max-md:text-sm">
               <p className="mb-3">Số lượng khách tối đa là <span className="font-bold text-red-600">10 người</span>.</p>
               <p className="mb-3">Để đặt bàn cho nhóm lớn hơn, vui lòng liên hệ:</p>
               <div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg">
                 <div className="flex items-center gap-2">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                     <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                   </svg>
                   <span className="font-semibold">Hotline: <span className="text-blue-600">1900636323</span></span>
                 </div>
                 <div className="flex items-center gap-2">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                     <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                     <polyline points="22,6 12,13 2,6"/>
                   </svg>
                   <span className="font-semibold">Email: <span className="text-blue-600">momobeef@gmail.com</span></span>
                 </div>
               </div>
             </div>
             <div className="flex justify-center">   
               <button
                 className="px-6 py-2 rounded-[8px] bg-stone-800 text-white hover:bg-stone-700 transition-colors max-md:w-full max-md:px-4"
                 onClick={() => setShowMaxGuestModal(false)}
                 type="button"
               >
                 Đóng
               </button>
             </div>
           </div>
         </div>
       )}
    </main>
  );
};

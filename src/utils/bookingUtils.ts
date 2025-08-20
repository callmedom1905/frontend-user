/**
 * Utility functions cho logic đặt bàn
 */

/**
 * Kiểm tra thời gian có hợp lệ để đặt bàn không
 * @param selectedDate - Ngày được chọn (format: YYYY-MM-DD)
 * @param selectedTime - Thời gian được chọn (format: HH:00)
 * @returns {boolean} - true nếu thời gian hợp lệ
 */
export const isValidBookingTime = (selectedDate: string, selectedTime: string): boolean => {
  if (!selectedDate || !selectedTime) return false;
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const selectedDateTime = new Date(selectedDate + 'T' + selectedTime);
  
  // Kiểm tra không đặt về quá khứ
  if (selectedDateTime < now) return false;
  
  // Kiểm tra giờ đặt (14h-23h)
  const hour = Number(selectedTime.split(':')[0]);
  if (hour < 14 || hour > 23) return false;
  
  // Kiểm tra đặt trước ít nhất 2 tiếng cho hôm nay
  if (selectedDate === today) {
    const minAllowed = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    if (selectedDateTime < minAllowed) return false;
    
    // Không cho đặt hôm nay nếu đã quá 21h
    if (now.getHours() >= 21) return false;
  }
  
  return true;
};

/**
 * Lấy danh sách giờ có thể đặt bàn
 * @param selectedDate - Ngày được chọn (format: YYYY-MM-DD)
 * @returns {number[]} - Mảng các giờ có thể đặt
 */
export const getAvailableTimes = (selectedDate: string): number[] => {
  if (!selectedDate) return [];
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  let minHour = 14;
  
  if (selectedDate === today) {
    // Tính thời gian tối thiểu (hiện tại + 2 tiếng)
    const minAllowed = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    minHour = Math.max(14, minAllowed.getHours());
    
    // Nếu thời gian tối thiểu vượt quá 23h hoặc đã quá 21h, không cho đặt hôm nay
    if (minAllowed.getHours() > 23 || now.getHours() >= 21) return [];
  }
  
  return Array.from({ length: 10 }, (_, i) => 14 + i).filter(h => h >= minHour && h <= 23);
};

/**
 * Lấy thông báo lỗi cho thời gian đặt bàn
 * @param selectedDate - Ngày được chọn
 * @param selectedTime - Thời gian được chọn
 * @returns {string | null} - Thông báo lỗi hoặc null nếu hợp lệ
 */
export const getBookingTimeError = (selectedDate: string, selectedTime: string): string | null => {
  if (!selectedDate || !selectedTime) return "Vui lòng chọn ngày và thời gian!";
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const selectedDateTime = new Date(selectedDate + 'T' + selectedTime);
  
  // Kiểm tra không đặt về quá khứ
  if (selectedDateTime < now) {
    return 'Không thể đặt về quá khứ!';
  }
  
  // Kiểm tra giờ đặt (14h-23h)
  const hour = Number(selectedTime.split(':')[0]);
  if (hour < 14 || hour > 23) {
    return 'Chỉ được đặt từ 14h đến 23h!';
  }
  
  // Kiểm tra đặt trước ít nhất 2 tiếng cho hôm nay
  if (selectedDate === today) {
    const minAllowed = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (selectedDateTime < minAllowed) {
      return 'Bạn phải đặt trước ít nhất 2 tiếng so với thời điểm hiện tại!';
    }
    
    // Không cho đặt hôm nay nếu đã quá 21h
    if (now.getHours() >= 21) {
      return 'Đã quá thời gian đặt bàn cho hôm nay, vui lòng chọn ngày khác!';
    }
  }
  
  return null;
};

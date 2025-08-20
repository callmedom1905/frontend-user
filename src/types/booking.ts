export interface Voucher {
  id: number;
  code: string;
  name: string;
  description?: string;
  discount_type: number;
  discount_value: number;
  min_price: number;
  start_date: string;
  end_date: string;
  status: number;
}

export interface UserVoucher {
  id: number;
  user_id?: number;
  voucher_id?: number;
  voucher?: Voucher;
  code?: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
  
  discount_type?: number;
  discount_value?: number;
  min_price?: number;
  start_date?: string;
  end_date?: string;
}

export interface ApiTable {
  id: number;
  name: string; 
  table_number: number;
  status: boolean; // true: trống, false: đã đặt
  capacity?: number; // Thêm capacity nếu có
  description?: string;
  view?: string;
  purpose?: string;
  is_available?: boolean;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productId?: number;
  meta_description?: string;
  detail_description?: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  payment_method?: string;
}

export interface OrderData {
  orderId?: number | null;
  status?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  bookingDate?: string;
  tableIds?: string;
  guestCount?: string;
  note?: string;
  depositAmount?: number;
  total?: number;
  originalTotal?: number;
  voucherDiscount?: number;
  selectedVoucher?: UserVoucher | null;
  items?: OrderItem[];
}

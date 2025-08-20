import React, { useState } from 'react';
import { format, isValid } from 'date-fns';
import apiClient from '@/lib/apiClient';

interface OrderItem {
  id: number;
  id_order: number;
  id_product: number;
  id_user: number;
  name: string;
  image?: string;
  price: number;
  quantity_sold: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  detail_description?: string | null;
  meta_description?: string | null;
  status?: boolean;
}

export interface OrderDetail {
  id: number;
  date: string;
  time?: string | null;
  capacity: number;
  number_table: number;
  voucher_code?: string | null;
  status: number;
  total_payment: string;
  deposit_amount?: string;
  status_deposit?: number;
  name_user: string;
  phone: string;
  email?: string;
  orderItems?: OrderItem[];
  tables?: Array<{
    id: number;
    table_number: string;
    capacity: number;
  }>;
  payment?: {
    id: number;
    name: string;
  };
  // Thêm các field khác từ API response
  id_voucher?: number | null;
  voucher_discount_amount?: number | null;
  original_total_payment?: number;
  payment_status?: string;
  id_payment?: number;
  id_table?: number;
  id_user?: number;
  created_at?: string;
  updated_at?: string;
  paid_at?: string | null;
  payment_amount?: number | null;
  sepay_transaction_id?: string | null;
  vnpay_bank_code?: string | null;
  vnpay_pay_date?: string | null;
  vnpay_transaction_no?: string | null;
  vnpay_transaction_ref?: string | null;
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail | null;
  loading: boolean;
  onOrderCancelled?: () => void; // Callback khi đơn hàng bị hủy
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  loading,
  onOrderCancelled
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  console.log('OrderDetailModal props:', { 
    isOpen, 
    order: order ? {
      id: order.id,
      name_user: order.name_user,
      phone: order.phone,
      date: order.date,
      capacity: order.capacity,
      total_payment: order.total_payment,
      orderItems: order.orderItems ? `${order.orderItems.length} items` : 'No items'
    } : 'Không có data', 
    loading 
  });
  
  if (order && order.orderItems) {
    console.log('Order items in modal:', order.orderItems);
  }
  
  if (!isOpen) {
    console.log('Modal không mở vì isOpen = false');
    return null;
  }

  const mapStatus = (status: number): 'active' | 'completed' | 'cancelled' => {
    switch (status) {
      case 1:
        return 'active';
      case 2:
        return 'completed';
      case 4:
        return 'cancelled';
      default:
        return 'completed';
    }
  };

  const mapStatusText = (status: number): string => {
    switch (status) {
      case 1:
        return 'Đang hoạt động';
      case 2:
        return 'Hoàn thành';
      case 4:
        return 'Đã huỷ';
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Invalid Date';
  };

  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        return 'Invalid Time';
      }
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return 'Invalid Time';
    }
  };

  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    setIsCancelling(true);
    try {
      await apiClient.put(`/users/orders/${order.id}`, { status: 4 });
      
      // Hiển thị thông báo thành công
      alert('Đơn hàng đã được hủy thành công!');
      
      // Gọi callback để refresh danh sách đơn hàng
      onOrderCancelled?.();
      
      // Đóng modal
      onClose();
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại!');
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết đơn hàng
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black p-1 rounded-full focus:outline-none"
                aria-label="Đóng"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2">Đang tải chi tiết đơn hàng...</p>
              </div>
            ) : order ? (
              <div className="space-y-6">
                {/* Order ID */}
                <div className="bg-gray-50 text-black p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Đơn hàng #{order.id}</h4>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-black ${
                    mapStatus(order.status) === 'active' ? 'bg-blue-100 text-blue-800' :
                    mapStatus(order.status) === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {mapStatusText(order.status)}
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold text-black mb-3">Thông tin khách hàng</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-black">Tên khách hàng</p>
                      <p className="font-medium text-black">{order.name_user}</p>
                    </div>
                    <div>
                      <p className="text-sm text-black">Số điện thoại</p>
                      <p className="font-medium text-black">{order.phone}</p>
                    </div>
                    {order.email && (
                      <div>
                        <p className="text-sm text-black">Email</p>
                        <p className="font-medium text-black">{order.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Thông tin đặt bàn</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-black">Ngày đặt</p>
                      <p className="font-medium text-black">{formatDate(order.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-black">Thời gian</p>
                      <p className="font-medium text-black">
                        {order.time ? formatTime(order.time) : formatTime(order.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-black">Số lượng khách</p>
                      <p className="font-medium text-black">{order.capacity} người</p>
                    </div>
                    <div>
                      <p className="text-sm text-black">Số bàn</p>
                      <p className="font-medium text-black">{order.number_table}</p>
                    </div>
                  </div>
                </div>

                {/* Tables Information */}
                {order.tables && order.tables.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin bàn</h4>
                    <div className="space-y-2">
                      {order.tables.map((table) => (
                        <div key={table.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-black">Bàn {table.table_number}</span>
                          <span className="text-sm text-black">Sức chứa: {table.capacity} người</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                {order.orderItems && order.orderItems.length > 0 ? (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Món ăn đã đặt</h4>
                    <div className="space-y-3">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full flex items-center justify-center text-gray-500 text-xs ${item.image ? 'hidden' : ''}`}>
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-black">{item.name}</h5>
                            <p className="text-sm text-gray-600">Số lượng: {item.quantity_sold}</p>
                            <p className="text-xs text-gray-500">ID: {item.id_product}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-black">{formatCurrency(item.price)}</p>
                            <p className="text-sm text-gray-600">
                              Tổng: {formatCurrency(item.price * item.quantity_sold)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Items Summary */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Tổng số món:</p>
                          <p className="font-medium text-black">{order.orderItems.length} món</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tổng số lượng:</p>
                          <p className="font-medium text-black">
                            {order.orderItems.reduce((total, item) => total + item.quantity_sold, 0)} phần
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tổng tiền món ăn:</p>
                          <p className="font-medium text-blue-600">
                            {formatCurrency(order.orderItems.reduce((total, item) => total + (item.price * item.quantity_sold), 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Món ăn đã đặt</h4>
                    <div className="p-6 text-center bg-gray-50 rounded-lg">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">Chưa có món ăn nào được đặt</p>
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Thông tin thanh toán</h4>
                  <div className="space-y-3">
                    {order.payment && (
                      <div className="flex justify-between">
                        <span className="text-black">Phương thức thanh toán:</span>
                        <span className="font-medium text-black">{order.payment.name}</span>
                      </div>
                    )}
                    {order.deposit_amount && Number(order.deposit_amount) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-black">Tiền cọc:</span>
                        <span className="font-medium text-black">{formatCurrency(Number(order.deposit_amount))}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-lg font-semibold text-black">Tổng tiền:</span>
                      <span className="text-lg font-semibold text-green-600">
                        {formatCurrency(order.total_payment)}
                      </span>
                    </div>
                  </div>  
                </div>

                {/* Voucher Information */}
                {order.voucher_code && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Mã giảm giá</h4>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="font-medium text-yellow-800">{order.voucher_code}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  {order.status === 1 && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      disabled={isCancelling}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-[8px] font-medium transition-colors"
                    >
                      {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-[8px] font-medium transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500">
                <p>Không tìm thấy thông tin đơn hàng</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[8px] shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg rounded-[8px] font-medium text-gray-900">
                  Xác nhận hủy đơn hàng
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn hủy đơn hàng #{order?.id} không? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
                className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-[8px] font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-[8px] font-medium transition-colors"
              >
                {isCancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

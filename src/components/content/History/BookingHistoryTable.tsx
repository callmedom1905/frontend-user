import { useEffect, useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { OrderDetailModal, OrderDetail } from './OrderDetailModal';
import apiClient from '@/lib/apiClient';
import Cookies from 'js-cookie';
import { format, isValid } from 'date-fns';

interface Order {
  id: number;
  date: string;
  time: string | null;
  capacity: number;
  number_table: number;
  voucher_code: string | null;
  status: number;
  action?: string;
  created_at: string;
  updated_at: string;
  total_payment: string;
  payment_status: string;
}

export const  BookingHistoryTable = () => {
  const [user, setUser] = useState({ id: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (err) {
        console.error('Lỗi khi đọc cookie user:', err);
      }
    }
  }, []);

  const userId = user.id;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/users/orders/user/${userId}`);
        console.log('Full API response:', res);

        let ordersData;
        if (res.data && res.data.data) {
          ordersData = res.data.data;
        } else if (res.data) {

          ordersData = res.data;
        } else {
          ordersData = [];
        }
        
        // Ensure orders is always an array
        const ordersArray = Array.isArray(ordersData) ? ordersData : [ordersData].filter(Boolean);
        setOrders(ordersArray);
        console.log('Orders processed:', ordersArray);
      } catch (error) {
        console.error('Lỗi khi fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  const handleViewOrderDetail = async (orderId: number) => {
    setDetailLoading(true);
    setIsModalOpen(true);
    
    try {
      const orderRes = await apiClient.get(`/users/orders/${orderId}`);
      let orderData = orderRes.data;   
      
      if (Array.isArray(orderData)) {
        if (orderData.length > 0) {
          orderData = orderData[0];
        } else {
          console.error('Array rỗng, không có dữ liệu');
          setSelectedOrder(null);
          return;
        }
      }
      
      if (orderData.order_items) {
        orderData.orderItems = orderData.order_items;
        console.log('Found order_items, mapped to orderItems:', orderData.order_items);
      } else if (!orderData.orderItems) {
        orderData.orderItems = [];
        console.log('No order_items found, set empty array');
      }
      
      console.log('Final order data with items:', orderData);
      console.log('Order items count:', orderData.orderItems?.length || 0);
      setSelectedOrder(orderData);
    } catch (error) {
      console.error('Lỗi khi fetch order detail:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('Error response:', (error as { response: unknown }).response);
      }
      setSelectedOrder(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Hàm refresh danh sách đơn hàng khi có đơn hàng bị hủy
  const handleOrderCancelled = () => {
    // Refresh danh sách đơn hàng
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/users/orders/${userId}`);
        console.log('Full API response:', res);

        let ordersData;
        if (res.data && res.data.data) {
          ordersData = res.data.data;
        } else if (res.data) {
          ordersData = res.data;
        } else {
          ordersData = [];
        }
        
        // Ensure orders is always an array
        const ordersArray = Array.isArray(ordersData) ? ordersData : [ordersData].filter(Boolean);
        setOrders(ordersArray);
        console.log('Orders processed:', ordersArray);
      } catch (error) {
        console.error('Lỗi khi fetch orders:', error);
        setOrders([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  };

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

  // Hàm định dạng ngày thành dd/mm/yyyy
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Invalid Date';
  };

  // Hàm định dạng thời gian thành HH:mm
  const formatTime = (timeString: string): string => {
  try {
    // Tạo đối tượng Date từ chuỗi thời gian
    const date = new Date(timeString);
    
    // Kiểm tra xem date có hợp lệ không
    if (isNaN(date.getTime())) {
      return 'Invalid Time';
    }
    
    // Định dạng giờ và phút (HH:mm)
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return 'Invalid Time';
  }
};

  return (
    <>
      <section className="overflow-x-auto p-5 w-full bg-white rounded-xl max-md:max-w-full">
        <table className="w-full text-black">
          <thead>
            <tr className="flex flex-row items-center w-full text-base font-bold">
              <th className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto whitespace-nowrap basis-0 text-center min-w-[120px]">
                Ngày
              </th>
              <th className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto basis-0 text-center min-w-[120px]">
                Thời gian
              </th>
              <th className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto basis-0 text-center min-w-[120px]">
                Số lượng khách
              </th>
              <th className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto basis-0 text-center min-w-[120px]">
                Số bàn
              </th>
              <th className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto basis-0 text-center min-w-[120px]">
                Trạng thái
              </th>
              <th className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto basis-0 text-center min-w-[120px]">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                    <span className="ml-2">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : !Array.isArray(orders) || orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Không có lịch sử đặt bàn nào
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                console.log('Rendering order:', order);
                return (
                  <tr
                    key={index}
                    className="flex flex-row items-center mt-5 w-full"
                  >
                    <td className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto whitespace-nowrap basis-0 min-w-[120px] text-center">
                      {formatDate(order.date)}
                    </td>
                    <td className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto whitespace-nowrap basis-0 min-w-[120px] text-center">
                      {order.time ? formatTime(order.time) : formatTime(order.date)}
                    </td>
                    <td className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto whitespace-nowrap basis-0 min-w-[120px] text-center">
                      {order.capacity}
                    </td>
                    <td className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto whitespace-nowrap basis-0 min-w-[120px] text-center">
                      {order.number_table}
                    </td>
                    <td className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto basis-0 min-w-[120px] text-center">
                      <StatusBadge status={mapStatus(order.status)}>
                        {mapStatusText(order.status)}
                      </StatusBadge>
                    </td>
                    <td className="flex-1 shrink gap-2.5 self-stretch p-2.5 my-auto basis-0 min-w-[120px] text-center">
                      <div className="flex justify-center items-center w-full">
                        <button
                          onClick={() => handleViewOrderDetail(order.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          title="Xem chi tiết"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 hover:text-[#422006] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        loading={detailLoading}
        onOrderCancelled={handleOrderCancelled}
      />
    </>
  );
};
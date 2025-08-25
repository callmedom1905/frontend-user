"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartItem } from '@/types/cart';

export const CartActionButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [autoClearTimer, setAutoClearTimer] = useState<NodeJS.Timeout | null>(null);

  const getNumericPrice = (price: number | string): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const numericString = price.replace(/[^\d.]/g, '');
      const numericPrice = parseFloat(numericString);
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return 0;
  };
  const router = useRouter();
  const pathname = usePathname();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (showModal) {
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(currentCart);
    }
  }, [showModal]);

  // Cập nhật số lượng khi mount và khi giỏ hàng thay đổi
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: CartItem) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    };
    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    return () => window.removeEventListener('cartUpdated', updateCount);
  }, []);

  // Kiểm tra và khởi tạo auto-clear timer khi component mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCreationTime = localStorage.getItem('cartCreationTime');
    
    if (cart.length > 0) {
      if (!cartCreationTime) {
        // Nếu chưa có thời gian tạo, lưu thời gian hiện tại
        saveCartCreationTime();
        startAutoClearTimer();
      } else {
        // Kiểm tra xem đã quá 2 tiếng chưa
        const creationTime = parseInt(cartCreationTime);
        const currentTime = Date.now();
        const timeDiff = currentTime - creationTime;
        const twoHours = 2 * 60 * 60 * 1000; // 2 tiếng
        
        if (timeDiff >= twoHours) {
          // Đã quá 2 tiếng, xóa giỏ hàng
          localStorage.removeItem('cart');
          localStorage.removeItem('cartCreationTime');
          setCart([]);
          window.dispatchEvent(new Event('cartUpdated'));
        } else {
          // Chưa quá 2 tiếng, set timer cho thời gian còn lại
          const remainingTime = twoHours - timeDiff;
          const timer = setTimeout(() => {
            localStorage.removeItem('cart');
            localStorage.removeItem('cartCreationTime');
            setCart([]);
            setShowModal(false);
            window.dispatchEvent(new Event('cartUpdated'));
          }, remainingTime);
          setAutoClearTimer(timer);
        }
      }
    }

    // Cleanup timer khi component unmount
    return () => {
      clearAutoClearTimer();
    };
  }, []);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleBooking = () => {
    const bookingInfo = localStorage.getItem('bookingInfo');
    let tableIds = null;
    if (bookingInfo) {
      try {
        const info = JSON.parse(bookingInfo);
        if (info.tableIds && Array.isArray(info.tableIds)) {
          tableIds = info.tableIds.join('-');
        }
      } catch {}
    }
    if (tableIds) {
      router.push(`/dat-ban/${tableIds}/form-payment`);
      return;
    }
    // Nếu đang ở /menu thì chuyển đến /dat-ban
    if (pathname === '/menu') {
      router.push('/dat-ban');
      return;
    }
    // Mặc định giữ logic cũ
    router.push('/dat-ban');
  };

  const updateCart = (updated: CartItem[]) => {
    setCart(updated);
    if (updated.length === 0) {
      clearAutoClearTimer(); // Xóa timer khi giỏ hàng trống
      localStorage.removeItem('cart'); // Xóa đơn hàng nếu không còn món
      localStorage.removeItem('cartCreationTime');
      setShowModal(false);
    } else {
      localStorage.setItem('cart', JSON.stringify(updated));
      // Reset timer khi có sản phẩm mới
      saveCartCreationTime();
      startAutoClearTimer();
    }
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Function để lưu thời gian tạo giỏ hàng
  const saveCartCreationTime = () => {
    localStorage.setItem('cartCreationTime', Date.now().toString());
  };

  // Function để xóa timer cũ
  const clearAutoClearTimer = () => {
    if (autoClearTimer) {
      clearTimeout(autoClearTimer);
      setAutoClearTimer(null);
    }
  };

  // Function để set timer tự động xóa sau 2 tiếng
  const startAutoClearTimer = () => {
    clearAutoClearTimer(); // Xóa timer cũ nếu có
    const timer = setTimeout(() => {
      // Tự động xóa giỏ hàng sau 2 tiếng
      localStorage.removeItem('cart');
      localStorage.removeItem('cartCreationTime');
      setCart([]);
      setShowModal(false);
      window.dispatchEvent(new Event('cartUpdated'));
    }, 2 * 60 * 60 * 1000); // 2 tiếng = 2 * 60 * 60 * 1000 ms
    
    setAutoClearTimer(timer);
  };

  const clearAllItems = () => {
    clearAutoClearTimer(); // Xóa timer khi xóa thủ công
    localStorage.removeItem('cartCreationTime');
    setCart([]);
    localStorage.removeItem('cart');
    setShowModal(false);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    let newLeft = e.clientX - offset.current.x;
    let newTop = e.clientY - offset.current.y;
    // Giới hạn không ra ngoài màn hình
    newLeft = Math.max(0, Math.min(window.innerWidth - 80, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - 80, newTop));
    setPosition({ left: newLeft, top: newTop });
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Khi vào trang, nút nằm ở góc phải (có thể điều chỉnh lại nếu cần)
  // 80 là kích thước nút, bạn chỉnh lại cho phù hợp
  useEffect(() => {
    setPosition({ top: window.innerHeight - 100, left: window.innerWidth - 100 });
  }, []);


  return (
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        zIndex: 1000,
        cursor: "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <button
        className="relative px-4 py-4 bg-[#E6C67A] rounded-[8px] text-xs text-black shadow-lg max-md:px-5"
        onClick={handleClick}
      >
        {/* Badge số lượng */}
        {cartCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "#d32f2f",
              color: "#fff",
              borderRadius: "999px",
              padding: "2px 6px",
              fontSize: "10px",
              fontWeight: "bold",
              minWidth: "18px",
              textAlign: "center",
              lineHeight: "16px",
            }}
          >
            {cartCount}
          </span>
        )}
        {/* Icon giỏ hàng FontAwesome */}
        <FontAwesomeIcon icon={faShoppingCart} className="w-6 h-6 mx-auto" />
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[900px] max-h-[95vh] sm:max-h-[90vh] relative flex flex-col">
            <button
              className="absolute h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] border rounded-full top-3 right-3 sm:top-6 sm:right-6 text-2xl sm:text-3xl hover:text-red-500"
              onClick={() => setShowModal(false)}
            >×</button>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-black">GIỎ HÀNG</h2>
            {(!cart || cart.length === 0) ? (
              <div className="text-center text-lg text-gray-500 py-10">
                Bạn chưa có món ăn trong giỏ hàng
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {/* Desktop Table View */}
                  <div className="hidden sm:block">
                    <table className="w-full mb-6">
                      <thead>
                        <tr className="text-left font-bold text-black">
                          <th className="text-sm lg:text-base">Món Ăn</th>
                          <th className="text-sm lg:text-base">Đơn Giá</th>
                          <th className="text-sm lg:text-base">Số Lượng</th>
                          <th className="text-sm lg:text-base">Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, idx) => (
                          <tr key={item.id || item.name + idx} className="border-t">
                            <td className="flex items-center gap-3 py-2">

                              <img 
                              src={item.image || item.imageUrl} alt={item.name} className="w-16 h-16 lg:w-20 lg:h-20 rounded object-cover" />
                              <span className="font-bold text-black text-sm lg:text-base">{item.name}</span>
                            </td>
                            <td className="font-bold text-black text-sm lg:text-base">{getNumericPrice(item.price).toLocaleString()} đ</td>
                            <td className="text-black">
                              <div className="flex items-center border rounded w-fit mx-auto">
                                <button
                                  className="px-2 lg:px-3 py-1 text-lg lg:text-xl text-black"
                                  onClick={() => {
                                    const updated = cart
                                      .map((p, i) =>
                                        i === idx ? { ...p, quantity: p.quantity - 1 } : p
                                      )
                                      .filter(p => p.quantity > 0);
                                    updateCart(updated);
                                  }}
                                >-</button>
                                <span className="px-3 lg:px-4 text-base lg:text-lg font-bold">{item.quantity}</span>
                                <button
                                  className="px-2 lg:px-3 py-1 text-lg lg:text-xl text-black"
                                  onClick={() => {
                                    const updated = cart.map((p, i) =>
                                      i === idx ? { ...p, quantity: p.quantity + 1 } : p
                                    );
                                    updateCart(updated);
                                  }}
                                >+</button>
                              </div>
                            </td>
                            <td className="font-bold text-black text-sm lg:text-base">{(getNumericPrice(item.price) * item.quantity).toLocaleString()} đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-4 mb-6">
                    {cart.map((item, idx) => (
                      <div key={item.id || item.name + idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img src={item.image || item.imageSrc} alt={item.name} className="w-16 h-16 rounded object-cover" />
                          <div className="flex-1">
                            <h3 className="font-bold text-black text-sm">{item.name}</h3>
                            <p className="text-sm text-black">{getNumericPrice(item.price).toLocaleString()} đ</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded">
                            <button
                              className="px-3 py-1 text-lg text-black"
                              onClick={() => {
                                const updated = cart
                                  .map((p, i) =>
                                    i === idx ? { ...p, quantity: p.quantity - 1 } : p
                                  )
                                  .filter(p => p.quantity > 0);
                                updateCart(updated);
                              }}
                            >-</button>
                            <span className="px-4 text-base font-bold text-black">{item.quantity}</span>
                            <button
                              className="px-3 py-1 text-lg text-black"
                              onClick={() => {
                                const updated = cart.map((p, i) =>
                                  i === idx ? { ...p, quantity: p.quantity + 1 } : p
                                );
                                updateCart(updated);
                              }}
                            >+</button>
                          </div>
                          <div className="font-bold text-black">
                            {(getNumericPrice(item.price) * item.quantity).toLocaleString()} đ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 sm:p-6 w-full sm:w-2/3 lg:w-1/2 ml-auto text-black mt-4">
                  <div className="flex justify-between mb-2 text-black">
                    <span className="text-sm sm:text-base">Tổng số món</span>
                    <span className="font-bold text-lg sm:text-xl">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-black">
                    <span className="text-sm sm:text-base">Tổng tiền</span>
                    <span className="font-bold text-lg sm:text-xl">{cart.reduce((sum, item) => sum + (getNumericPrice(item.price) * item.quantity), 0).toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between mb-4 text-black">
                    <span className="text-sm sm:text-base">Cọc trước 30% </span>
                    <span className="font-bold text-lg sm:text-xl">{Math.round(cart.reduce((sum, item) => sum + (getNumericPrice(item.price) * item.quantity), 0) * 0.3).toLocaleString()} đ</span>
                  </div>
                  <div className="flex">
                  <button
                    onClick={clearAllItems}
                    className="w-full text-red-500 border-2 border-red-500 py-1 sm:py-3 mr-1 rounded-[8px] text-base sm:text-lg font-bold"
                  >
                    Xóa tất cả
                  </button>
                  <button
                    onClick={handleBooking}
                    className="w-full bg-[#4B2E23] text-white py-1 sm:py-3 rounded-[8px] text-base sm:text-lg font-bold"
                  >
                    Đặt bàn
                  </button>
                  </div>
                </div>
              </>
              
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 
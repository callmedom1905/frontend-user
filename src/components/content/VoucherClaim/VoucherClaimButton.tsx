"use client";
import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { useVoucherCheck } from '../../../hooks/useVoucherCheck';

// Custom shake animation styles
const shakeStyles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    10% { transform: translateX(-2px) rotate(-1deg); }
    20% { transform: translateX(2px) rotate(1deg); }
    30% { transform: translateX(-2px) rotate(-1deg); }
    40% { transform: translateX(2px) rotate(1deg); }
    50% { transform: translateX(-1px) rotate(-0.5deg); }
    60% { transform: translateX(1px) rotate(0.5deg); }
    70% { transform: translateX(-1px) rotate(-0.5deg); }
    80% { transform: translateX(1px) rotate(0.5deg); }
    90% { transform: translateX(-0.5px) rotate(-0.25deg); }
  }
  .shake-animation {
    animation: shake 0.8s ease-in-out;
  }
`;

interface VoucherClaimButtonProps {
  voucher: {
    id: number;
    name: string;
    code: string;
    discount_type: number;
    discount_value: number;
    status: boolean | number;
    start_date: string;
    end_date: string;
  };
  postTitle: string;
}

export const VoucherClaimButton: React.FC<VoucherClaimButtonProps> = ({ voucher, postTitle }) => {
  const { shouldShow, isLoading, userId, isLoggedIn } = useVoucherCheck(voucher);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Shake animation every 10 seconds
  useEffect(() => {
    if (!shouldShow || !isVisible) return;

    const shakeInterval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    }, 10000);

    return () => clearInterval(shakeInterval);
  }, [shouldShow, isVisible]);

  const handleClaimVoucher = async () => {
    if (!isLoggedIn) {
      // alert('Vui lòng đăng nhập để nhận voucher!');
      window.location.href = '/login';
      return;
    }

    if (!userId) {
      alert('Không thể xác định thông tin tài khoản!');
      return;
    }

    setIsClaimLoading(true);
    try {
      const response = await apiClient.post('/users/vouchers/claim', {
        id_user: userId,
        id_voucher: voucher.id
      });

      if ((response as any).success) {
        alert('Nhận voucher thành công!');
        setIsVisible(false); // Hide the button after successful claim
      } else {
        alert((response as any).message || 'Có lỗi xảy ra khi nhận voucher!');
      }
    } catch (error: any) {
      console.error('Error claiming voucher:', error);
      const errorMessage = error.message || 'Có lỗi xảy ra khi nhận voucher!';
      alert(errorMessage);
    } finally {
      setIsClaimLoading(false);
    }
  };

  const formatDiscount = () => {
    return voucher.discount_type === 1 
      ? `${voucher.discount_value}%`  // Type 1: Phần trăm
      : `${voucher.discount_value.toLocaleString()}đ`; // Type 2: Số tiền VND
  };

  // Don't render if loading or shouldn't show or manually hidden
  if (isLoading || !shouldShow || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Inject custom CSS */}
      <style jsx>{shakeStyles}</style>
      
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-4 max-w-sm border-2 border-white ${isShaking ? 'shake-animation' : ''}`}>
          {/* Voucher Icon */}
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white rounded-full p-2">
              <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
              </svg>
            </div>
          <div className="text-white">
            <h3 className="font-bold text-sm">🎁 Mã giảm giá!</h3>
            <p className="text-xs opacity-90">Từ bài viết này</p>
          </div>
        </div>

        {/* Voucher Details */}
        <div className="bg-white rounded-xl p-3 mb-3">
          <div className="text-center">
            <div className="font-bold text-lg text-gray-800 mb-1">
              Giảm {formatDiscount()}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {voucher.name}
            </div>
            <div className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
              Mã: {voucher.code}
            </div>
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={handleClaimVoucher}
          disabled={isClaimLoading}
          className="w-full bg-white text-amber-600 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClaimLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-t-amber-600 border-amber-200 rounded-full animate-spin"></div>
              <span>Đang nhận...</span>
            </div>
          ) : (
            '🎯 Nhận ngay!'
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
    </>
  );
};

export default VoucherClaimButton;

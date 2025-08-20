import { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import Cookies from 'js-cookie';

interface Voucher {
  id: number;
  name: string;
  code: string;
  discount_type: number;
  discount_value: number;
  status: boolean | number;
  start_date: string;
  end_date: string;
}

interface VoucherCheckResult {
  shouldShow: boolean;
  isLoading: boolean;
  userId: number | null;
  isLoggedIn: boolean;
}

export const useVoucherCheck = (voucher?: Voucher): VoucherCheckResult => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkVoucherEligibility = async () => {
      try {
        setIsLoading(true);

        // Check if voucher exists and is valid
        if (!voucher) {
          setShouldShow(false);
          return;
        }

        // Check user login status
        const userCookie = Cookies.get('user');
        const token = Cookies.get('token');
        
        if (!userCookie || !token) {
          // Not logged in - ALWAYS show voucher if it's active (will prompt login on click)
          const isActive = voucher.status === true || (voucher.status as any) === 1 || (voucher.status as any) === 4;
          setShouldShow(isActive);
          setIsLoggedIn(false);
          return;
        }

        // Parse user data
        let currentUserId: number | null = null;
        try {
          const user = JSON.parse(decodeURIComponent(userCookie));
          currentUserId = user.id || user.user_id;
          setUserId(currentUserId);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing user cookie:', error);
          setShouldShow(false);
          return;
        }

        if (!currentUserId) {
          setShouldShow(false);
          return;
        }

        // Check voucher validity (temporarily allow status 4 for testing)
        const isActive = voucher.status === true || (voucher.status as any) === 1 || (voucher.status as any) === 4;
        
        if (!isActive) {
          setShouldShow(false);
          return;
        }

        // Check if user already has this voucher
        try {
          const response = await apiClient.get(`/users/vouchers/${currentUserId}`);
          const userVouchers = response.data?.data || response.data || [];
          
          const hasVoucher = userVouchers.some((item: any) => 
            item.voucher?.id === voucher.id || item.id_voucher === voucher.id
          );

          // Only show if user doesn't have the voucher
          setShouldShow(!hasVoucher && isActive);
        } catch (voucherCheckError) {
          console.error('Failed to check user vouchers:', voucherCheckError);
          // If we can't check user vouchers (e.g., auth issue), show voucher anyway for logged in users
          setShouldShow(isActive);
        }

      } catch (error) {
        console.error('Error checking voucher eligibility:', error);
        // On error, don't show voucher to be safe
        setShouldShow(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkVoucherEligibility();
  }, [voucher]);

  return {
    shouldShow,
    isLoading,
    userId,
    isLoggedIn
  };
};

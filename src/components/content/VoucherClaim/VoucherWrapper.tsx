"use client";
import React from 'react';
import { useVoucherCheck } from '../../../hooks/useVoucherCheck';
import VoucherClaimButton from './VoucherClaimButton';

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

interface VoucherWrapperProps {
  voucher?: Voucher;
  postTitle: string;
}

const VoucherWrapper: React.FC<VoucherWrapperProps> = ({ voucher, postTitle }) => {
  const { shouldShow, isLoading } = useVoucherCheck(voucher);

  // Don't render anything while loading or if shouldn't show
  if (isLoading || !shouldShow || !voucher) {
    return null;
  }

  return (
    <VoucherClaimButton 
      voucher={voucher} 
      postTitle={postTitle}
    />
  );
};

export default VoucherWrapper;

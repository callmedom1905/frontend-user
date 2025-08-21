"use client";
import React from "react";
import { SuccessModal } from "./SuccessModal";

interface RegisterSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export const RegisterSuccessModal: React.FC<RegisterSuccessModalProps> = ({
  isOpen,
  onClose,
  userName
}) => {
  const registerIcon = (
    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );

  return (
    <SuccessModal
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng ký thành công!"
      message={userName ? `Chào mừng ${userName} đến với Moo Beef Steak!` : "Chào mừng bạn đến với Moo Beef Steak!"}
      icon={registerIcon}
    />
  );
};

export default RegisterSuccessModal;

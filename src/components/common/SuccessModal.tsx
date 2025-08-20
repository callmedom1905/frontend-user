"use client";
import React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  onButtonClick?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Your order has been placed!",
  message,
  buttonText = "Thanks!",
  icon,
  onButtonClick
}) => {
  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="mb-6">
          {icon || (
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-4xl">🎉</div>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h2>

        {/* Message */}
        {message && (
          <p className="text-gray-600 mb-8 text-base leading-relaxed">
            {message}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleButtonClick}
          className="bg-[#3E2723] hover:bg-[#D4AF37] text-white font-semibold py-2 px-6 rounded-[8px] shadow transition"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

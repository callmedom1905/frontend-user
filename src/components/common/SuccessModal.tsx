"use client";
import React, { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Your order has been placed!",
  message,
  icon,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {icon || (
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <div className="text-xl">🎉</div>
              </div>
            )}
          </div>

          <div className="flex-1">
            {/* Title */}
            <h2 className="text-sm font-semibold text-gray-900">
              {title}
            </h2>

            {/* Message */}
            {message && (
              <p className="text-sm text-gray-600 mt-1">
                {message}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
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
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
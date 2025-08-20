"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onClick) {
      // Nếu có onClick prop được truyền vào, sử dụng nó
      onClick();
    } else {
      // Mặc định quay về trang trước đó
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-2 mb-8">
      <button
        className="flex items-center justify-center w-10 h-10"
        onClick={handleBack}
        aria-label="Go back"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/8a354c61cb8ab635024a6eeeb6a9efdb9e6e02f8?placeholderIfAbsent=true"
          className="w-6 h-6"
          alt="Back arrow"
        />
      </button>
      <span className="text-white text-lg font-bold uppercase tracking-wide">
        Trở lại
      </span>
    </div>
  );
};

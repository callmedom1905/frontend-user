"use client";
import * as React from "react";
import { useState } from "react";

interface InputFieldProps {
  label: string;
  iconSrc: string;
  type: "text" | "password" | "email";
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function InputField({ label, iconSrc, type, value, onChange, placeholder }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex items-center self-stretch mt-8 w-full border-b border-white min-h-[42px] max-md:max-w-full">
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || label}
        className="flex-1 self-stretch my-auto text-lg text-yellow-50 bg-transparent border-none outline-none placeholder-yellow-50"
      />
      <div className="flex flex-col justify-center items-center self-stretch p-2 my-auto w-[34px]">
        {type === "password" ? (
          <button
            type="button"
            onClick={togglePassword}
            className="flex items-center justify-center w-5 h-5"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <svg className="w-5 h-5 text-yellow-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-yellow-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        ) : (
          <img
            src={iconSrc}
            className="object-contain w-5 aspect-square"
            alt={`${label} icon`}
          />
        )}
      </div>
    </div>
  );
}

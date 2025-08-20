"use client";
import * as React from "react";
import { useState } from "react";

interface FormFieldProps {
  label: string;
  iconSrc: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  iconSrc,
  type = "text",
  value,
  onChange,
  placeholder
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex items-center border-b border-white focus-within:border-yellow-300">
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || label}
        className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/70 py-3 px-0 text-base"
        autoComplete="off"
      />
      <div className="flex items-center pl-2">
        {type === "password" ? (
          <button
            type="button"
            onClick={togglePassword}
            className="flex items-center justify-center w-5 h-5"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <svg className="w-5 h-5 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        ) : (
          <img
            src={iconSrc}
            className="w-5 h-5 opacity-80"
            alt={`${label} icon`}
          />
        )}
      </div>
    </div>
  );
};

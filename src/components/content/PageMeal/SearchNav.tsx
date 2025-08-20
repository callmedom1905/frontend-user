"use client";

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, value, onChange, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(searchTerm);
    }
  };

  return (
    <div className="flex flex-col grow shrink items-end self-stretch my-auto min-h-[48px] sm:min-h-[64px] min-w-48 sm:min-w-60 w-full sm:w-[447px] max-w-full">
      <form onSubmit={handleSubmit} className="flex gap-3 sm:gap-6 items-center px-3 sm:px-4 py-3 sm:py-5 max-w-full bg-white rounded min-h-12 sm:min-h-16 w-full sm:w-[447px] h-12 sm:h-[64px]">
        <input
          type="text"
          placeholder="Tìm kiếm món ăn"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="flex-1 shrink self-stretch my-auto text-sm sm:text-lg tracking-wide leading-none text-black basis-3 bg-transparent border-none outline-none disabled:opacity-50 placeholder:text-gray-400"
        />
        <button 
          type="submit"
          disabled={loading}
          className="overflow-hidden self-stretch p-1 sm:p-1.5 my-auto w-6 sm:w-7 text-sm sm:text-lg font-medium leading-3 text-center whitespace-nowrap text-zinc-700 hover:text-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

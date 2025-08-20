import * as React from "react";

interface PaginationProps {
  currentPage?: number;
  lastPage?: number;
  onPageChange?: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage = 1, 
  lastPage = 1, 
  onPageChange 
}) => {
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < lastPage && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  // Nếu không có onPageChange, hiển thị UI tĩnh như cũ
  if (!onPageChange) {
    return (
      <nav className="flex gap-5 items-center self-center px-5 mt-9 max-w-full text-2xl text-black whitespace-nowrap w-[245px]" aria-label="Pagination">
        <div className="self-stretch my-auto w-[50px]">
          <div className="px-1.5 bg-orange-300 rounded-full h-[50px] w-[50px] flex items-center justify-center">
            1
          </div>
        </div>
        <button className="self-stretch my-auto" aria-label="Page 2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f7f4828f5ea6603778a09abc94cd869a3a84296?placeholderIfAbsent=true&apiKey=41b57356558447c3bfc6c635dc5fd619"
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[50px]"
            alt="Page 2"
          />
        </button>
        <button className="self-stretch my-auto" aria-label="Next page">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/749c7371f3128f3e79e17e636f9ce6579b7ce433?placeholderIfAbsent=true&apiKey=41b57356558447c3bfc6c635dc5fd619"
            className="object-contain shrink-0 self-stretch my-auto aspect-[0.65] w-[22px]"
            alt="Next"
          />
        </button>
      </nav>
    );
  }

  // Không hiển thị pagination nếu chỉ có 1 trang
  if (lastPage <= 1) {
    return null;
  }

  return (
    <nav className="flex gap-5 items-center self-center px-5 mt-9 max-w-full text-2xl text-black whitespace-nowrap w-[245px]" aria-label="Pagination">
      {/* Nút Previous */}
      <button 
        className={`self-stretch my-auto ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/749c7371f3128f3e79e17e636f9ce6579b7ce433?placeholderIfAbsent=true&apiKey=41b57356558447c3bfc6c635dc5fd619"
          className="object-contain shrink-0 self-stretch my-auto aspect-[0.65] w-[22px] rotate-180"
          alt="Previous"
        />
      </button>

      {/* Current Page */}
      <div className="self-stretch my-auto w-[50px]">
        <div className="px-1.5 bg-orange-300 rounded-full h-[50px] w-[50px] flex items-center justify-center">
          {currentPage}
        </div>
      </div>

      {/* Next Page Number (if exists) */}
      {currentPage < lastPage && (
        <button 
          className="self-stretch my-auto cursor-pointer"
          onClick={() => onPageChange(currentPage + 1)}
          aria-label={`Page ${currentPage + 1}`}
        >
          <div className="px-1.5 bg-gray-200 hover:bg-gray-300 rounded-full h-[50px] w-[50px] flex items-center justify-center transition-colors">
            {currentPage + 1}
          </div>
        </button>
      )}

      {/* Nút Next */}
      <button 
        className={`self-stretch my-auto ${currentPage === lastPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleNext}
        disabled={currentPage === lastPage}
        aria-label="Next page"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/749c7371f3128f3e79e17e636f9ce6579b7ce433?placeholderIfAbsent=true&apiKey=41b57356558447c3bfc6c635dc5fd619"
          className="object-contain shrink-0 self-stretch my-auto aspect-[0.65] w-[22px]"
          alt="Next"
        />
      </button>
    </nav>
  );
}; 
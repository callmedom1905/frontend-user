"use client";
import * as React from "react";
import { useParams, usePathname } from "next/navigation";

export const ProgressSteps: React.FC = () => {
  const params = useParams();
  const tablesId = params?.tablesId;
  const pathname = usePathname();

  // Xác định step hiện tại dựa vào url
  let currentStep = 1;
  if (pathname === "/dat-ban") {
    currentStep = 1;
  } else if (pathname === `/dat-ban/${tablesId}`) {
    currentStep = 2;
  } else if (pathname === `/dat-ban/${tablesId}/form-payment`) {
    currentStep = 3;
  }

  // Dữ liệu các bước với mô tả chi tiết
  const steps = [
    {
      id: 1,
      title: "Đặt bàn",
      description: "Chọn bàn và thời gian đặt",
      icon: "🍽️",
      detail: "Bước này giúp bạn chọn bàn phù hợp và thời gian muốn đến nhà hàng. Bạn có thể xem trước các bàn có sẵn và chọn thời gian thuận tiện nhất."
    },
    {
      id: 2,
      title: "Thực đơn",
      description: "Chọn món ăn yêu thích",
      icon: "📋",
      detail: "Tại đây bạn sẽ được xem toàn bộ thực đơn của nhà hàng. Bạn có thể chọn các món ăn yêu thích, điều chỉnh số lượng và xem giá cả trước khi đặt."
    },
    {
      id: 3,
      title: "Thanh toán",
      description: "Xác nhận và thanh toán",
      icon: "💳",
      detail: "Bước cuối cùng để hoàn tất đặt bàn. Bạn sẽ xem lại toàn bộ thông tin đặt bàn, thực đơn đã chọn và tiến hành thanh toán an toàn."
    }
  ];

  const getStepClass = (step: number) => {
    if (step === currentStep) {
      return "bg-orange-500 text-white shadow-lg";
    } else if (step < currentStep) {
      return "bg-green-500 text-white";
    }
    return "bg-gray-300 text-gray-600";
  };

  const handleBack = () => {
    if (typeof window !== 'undefined') window.history.back();
  };

  return (
    <section className="w-full bg-gradient-to-r from-orange-50 to-yellow-50 py-6 px-4 md:px-8 lg:px-16">
      {/* Header với nút quay lại */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold text-sm md:text-base transition-all duration-200 rounded-lg"
          onClick={handleBack}
        >
          <svg width="20" height="20" fill="none" className="md:w-6 md:h-6">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="hidden sm:inline">Quay lại</span>
        </button>
        
        <h2 className="text-lg md:text-xl font-bold text-gray-800 text-center">
          Quy trình đặt bàn
        </h2>
        
        <div className="w-20"></div> {/* Spacer để căn giữa title */}
      </div>

      {/* Progress Steps - Desktop */}
      <div className="hidden md:flex items-center justify-center space-x-8 lg:space-x-12">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-300 ${getStepClass(step.id)}`}>
                {step.id < currentStep ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <div className="mt-3 text-center">
                <div className={`font-bold text-sm md:text-base ${step.id === currentStep ? 'text-orange-600' : step.id < currentStep ? 'text-green-600' : 'text-gray-500'}`}>
                  {step.title}
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 md:w-16 h-1 rounded-full transition-all duration-300 ${
                step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Steps - Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-center space-x-4 mb-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${getStepClass(step.id)}`}>
                  {step.id < currentStep ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`font-bold text-xs ${step.id === currentStep ? 'text-orange-600' : step.id < currentStep ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
                  step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>

    </section>
  );
};

"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/content/Register/BackButton";
import { RegisterForm } from "@/components/content/Register/RegisterForm";

interface RegisterProps {
  onBack?: () => void;
  onRegister?: (formData: any) => void;
  onLoginClick?: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onBack,
  onRegister,
  onLoginClick
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <main className="relative min-h-screen w-full">
      {/* Ảnh nền phủ toàn bộ */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/18d1fb0ccdcf2fa19f5b34a8b4c34e5433e610c6?placeholderIfAbsent=true"
        className="absolute inset-0 w-full h-full object-cover z-0"
        alt="Background"
        style={{ objectPosition: "center" }}
      />
      {/* Layout 2 cột */}
      <div className="relative z-10 flex min-h-screen">
        {/* Cột trái: Form + logo + tiêu đề */}
        <section className="flex flex-col items-center justify-center w-[600px] min-h-screen bg-white/40 px-10 relative">
          {/* Nút quay lại cố định góc trên trái */}
          <div className="absolute top-6 left-6 z-20">
            <BackButton onClick={handleBack} />
          </div>
          <div className="w-full max-w-[400px] flex flex-col items-center mt-12">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/634072f5baee67922b279ca6c6b86466f35fdbb6?placeholderIfAbsent=true"
              className="w-[230px] mb-2 mt-2"
              alt="Registration illustration"
            />
            <RegisterForm
              onSubmit={onRegister}
              onLoginClick={onLoginClick}
            />
          </div>
        </section>
        {/* Cột phải: chỉ là background ảnh */}
        <div className="flex-1" />
      </div>
    </main>
  );
};

export default Register;

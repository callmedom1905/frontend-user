"use client";
import React from "react";
import { RegisterSuccessModal } from "./RegisterSuccessModal";
import { useAuth } from "@/context/AuthContext";

export const RegisterSuccessNotification: React.FC = () => {
  const { user, showRegisterSuccess, setShowRegisterSuccess } = useAuth();

  return (
    <RegisterSuccessModal
      isOpen={showRegisterSuccess}
      onClose={() => {
        console.log("Closing register success modal");
        setShowRegisterSuccess(false);
      }}
      userName={user?.name || user?.full_name}
    />
  );
};

export default RegisterSuccessNotification;

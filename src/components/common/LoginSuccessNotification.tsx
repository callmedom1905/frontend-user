"use client";
import React from "react";
import { LoginSuccessModal } from "./LoginSuccessModal";
import { useAuth } from "@/context/AuthContext";

export const LoginSuccessNotification: React.FC = () => {
  const { user, showLoginSuccess, setShowLoginSuccess } = useAuth();

  return (
    <LoginSuccessModal
      isOpen={showLoginSuccess}
      onClose={() => {
        console.log("Closing login success modal");
        setShowLoginSuccess(false);
      }}
      userName={user?.name || user?.full_name}
      onContinue={() => {
        console.log("Continue button clicked");
        setShowLoginSuccess(false);
      }}
    />
  );
};

export default LoginSuccessNotification;

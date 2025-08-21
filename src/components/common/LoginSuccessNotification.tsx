"use client";
import React, { useEffect } from "react";
import { LoginSuccessModal } from "./LoginSuccessModal";
import { useAuth } from "@/context/AuthContext";

export const LoginSuccessNotification: React.FC = () => {
  const { user, showLoginSuccess, setShowLoginSuccess } = useAuth();

  // useEffect(() => {
  //   console.log("LoginSuccessNotification - showLoginSuccess:", showLoginSuccess);
  //   console.log("LoginSuccessNotification - user:", user);
  // }, [showLoginSuccess, user]);

  useEffect(() => {
  if (showLoginSuccess && user) {
    console.log("User logged in successfully:", user);
  }
}, [showLoginSuccess]);


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

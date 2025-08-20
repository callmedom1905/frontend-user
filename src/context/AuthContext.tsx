"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

type User = any;

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  showLoginSuccess: boolean;
  setShowLoginSuccess: (show: boolean) => void;
  triggerLoginSuccess: (user: User) => void;
  showRegisterSuccess: boolean;
  setShowRegisterSuccess: (show: boolean) => void;
  triggerRegisterSuccess: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
  };

  const triggerLoginSuccess = (userData: User) => {
    setUser(userData);
    setShowLoginSuccess(true);
  };

  const triggerRegisterSuccess = (userData: User) => {
    setUser(userData);
    setShowRegisterSuccess(true);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      logout, 
      showLoginSuccess, 
      setShowLoginSuccess, 
      triggerLoginSuccess,
      showRegisterSuccess,
      setShowRegisterSuccess,
      triggerRegisterSuccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}; 
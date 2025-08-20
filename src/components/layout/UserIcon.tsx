"use client";
import * as React from "react";

export const UserIcon: React.FC = () => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="user-icon text-black group-hover:text-white transition-colors"
      style={{
        display: "flex",
        width: "26px",
        height: "26px",
        padding: "0px 2px",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
        background: "rgba(0,0,0,0.00)",
        position: "relative"
      }}
    >
      <path
        d="M13 13C16.3141 13 19 10.3141 19 7C19 3.68594 16.3141 1 13 1C9.68594 1 7 3.68594 7 7C7 10.3141 9.68594 13 13 13ZM17.2 14.5H16.4172C15.3766 14.9781 14.2188 15.25 13 15.25C11.7812 15.25 10.6281 14.9781 9.58281 14.5H8.8C5.32187 14.5 2.5 17.3219 2.5 20.8V22.75C2.5 23.9922 3.50781 25 4.75 25H21.25C22.4922 25 23.5 23.9922 23.5 22.75V20.8C23.5 17.3219 20.6781 14.5 17.2 14.5Z"
      />
    </svg>
  );
}; 
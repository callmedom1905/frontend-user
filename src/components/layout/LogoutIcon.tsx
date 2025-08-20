"use client";
import * as React from "react";

export const LogoutIcon: React.FC = () => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="logout-icon text-black group-hover:text-white transition-colors"
      style={{
        display: "flex",
        width: "26px",
        height: "26px",
        padding: "3px 0px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
        background: "rgba(0,0,0,0.00)",
        position: "relative"
      }}
    >
      <path
        d="M1.33216 13.7962L9.33256 21.6699C10.0469 22.3729 11.285 21.8808 11.285 20.8732V16.3739H17.7615C18.3949 16.3739 18.9045 15.8725 18.9045 15.2491V10.7499C18.9045 10.1265 18.3949 9.62506 17.7615 9.62506H11.285V5.12581C11.285 4.12285 10.0516 3.62606 9.33256 4.32907L1.33216 12.2028C0.88928 12.6433 0.88928 13.3557 1.33216 13.7962ZM15.8567 21.4356V19.5609C15.8567 19.2516 16.1138 18.9985 16.4281 18.9985H20.4283C21.2712 18.9985 21.9522 18.3283 21.9522 17.4988V8.50025C21.9522 7.6707 21.2712 7.0005 20.4283 7.0005H16.4281C16.1138 7.0005 15.8567 6.74742 15.8567 6.43809V4.5634C15.8567 4.25408 16.1138 4.001 16.4281 4.001H20.4283C22.9523 4.001 25 6.01629 25 8.50025V17.4988C25 19.9827 22.9523 21.998 20.4283 21.998H16.4281C16.1138 21.998 15.8567 21.7449 15.8567 21.4356Z"
      />
    </svg>
  );
}; 
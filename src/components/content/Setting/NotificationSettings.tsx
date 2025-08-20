"use client";

import React, { useState } from "react";

export const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    bookingSuccess: true,
    reminder: false,
    news: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section className="flex w-[544px] min-w-60 shrink grow flex-col max-md:max-w-full">
      <h2 className="text-2xl font-bold leading-none text-amber-400 max-md:max-w-full">
        Thông báo
      </h2>

      <div className="mt-5 flex w-full max-w-[680px] flex-col items-start max-md:max-w-full">
        <div className="flex w-full flex-wrap items-center gap-3 self-stretch max-md:max-w-full">
          <div className="my-auto flex min-h-6 w-6 items-center justify-center gap-2.5 self-stretch overflow-hidden">
            <input
              type="checkbox"
              className="my-auto flex min-h-6 w-6 items-center justify-center self-stretch rounded-sm border-2 border-solid border-amber-400"
              onClick={() => handleNotificationChange("reminder")}
            >
              {/* <div className="my-auto flex min-h-6 w-6 self-stretch rounded-sm border-2 border-solid border-amber-400" /> */}
            </input>
          </div>
          <label className="my-auto self-stretch text-2xl leading-none text-black">
            Thông báo đặt bàn thành công
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            className="my-auto flex min-h-6 w-6 items-center justify-center self-stretch rounded-sm border-2 border-solid border-amber-400"
            onClick={() => handleNotificationChange("reminder")}
          >
            {/* <div className="my-auto flex min-h-6 w-6 self-stretch rounded-sm border-2 border-solid border-amber-400" /> */}
          </input>
          <label className="my-auto self-stretch text-2xl leading-none text-black">
            Thông báo nhắc hẹn
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            className="my-auto flex min-h-6 w-6 items-center justify-center self-stretch rounded-sm border-2 border-solid border-amber-400"
            onClick={() => handleNotificationChange("reminder")}
          >
            {/* <div className="my-auto flex min-h-6 w-6 self-stretch rounded-sm border-2 border-solid border-amber-400" /> */}
          </input> 
          <label className="my-auto self-stretch text-2xl leading-none text-black">
            Thông báo tin tức
          </label>
        </div>
      </div>

      <button className="mt-5 gap-2.5 self-start whitespace-nowrap rounded-[8px] bg-stone-800 px-7 py-1.5 text-center text-sm leading-6 text-yellow-50 max-md:px-5">
        Lưu
      </button>
    </section>
  );
};

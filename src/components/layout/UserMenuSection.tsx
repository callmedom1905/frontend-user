"use client";
import * as React from "react";

interface UserMenuSectionProps {
  icon: React.ReactNode;
  text: string;
  isHighlighted?: boolean;
  onClick?: () => void;
}

export const UserMenuSection: React.FC<UserMenuSectionProps> = ({
  icon,
  text,
  isHighlighted = false,
  onClick
}) => {
  const baseClasses = "flex relative gap-5 justify-center items-center h-12 w-[200px] max-md:h-11 max-md:w-[180px] max-sm:gap-4 max-sm:w-40 max-sm:h-10 bg-white cursor-pointer hover:bg-amber-400 group";
  const textColorClasses = "text-black group-hover:text-white";

  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {icon}
      <div className="flex relative shrink-0 gap-2.5 items-center w-20 max-md:w-[70px] max-sm:w-[60px]">
        <span className={`relative shrink-0 text-base w-[100px] max-md:text-base max-md:w-[90px] max-sm:w-20 max-sm:text-sm ${textColorClasses}`}>
          {text}
        </span>
      </div>
    </Component>
  );
}; 
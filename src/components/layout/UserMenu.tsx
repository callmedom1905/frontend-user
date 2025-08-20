"use client";
import * as React from "react";
import { UserIcon } from "@/components/layout/UserIcon";
import { LogoutIcon } from "@/components/layout/LogoutIcon";
import { UserMenuSection } from "@/components/layout/UserMenuSection";
import { ConfirmLogoutModal } from "@/components/common/ConfirmLogoutModal";
import { useRouter } from "next/navigation";


interface UserMenuProps {
  onAccountClick?: () => void;
  onLogoutClick?: () => Promise<void> | void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onAccountClick,
  onLogoutClick
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (onLogoutClick) {
      await onLogoutClick();
      router.push("/");
    }
    setModalOpen(false);
  };

  return (
    <>
      <nav className="inline-flex flex-col justify-center items-center px-0 py-3 bg-white rounded-lg shadow-md h-[120px] w-[200px] max-md:h-[110px] max-md:w-[180px] max-sm:w-40 max-sm:h-[100px]" style={{ borderRadius: '8px' }}>
        <UserMenuSection
          icon={<UserIcon />}
          text="Tài khoản"
          isHighlighted={true}
          onClick={onAccountClick}
        />
        <UserMenuSection
          icon={<LogoutIcon />}
          text="Đăng xuất"
          isHighlighted={false}
          onClick={() => setModalOpen(true)}
        />
      </nav>
      <ConfirmLogoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default UserMenu; 
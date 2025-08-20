import React from "react";

interface ConfirmLogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
          onClick={onClose}
          aria-label="Đóng"
        >
          &times;
        </button>
        <h3 className="font-bold text-lg mb-2">Bạn có muốn đăng xuất?</h3>
        <p className="mb-6 text-gray-600 text-sm">
          Đăng xuất sẽ kết thúc phiên đăng nhập hiện tại của bạn.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            className="border rounded-[8px] px-4 py-2 text-black bg-gray-100 hover:bg-gray-200"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-[#3E2723] hover:bg-[#D4AF37] text-white font-semibold py-2 px-6 rounded-[8px] shadow transition"
            onClick={onConfirm}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

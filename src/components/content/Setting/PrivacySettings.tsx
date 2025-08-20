import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const PrivacySettings: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

 const handleLogout = async () => {
  if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      setError('Đăng xuất không thành công. Vui lòng thử lại sau.');
    }
  }
};

  return (
    <section className="flex flex-col grow shrink text-2xl leading-none min-w-60 w-[544px] max-md:max-w-full">
      <h2 className="font-bold text-amber-400 max-md:max-w-full">
        Quyền riêng tư và dữ liệu
      </h2>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-5 w-full text-pink-800 underline max-w-[680px] max-md:max-w-full">
        <button className="gap-3 self-stretch w-full max-md:max-w-full text-left">
          Xoá tài khoản
        </button>
      </div>
      <button
        className="gap-2.5 self-start px-7 py-1.5 mt-5 text-sm leading-6 text-center text-yellow-50 rounded-[8px] bg-stone-800 max-md:px-5"
        onClick={handleLogout}
      >
        Đăng xuất
      </button>
    </section>
  );
};
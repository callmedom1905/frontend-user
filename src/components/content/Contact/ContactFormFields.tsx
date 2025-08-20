"use client";
import * as React from "react";
import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Toast } from "@/components/common/Toast";

export function ContactFormFields() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    isVisible: boolean;
  }>({ type: 'info', message: '', isVisible: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiClient.post<{success: boolean; message: string}>('/users/contact', formData);
      
      if (response.success) {
        setToast({
          type: 'success',
          message: response.message || 'Cảm ơn bạn đã liên hệ với chúng tôi!',
          isVisible: true
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        setToast({
          type: 'error',
          message: response.message || 'Có lỗi xảy ra, vui lòng thử lại.',
          isVisible: true
        });
      }
    } catch (error: unknown) {
      console.error('Contact form error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi thông tin liên hệ. Vui lòng thử lại sau.';
      setToast({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <section className="flex flex-col items-end text-sm text-black min-w-60 w-[563px] max-md:max-w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="max-w-full w-[563px]">
          <label htmlFor="name" className="block">
            Họ tên <span style={{color: "rgba(255,0,0,1)"}}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="flex mt-4 w-full rounded bg-neutral-100 min-h-[46px] px-3"
          />
        </div>

        <div className="mt-7 max-w-full w-[563px]">
          <label htmlFor="email" className="block">
            Email <span style={{color: "rgba(255,0,0,1)"}}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="flex mt-4 w-full rounded bg-neutral-100 min-h-[46px] px-3"
          />
        </div>

        <div className="mt-7 max-w-full w-[563px]">
          <label htmlFor="phone" className="block">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="flex mt-4 w-full rounded bg-neutral-100 min-h-[46px] px-3"
          />
        </div>

        <div className="mt-7 max-w-full w-[563px]">
          <label htmlFor="message" className="block">
            Lời nhắn <span style={{color: "rgba(255,0,0,1)"}}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="flex mt-4 w-full rounded bg-neutral-100 min-h-[138px] px-3 py-3 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`self-stretch px-7 py-3.5 mt-7 max-w-full text-lg leading-none text-center text-yellow-50 rounded-lg border border-solid bg-stone-800 border-stone-800 min-h-[50px] w-[563px] max-md:px-5 transition-colors ${
            isSubmitting 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-stone-700'
          }`}
        >
          {isSubmitting ? 'ĐANG GỬI...' : 'GỬI THÔNG TIN'}
        </button>
      </form>

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={closeToast}
        duration={5000}
      />
    </section>
  );
} 
import React from "react";
import { ProgressSteps } from "@/components/content/PageMeal/ProgressSteps";
import { PaymentForm } from "@/components/content/FormPayment/PaymentForm";

const FormThanhToan: React.FC = () => {
  return (
    <div className="flex flex-col overflow-hidden bg-stone-100">
      <ProgressSteps />
      <main className="flex flex-col items-center px-4 max-md:px-2">
        <PaymentForm />
      </main>
    </div>
  );
};

export default FormThanhToan;

"use client";
import * as React from "react";
import { BookingForm } from "@/components/content/PageBookingTable/BookingForm";
import { ProgressSteps } from "@/components/content/PageMeal/ProgressSteps";

function FormAtBan() {
  return (
    <div className="mr-auto flex flex-col overflow-hidden bg-stone-100">
      <ProgressSteps />
      <BookingForm />
    </div>
  );
}

export default FormAtBan;

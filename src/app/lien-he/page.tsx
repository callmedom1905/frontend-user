import * as React from "react";
import { ContactHero } from "../../components/content/Contact/ContactHero";
import { ContactForm } from "@/components/content/Contact/ContactForm";

export default function Contact() {
  return (
    <div className="flex overflow-hidden flex-col bg-stone-100">
      <ContactHero />
      <ContactForm />
    </div>
  );
} 
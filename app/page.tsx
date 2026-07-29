"use client";

import { useEffect, useState } from "react";

import HeroSection from "./(home)/heroSection/page";
import ServicesSection from "./(home)/services/page";
import WhyChooseUs from "./(home)/WhyChooseUs/page";
import Contact from "./(home)/contact/page";
import PendingPaymentDialog from "./payment/payment";

export default function Page() {
  useEffect(() => {
    document.title = "Home - Pradeep CSC";
  }, []);

  const [isPaymentOpen, setIsPaymentOpen] = useState(true); // or false

  return (
    <>
      <PendingPaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
      />

      <HeroSection />
      <ServicesSection />
      <WhyChooseUs />
      <Contact />
    </>
  );
}
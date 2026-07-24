"use client"
import React, { useState, useEffect } from 'react'
import HeroSection from './(home)/heroSection/page';
import ServicesSection from './(home)/services/page'
import GoalsSection from './(home)/goal/page';
import AchievementsSection from './(home)/achievment/page';
import WhyChooseUs from './(home)/WhyChooseUs/page';
import Testimonials from './(home)/testiMonial/page';
import Gallery from './(home)/gallery/page';
import FAQ from './(home)/faq/page';
import Contact from './(home)/contact/page';
import Footer from './(home)/footer/page'
import PendingPaymentDialog from './payment/page';

const PaymentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
 

  return (
   <PendingPaymentDialog/>
  );
};
export default function page() {
  useEffect(() => { document.title = "Home - Pradeep CSC" }, []);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  return (
    <div>
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />

      <HeroSection />
      <ServicesSection />
      <WhyChooseUs  />
      {
      /* 
      <GoalsSection />
      <AchievementsSection  />
      <Testimonials  />
      <Gallery  /> */}
      {/* <FAQ/> */}
      <Contact/>
{/* <GovernmentCard/> */}
    </div>
  )
}


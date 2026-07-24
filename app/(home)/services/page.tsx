"use client"

import {
  CreditCard,
  Landmark,
  FileText,
  ShieldCheck,
  Globe,
  Printer,
  Fingerprint,
  BadgeCheck,
} from "lucide-react";

const services = [
  {
    title: "Aadhaar Services",
    description:
      "New Aadhaar enrollment, biometric update, address correction, mobile & email linking.",
    icon: Fingerprint,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "PAN Card",
    description:
      "Apply for a new PAN card, corrections, reprint, and instant e-PAN services.",
    icon: CreditCard,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Banking Services",
    description:
      "AEPS, cash withdrawal, balance enquiry, mini statement and money transfer.",
    icon: Landmark,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Government Forms",
    description:
      "Online applications for certificates, scholarships and government schemes.",
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Insurance Services",
    description:
      "Life insurance, accidental insurance and government insurance schemes.",
    icon: ShieldCheck,
    color: "bg-red-100 text-red-600",
  },
  {
    title: "Passport Assistance",
    description:
      "Online passport registration, appointments and document verification.",
    icon: Globe,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Printing & Scanning",
    description:
      "High-quality color printing, photocopy, scanning and lamination services.",
    icon: Printer,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Digital Certificates",
    description:
      "Income, caste, residence and birth certificate online applications.",
    icon: BadgeCheck,
    color: "bg-pink-100 text-pink-600",
  },
];

const ServicesSection = () => {
  return (
    <section
      id="services"
      className="py-24 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="text-blue-500 font-semibold uppercase tracking-widest">
            Our Services
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-slate-800">
            Everything You Need
            <span className="text-blue-500"> Under One Roof</span>
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto mt-6 text-lg">
            We provide a complete range of digital government and banking
            services with fast processing, transparency, and customer
            satisfaction.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-sm p-8 shadow-sm hover:shadow-2xl transition duration-300 hover:-translate-y-3 group"
              >

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="text-2xl font-bold mt-8 text-slate-800 group-hover:text-blue-500 transition">
                  {service.title}
                </h3>

                <p className="text-gray-600 mt-4 leading-7">
                  {service.description}
                </p>

                <button className="mt-8 text-blue-500 font-semibold hover:gap-3 transition-all flex items-center gap-2">

                  Learn More →

                </button>

              </div>
            );
          })}

        </div>

        {/* Bottom Banner */}

        

      </div>
    </section>
  );
};

export default ServicesSection;

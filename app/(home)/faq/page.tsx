'use client'

import { useState } from "react";
import { ChevronDown } from "lucide-react";
const faqs = [
  {
    question: "What services are available at your CSC Center?",
    answer:
      "We provide Aadhaar services, PAN card applications, passport assistance, banking services, government schemes, utility bill payments, insurance services, and many other digital services.",
  },
  {
    question: "What documents are required for Aadhaar updates?",
    answer:
      "Generally, you need your Aadhaar card along with valid identity and address proof depending on the type of update requested.",
  },
  {
    question: "Do I need an appointment?",
    answer:
      "Appointments are recommended for faster service, but walk-in customers are also welcome during working hours.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We accept Cash, UPI, Debit Cards, Credit Cards, and Net Banking.",
  },
  {
    question: "How long does document processing take?",
    answer:
      "Processing time depends on the service. Some services are completed instantly, while others may take a few business days.",
  },
  {
    question: "Are my personal documents secure?",
    answer:
      "Yes. We follow strict privacy standards and handle all customer information securely.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-24 bg-white"
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="uppercase tracking-[4px] text-blue-500 font-semibold">

            Frequently Asked Questions

          </span>

          <h2 className="text-5xl font-bold mt-5 text-slate-800">

            Got Questions?

          </h2>

          <p className="mt-6 text-gray-600 text-lg">

            Find answers to the most commonly asked questions about our
            CSC Digital Service Center.

          </p>

        </div>

        {/* Accordion */}

        <div className="space-y-5">

          {faqs.map((faq, index) => {

            const isOpen = activeIndex === index;

            return (

              <div
                key={index}
                className="border rounded-2xl overflow-hidden bg-slate-50"
              >

                <button
                  onClick={() =>
                    setActiveIndex(isOpen ? null : index)
                  }
                  className="w-full flex justify-between items-center px-8 py-6 text-left"
                >

                  <span className="font-semibold text-lg text-slate-800">

                    {faq.question}

                  </span>

                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />

                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >

                  <div className="px-8 pb-6 text-gray-600 leading-8">

                    {faq.answer}

                  </div>

                </div>

              </div>

            );

          })}

        </div>

        {/* CTA */}

        <div className="mt-20 rounded-3xl bg-blue-500 text-white p-12 text-center">

          <h2 className="text-3xl font-bold">

            Still Have Questions?

          </h2>

          <p className="mt-5 text-blue-100">

            Our support team is always ready to help you with any digital
            service or government-related query.

          </p>

          <button className="mt-8 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition">

            Contact Our Team

          </button>

        </div>

      </div>
    </section>
  );
};

export default FAQ;

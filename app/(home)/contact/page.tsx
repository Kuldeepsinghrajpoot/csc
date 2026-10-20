"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z.string().min(3, "Name is required"),
  // We relaxed the phone validation so it doesn't break if someone adds a space or +91
  phone: z.string().min(10, "Phone number is too short"), 
  email: z.string().email("Enter a valid email"),
  service: z.string().min(1, "Select a service"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactFormCard() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        reset(); // Clear the form fields on success
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="w-full bg-linear-to-r from-blue-500 to-blue-600 rounded-sm p-12 text-center">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-500 to-blue-600 p-12 text-center text-white">
        <h2 className="text-4xl font-bold">Need Any Government Service?</h2>
        <div className="mt-8 text-5xl font-bold">Book a Service</div>
      </div>

      <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 items-stretch md:px-24 lg:px-24 py-24">
        {/* ================= LEFT SIDE ================= */}
        <div className="rounded-sm bg-linear-to-br from-blue-700 via-blue-600 to-blue-900 p-10 text-white shadow-xl flex flex-col justify-between">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              Common Service Centre (CSC)
            </span>
            <h2 className="mt-6 text-4xl font-bold">CSC Digital Seva Centre</h2>
            <p className="mt-6 leading-8 text-blue-100">
              We provide secure, fast and reliable digital government services
              for citizens. Our experienced team helps with Aadhaar, PAN Card,
              Banking, Passport, Certificates, Insurance, Bill Payments and many
              other online services under one roof.
            </p>
          </div>

          <div className="mt-10 space-y-6 text-left">
            {/* Address */}
            <div className="border-b border-white/20 pb-5">
              <h3 className="text-sm uppercase tracking-widest text-blue-200">
                Office Address
              </h3>
              <p className="mt-2 text-lg leading-7">
                CSC Digital Seva Centre
                <br />
              Village Vijaypur
                <br />
                 Kulphar Mahoba Uttar Pradesh
                <br />
                PIN - 210426
              </p>
            </div>

            {/* Phone */}
            <div className="border-b border-white/20 pb-5">
              <h3 className="text-sm uppercase tracking-widest text-blue-200">
                Phone Number
              </h3>
              <p className="mt-2 text-lg">+91 9584805472</p>
            </div>

            {/* WhatsApp */}
            <div className="border-b border-white/20 pb-5">
              <h3 className="text-sm uppercase tracking-widest text-blue-200">
                WhatsApp Support
              </h3>
              <p className="mt-2 text-lg">+91 9584805472</p>
            </div>

            {/* Office Time */}
            <div className="border-b border-white/20 pb-5">
              <h3 className="text-sm uppercase tracking-widest text-blue-200">
                Working Hours
              </h3>
              <p className="mt-2 text-lg leading-7">
                Monday - Sunday
                <br />
                9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="bg-white rounded-sm p-10 text-left">
          <h2 className="text-3xl font-bold text-slate-800">Book a Service</h2>
          <p className="mt-2 text-gray-600">
            Fill in your details and our team will contact you shortly.
          </p>

          {/* SUCCESS MESSAGE */}
          {status === "success" && (
            <div className="mt-6 rounded-md bg-green-50 p-4 border border-green-200">
              <h3 className="text-sm font-medium text-green-800">
                Request sent successfully!
              </h3>
              <p className="mt-2 text-sm text-green-700">
                Thank you for contacting us. We will get back to you shortly.
              </p>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {status === "error" && (
            <div className="mt-6 rounded-md bg-red-50 p-4 border border-red-200">
              <h3 className="text-sm font-medium text-red-800">
                Failed to send request
              </h3>
              <p className="mt-2 text-sm text-red-700">
                Please check your connection and try again, or call us directly.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <input
                {...register("name")}
                type="text"
                disabled={status === "submitting"}
                placeholder="Full Name"
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500 disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-red-500">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <input
                {...register("phone")}
                type="tel"
                disabled={status === "submitting"}
                placeholder="Mobile Number"
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500 disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-red-500">
                {errors.phone?.message}
              </p>
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                disabled={status === "submitting"}
                placeholder="Email Address"
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500 disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-red-500">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <select
                {...register("service")}
                disabled={status === "submitting"}
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">Select Service</option>
                <option value="Aadhaar Services">Aadhaar Services</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Banking">Banking</option>
                <option value="Passport">Passport</option>
                <option value="Insurance">Insurance</option>
                <option value="Certificates">Certificates</option>
              </select>
              <p className="mt-1 text-sm text-red-500">
                {errors.service?.message}
              </p>
            </div>

            <div>
              <textarea
                {...register("message")}
                rows={5}
                disabled={status === "submitting"}
                placeholder="Write your message..."
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500 disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-red-500">
                {errors.message?.message}
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-sm bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
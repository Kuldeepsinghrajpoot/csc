"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z.string().min(3, "Name is required"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  service: z.string().min(1, "Select a service"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactFormCard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    console.log(data);
  };

  return (
    <div   className=" w-full  bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm p-12 text-center ">
      {/* Hero Section */}

      <div className=" bg-gradient-to-r from-blue-500 to-blue-600 p-12 text-center text-white">
        <h2 className="text-4xl font-bold">
          Need Any Government Service?
        </h2>

        <div className="mt-8 text-5xl font-bold">
          Book a Service
        </div>
      </div>

      <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 items-stretch md:px-24 lg:px-24 py-24">

        {/* ================= LEFT SIDE ================= */}

        <div className="rounded-sm bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 p-10 text-white shadow-xl flex flex-col justify-between">

          <div>

            <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              Common Service Centre (CSC)
            </span>

            <h2 className="mt-6 text-4xl font-bold">
              CSC Digital Seva Centre
            </h2>

            <p className="mt-6 leading-8 text-blue-100">
              We provide secure, fast and reliable digital government
              services for citizens. Our experienced team helps with
              Aadhaar, PAN Card, Banking, Passport, Certificates,
              Insurance, Bill Payments and many other online services
              under one roof.
            </p>

          </div>

          <div className="mt-10 space-y-6">

            {/* Address */}

            <div className="border-b border-white/20 pb-5">
              <h3 className="text-sm uppercase tracking-widest text-blue-200">
                Office Address
              </h3>

              <p className="mt-2 text-lg leading-7">
                CSC Digital Seva Centre
                <br />
                Main Market Road
                <br />
                Your City, Your State
                <br />
                PIN - 123456
              </p>
            </div>

            {/* Phone */}

            <div className="border-b border-white/20 pb-5">
              <h3 className="text-sm uppercase tracking-widest text-blue-200">
                Phone Number
              </h3>

              <p className="mt-2 text-lg">
                +91 98765 43210
              </p>
            </div>

            {/* WhatsApp */}

            <div className="border-b border-white/20 pb-5">
              <h3 className="text-sm uppercase tracking-widest text-blue-200">
                WhatsApp Support
              </h3>

              <p className="mt-2 text-lg">
                +91 98765 43210
              </p>
            </div>

          

            {/* Office Time */}

            <div className="border-b border-white/20 pb-5">
              <h3 className="text-sm uppercase tracking-widest text-blue-200">
                Working Hours
              </h3>

              <p className="mt-2 text-lg leading-7">
                Monday - Saturday
                <br />
                9:00 AM - 6:00 PM
              </p>
            </div>

            {/* Services */}

           

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="bg-white rounded-sm p-10">

          <h2 className="text-3xl font-bold text-slate-800">
            Book a Service
          </h2>

          <p className="mt-2 text-gray-600">
            Fill in your details and our team will contact you shortly.
          </p>

          {/* Continue with your existing form here... */}
                    <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
            <div>
              <input
                {...register("name")}
                type="text"
                placeholder="Full Name"
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-red-500">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <input
                {...register("phone")}
                type="tel"
                placeholder="Mobile Number"
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-red-500">
                {errors.phone?.message}
              </p>
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email Address"
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-red-500">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <select
                {...register("service")}
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500"
              >
                <option value="">Select Service</option>
                <option value="Aadhaar Services">
                  Aadhaar Services
                </option>
                <option value="PAN Card">
                  PAN Card
                </option>
                <option value="Banking">
                  Banking
                </option>
                <option value="Passport">
                  Passport
                </option>
                <option value="Insurance">
                  Insurance
                </option>
                <option value="Certificates">
                  Certificates
                </option>
              </select>

              <p className="mt-1 text-sm text-red-500">
                {errors.service?.message}
              </p>
            </div>

            <div>
              <textarea
                {...register("message")}
                rows={5}
                placeholder="Write your message..."
                className="w-full rounded-sm border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500"
              />

              <p className="mt-1 text-sm text-red-500">
                {errors.message?.message}
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-sm bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
      </div>
    
  );
}
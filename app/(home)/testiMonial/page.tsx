"use client"
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Lucknow, Uttar Pradesh",
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "Excellent service! My Aadhaar update was completed within minutes. The staff was very helpful and professional.",
    rating: 5,
  },
  {
    name: "Priya Verma",
    location: "Kanpur, Uttar Pradesh",
    image:
      "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "Very smooth experience for my PAN card application. Everything was explained clearly and completed on time.",
    rating: 5,
  },
  {
    name: "Amit Singh",
    location: "Barabanki, Uttar Pradesh",
    image:
      "https://randomuser.me/api/portraits/men/75.jpg",
    review:
      "Highly recommended CSC Center. Fast service, affordable pricing, and excellent customer support.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="uppercase tracking-[4px] text-blue-500 font-semibold">

            Testimonials

          </span>

          <h2 className="text-5xl font-bold text-slate-800 mt-5">

            What Our
            <span className="text-blue-500">
              {" "}Customers Say
            </span>

          </h2>

          <p className="mt-6 text-gray-600 max-w-3xl mx-auto text-lg">

            We are proud to have served thousands of satisfied citizens.
            Here's what some of our customers have to say about their
            experience with our CSC Digital Service Center.

          </p>

        </div>

        {/* Cards */}

        <div className="grid lg:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (

            <div
              key={index}
              className="relative bg-slate-50 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-3"
            >

              {/* Quote */}

              <div className="absolute top-8 right-8">

                <Quote
                  size={42}
                  className="text-blue-200"
                />

              </div>

              {/* User */}

              <div className="flex items-center gap-5">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                />

                <div>

                  <h3 className="text-xl font-bold text-slate-800">

                    {item.name}

                  </h3>

                  <p className="text-gray-500">

                    {item.location}

                  </p>

                </div>

              </div>

              {/* Rating */}

              <div className="flex gap-1 mt-6">

                {[...Array(item.rating)].map((_, i) => (

                  <Star
                    key={i}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />

                ))}

              </div>

              {/* Review */}

              <p className="mt-6 text-gray-600 leading-8">

                "{item.review}"

              </p>

            </div>

          ))}

        </div>

        {/* Bottom CTA */}

        <div className="mt-20 rounded-3xl bg-gradient-to-r from-blue-500 to-blue-600 p-12 text-center text-white">

          <h2 className="text-4xl font-bold">

            Join Thousands of Happy Customers

          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-blue-100">

            Whether you need Aadhaar services, PAN card assistance,
            banking facilities, or government scheme registration,
            we're here to help with fast, reliable, and secure service.

          </p>

          <button className="mt-8 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition">

            Visit Our Center

          </button>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;

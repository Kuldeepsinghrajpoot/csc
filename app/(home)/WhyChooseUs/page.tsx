import {
  ShieldCheck,
  Clock3,
  Users,
  BadgeCheck,
  Headphones,
  Lock,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Government Authorized",
    description:
      "We are an authorized CSC center providing genuine government digital services.",
  },
  {
    icon: Clock3,
    title: "Fast Processing",
    description:
      "Most applications are processed quickly with minimal waiting time.",
  },
  {
    icon: Users,
    title: "Experienced Staff",
    description:
      "Our trained professionals guide you through every service with accuracy.",
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description:
      "Your documents and personal information remain completely secure.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Friendly assistance before, during, and after every service.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Quality",
    description:
      "Thousands of satisfied customers trust us for reliable digital services.",
  },
];

const WhyChooseUs = () => {
  return (
    <section
      id="why-us"
      className="py-24 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className=" ">

          {/* Left Image */}

         

          {/* Right Content */}

          <div className="items-center text-center lg:text-left">

            <span className="uppercase tracking-[4px] text-blue-500 font-semibold">

              Why Choose Us

            </span>

            <h2 className="text-5xl font-bold text-slate-800 mt-5 leading-tight">

              Your Trusted Partner
              <br />

              <span className="text-blue-500">
                For Digital Government Services
              </span>

            </h2>

            <p className="text-gray-600 mt-8 text-lg leading-8">

              We combine technology, transparency, and experienced professionals
              to deliver quick, secure, and reliable government services for
              every citizen.

            </p>

            {/* Features */}

            <div className="grid sm:grid-cols-3 gap-6 mt-12">

              {features.map((feature, index) => {

                const Icon = feature.icon;

                return (

                  <div
                    key={index}
                    className="bg-white rounded-md p-6 shadow hover:shadow-xl transition duration-300 hover:-translate-y-2"
                  >

                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

                      <Icon
                        size={28}
                        className="text-blue-500"
                      />

                    </div>

                    <h3 className="font-bold text-xl mt-5">

                      {feature.title}

                    </h3>

                    <p className="text-gray-600 mt-3 leading-7">

                      {feature.description}

                    </p>

                  </div>

                );

              })}

            </div>

            {/* Checklist */}

            <div className="mt-12 space-y-4">

              {[
                "Transparent & Affordable Pricing",
                "100% Genuine Government Services",
                "Professional Customer Assistance",
                "Safe Digital Documentation",
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4"
                >

                  <CheckCircle2
                    className="text-green-500"
                    size={22}
                  />

                  <span className="text-gray-700 text-lg">

                    {item}

                  </span>

                </div>

              ))}

            </div>

            {/* Button */}

            <button className="mt-12 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-md font-semibold transition">

              Learn More About Us

            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;

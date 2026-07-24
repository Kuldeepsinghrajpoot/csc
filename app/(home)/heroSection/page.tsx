
import { ArrowRight, CheckCircle2 } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}

      <img
        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80"
        alt="CSC Digital Seva Center"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-900/60"></div>

      {/* Hero Content */}

      <div className="relative max-w-7xl mx-auto px-6 py-36">

        <div className="max-w-5xl">

          {/* Badge */}

          <span className="inline-flex items-center gap-2 bg-blue-500/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">

            <CheckCircle2 size={18} />

            Government Authorized CSC Digital Seva Center

          </span>

          {/* Heading */}

          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white">

            Empowering Every Citizen With

            <span className="block mt-3 text-blue-500">

              Secure & Reliable Digital Government Services

            </span>

          </h1>

          {/* Description */}
          <p className="mt-8 max-w-3xl text-lg md:text-xl leading-9 text-gray-200">

            Your one-stop destination for government and digital services with
            quick processing, secure transactions, and reliable customer support.

          </p>

          {/* Buttons */}

          <div className="flex flex-wrap gap-5 mt-10">

            <button className="bg-blue-500 hover:bg-blue-600 transition text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3">

              Explore Services

              <ArrowRight size={20} />

            </button>

            <button className="border-2 border-white hover:bg-white hover:text-slate-900 transition text-white px-8 py-4 rounded-xl font-semibold">

              Book Appointment

            </button>

          </div>

          {/* Features */}

          {/* Right Side */}
          <div className="relative">

            <div
              // src="/images/csc-office.jpg"
              // alt="CSC Digital Seva Center"
              className="h-[600px] w-full rounded-3xl object-cover shadow-2xl"
            />

            {/* Floating Card */}

            <div className="absolute bottom-8 left-1/2 w-[90%] -translate-x-1/2 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">

              <div className="grid grid-cols-2 gap-6">

                <div>
                  <p className="text-4xl font-bold text-blue-400">
                    15K+
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Happy Customers
                  </p>
                </div>

                <div>
                  <p className="text-4xl font-bold text-blue-400">
                    300+
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Digital Services
                  </p>
                </div>

              </div>

              <div className="my-6 h-px bg-white/20" />

              <div className="space-y-3">

                <div className="flex items-center gap-3">

                  <div className="h-3 w-3 rounded-full bg-green-500" />

                  <span className="text-white">
                    Government Authorized CSC
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <div className="h-3 w-3 rounded-full bg-green-500" />

                  <span className="text-white">
                    Secure Digital Services
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <div className="h-3 w-3 rounded-full bg-green-500" />

                  <span className="text-white">
                    Fast Processing
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <div className="h-3 w-3 rounded-full bg-green-500" />

                  <span className="text-white">
                    Expert Customer Support
                  </span>

                </div>

              </div>

              <button className="mt-6 w-full rounded-xl bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-600">
                Visit CSC Center
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;

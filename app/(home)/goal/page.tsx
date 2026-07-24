import {
  Target,
  Eye,
  Rocket,
  ArrowRight,
} from "lucide-react";

const goalCards = [
  {
    title: "Our Mission",
    icon: Target,
    color: "bg-blue-100 text-blue-600",
    description:
      "To provide every citizen with quick, transparent, and affordable access to digital government services under one roof.",
  },
  {
    title: "Our Vision",
    icon: Eye,
    color: "bg-blue-100 text-blue-600",
    description:
      "To become the most trusted CSC Digital Service Center by delivering modern, reliable, and citizen-friendly digital solutions.",
  },
  {
    title: "Our Goal",
    icon: Rocket,
    color: "bg-green-100 text-green-600",
    description:
      "Empowering rural and urban communities with secure online services while promoting Digital India initiatives.",
  },
];

const process = [
  {
    step: "01",
    title: "Visit Our Center",
    desc: "Walk into our CSC center or contact us online.",
  },
  {
    step: "02",
    title: "Choose Your Service",
    desc: "Select the government or banking service you need.",
  },
  {
    step: "03",
    title: "Submit Documents",
    desc: "Provide the required documents for verification.",
  },
  {
    step: "04",
    title: "Get Your Service",
    desc: "Receive your completed service quickly and securely.",
  },
];

const GoalsSection = () => {
  return (
    <section
      id="goals"
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-20">

          <span className="uppercase tracking-widest font-semibold text-blue-500">
            Goals & Vision
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-slate-800">
            Building A Better
            <span className="text-blue-500"> Digital Future</span>
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-gray-600 text-lg">
            We are committed to delivering high-quality government services,
            improving digital accessibility, and ensuring every citizen receives
            fast and secure assistance.
          </p>

        </div>

        {/* Goal Cards */}

        <div className="grid lg:grid-cols-3 gap-8">

          {goalCards.map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                className="bg-slate-50 rounded-3xl p-10 hover:shadow-xl transition duration-300 hover:-translate-y-3"
              >

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="text-2xl font-bold mt-8 text-slate-800">
                  {item.title}
                </h3>

                <p className="mt-5 text-gray-600 leading-8">
                  {item.description}
                </p>

              </div>

            );

          })}

        </div>

        {/* Process */}

        <div className="mt-28">

          <div className="text-center mb-16">

            <span className="uppercase tracking-widest font-semibold text-blue-500">
              How It Works
            </span>

            <h2 className="text-4xl font-bold mt-4 text-slate-800">
              Our Simple Process
            </h2>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {process.map((item, index) => (

              <div
                key={index}
                className="relative bg-white border rounded-3xl p-8 hover:border-blue-500 hover:shadow-xl transition duration-300"
              >

                <div className="absolute -top-5 left-8 bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">

                  {item.step}

                </div>

                <div className="pt-8">

                  <h3 className="text-xl font-bold text-slate-800">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-gray-600 leading-7">
                    {item.desc}
                  </p>

                  <button className="mt-6 flex items-center gap-2 text-blue-500 font-semibold">

                    Learn More

                    <ArrowRight size={18} />

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default GoalsSection;

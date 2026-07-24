"use client";

import { motion } from "framer-motion";
import {
  Users,
  BadgeCheck,
  Award,
  Briefcase,
  Star,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    number: "15K+",
    title: "Happy Customers",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "300+",
    title: "Government Services",
    icon: BadgeCheck,
    color: "from-blue-500 to-red-500",
  },
  {
    number: "8+",
    title: "Years Experience",
    icon: Briefcase,
    color: "from-green-500 to-emerald-500",
  },
  {
    number: "99%",
    title: "Success Rate",
    icon: Star,
    color: "from-purple-500 to-pink-500",
  },
];

const achievements = [
  {
    icon: Award,
    title: "Certified CSC Center",
    description:
      "Authorized Common Service Center providing secure government digital services.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted by Thousands",
    description:
      "More than fifteen thousand satisfied citizens have successfully used our services.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assurance",
    description:
      "We maintain transparency, accuracy, and timely delivery for every application.",
  },
];

const AchievementsSection = () => {
  return (
    <section
      id="achievements"
      className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >

          <span className="uppercase tracking-[4px] text-blue-400 font-semibold">

            Achievements

          </span>

          <h2 className="text-5xl font-bold mt-5">

            Numbers That
            <span className="text-blue-500"> Speak For Us</span>

          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-gray-300 text-lg">

            We believe every satisfied customer represents another step
            toward building a digitally empowered India.

          </p>

        </motion.div>

        {/* Statistics */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: .5,
                  delay: index * .15,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -12,
                }}
                className="rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 text-center"
              >

                <div
                  className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-xl`}
                >

                  <Icon size={36} />

                </div>

                <h2 className="text-5xl font-extrabold mt-8">

                  {item.number}

                </h2>

                <p className="mt-3 text-gray-300">

                  {item.title}

                </p>

              </motion.div>

            );

          })}

        </div>

        {/* Achievement Cards */}

        <div className="grid lg:grid-cols-3 gap-8 mt-24">

          {achievements.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity: 0, scale: .9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: .5,
                  delay: index * .2,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                }}
                className="bg-white rounded-3xl p-10 text-slate-800 shadow-xl"
              >

                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

                  <Icon
                    size={38}
                    className="text-blue-500"
                  />

                </div>

                <h3 className="text-2xl font-bold mt-8">

                  {item.title}

                </h3>

                <p className="mt-5 text-gray-600 leading-8">

                  {item.description}

                </p>

              </motion.div>

            );

          })}

        </div>

        {/* Bottom Banner */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
          className="mt-24 rounded-3xl bg-gradient-to-r from-blue-500 to-blue-600 p-12 text-center"
        >

          <h2 className="text-4xl font-bold">

            Delivering Trusted Digital Services Since 2018

          </h2>

          <p className="mt-5 text-blue-100 max-w-3xl mx-auto">

            Our commitment to excellence, transparency, and customer
            satisfaction has made us one of the most trusted CSC Digital
            Service Centers in the region.

          </p>

          <button className="mt-10 bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:scale-105 transition">

            Explore Our Services

          </button>

        </motion.div>

      </div>
    </section>
  );
};

export default AchievementsSection;

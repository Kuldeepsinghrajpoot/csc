'use client'

import { navLinks } from "@/app/nav";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Send,
  Fingerprint,
  CreditCard,
  Globe,
  Ban,
  ShieldCheck,
  Leaf,
  Zap,
  Award,
  Banknote,
} from "lucide-react";

import Link from "next/link";
const Footer = () => {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">

      {/* Background Effect */}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/10"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">

          {/* About */}

          <div>

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">

                CSC

              </div>

              <div>

                <h2 className="text-2xl font-bold">

                  CSC Digital

                </h2>

                <p className="text-gray-400 text-sm">

                  Seva Center

                </p>

              </div>

            </div>

            <p className="text-gray-400 leading-8 mt-8">

              We provide trusted digital government services,
              Aadhaar, PAN, Banking, Passport assistance,
              online applications and many more services with
              transparency and customer satisfaction.

            </p>

            {/* Social */}

            <div className="flex gap-4 mt-8">

              {[Facebook, Instagram, Twitter, Linkedin].map(
                (Icon, index) => (
                  <button
                    key={index}
                    className="w-12 h-12 rounded-full bg-slate-800 hover:bg-blue-500 transition flex items-center justify-center"
                  >
                    <Icon size={20} />
                  </button>
                )
              )}

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-2xl font-bold mb-8">

              Quick Links

            </h3>

            <div className="space-y-4">

              {navLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    href={item.href}
                    key={item.name}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-medium transition duration-300"
                  >
                    <Icon size={18} className="text-blue-400"/>
                    <span>{item.name}</span>
                  </Link>
                );
              })}

            </div>

          </div>

          {/* Services */}

          <div>

            <h3 className="text-2xl font-bold mb-8">

              Popular Services

            </h3>

            <div className="space-y-4 text-gray-400">

              <div className="flex items-center gap-2">
                <Fingerprint size={18} className="text-blue-400" />
                <p>Aadhaar Services</p>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-blue-400" />
                <p>PAN Card</p>
              </div>

              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-400" />
                <p>Passport Service</p>
              </div>

              <div className="flex items-center gap-2">
                <Banknote size={18} className="text-blue-400" />
                <p>Banking Services</p>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-400" />
                <p>Ayushman Card</p>
              </div>

              <div className="flex items-center gap-2">
                <Leaf size={18} className="text-blue-400" />
                <p>PM Kisan</p>
              </div>

              <div className="flex items-center gap-2">
                <Zap size={18} className="text-blue-400" />
                <p>Electricity Bill</p>
              </div>

              <div className="flex items-center gap-2">
                <Award size={18} className="text-blue-400" />
                <p>Government Schemes</p>
              </div>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-2xl font-bold mb-8">

              Contact Us

            </h3>

            <div className="space-y-6">

              <div className="flex gap-4">

                <MapPin className="text-blue-500 mt-1" />

                <p className="text-gray-400 leading-7">

                  CSC Digital Seva Center
                  <br />
                  Vijaypur, Kulphar Mahoba
                  <br />
                  Uttar Pradesh - 210426

                </p>

              </div>

              <div className="flex gap-4">

                <Phone className="text-blue-500" />

                <p className="text-gray-400">

                  +91 9584805472

                </p>

              </div>

              <div className="flex gap-4">

                <Mail className="text-blue-500" />

                <p className="text-gray-400">
                  pradeepsinghrajpoot4@gmail.com
                </p>

              </div>

            </div>

            {/* Newsletter */}

            <div className="mt-10">

              <h4 className="font-semibold mb-4">

                Subscribe Newsletter

              </h4>

              <div className="flex">

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded rounded-r-none bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
                />

                <button className="bg-blue-500 hover:bg-blue-600 px-5 rounded rounded-l-none transition">

                  <Send size={20} />

                </button>

              </div>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-slate-800 my-12"></div>

        {/* Bottom */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <p className="text-gray-400 text-center">

            © {new Date().getFullYear()} CSC Digital Seva Center. All Rights Reserved.

          </p>

          <div className="flex gap-8 text-gray-400">

            <button className="hover:text-blue-500 transition">
              Privacy Policy
            </button>

            <button className="hover:text-blue-500 transition">
              Terms & Conditions
            </button>

            <button className="hover:text-blue-500 transition">
              Support
            </button>

          </div>

        </div>

      </div>

      {/* Back to Top */}

      <button
        onClick={scrollTop}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
      >

        <ArrowUp size={24} />

      </button>

    </footer>
  );
};

export default Footer;

'use client';
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  LinkIcon,
  BookOpen,
  ImagePlus,
  ScanLine,
  Landmark,
} from "lucide-react";

import Link from "next/link"
import Image from "next/image";

import { usePathname } from "next/navigation";
import MobileNavBar  from "./(mobile-navigation)/page";
export const navLinks = [
  {
    name: "Govt. Portal",
    href: "/govtPortal",
    icon: Landmark,
  },
  {
    name: "Merge Two Image",
    href: "/mergeTwoImage",
    icon: ImagePlus,
  },
  {
    name: "Scan to PDF",
    href: "/multiScan",
    icon: ScanLine,
  },
  {
    name: "Passbook",
    href: "/passbook",
    icon: BookOpen,
  },
];

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 40);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);


  const pathname = usePathname();


  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md transition-all duration-300 ${scrolled ? "py-3 shadow-sm" : "py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center">

          {/* Logo */}

          <Link href={"/"} className="flex items-center gap-3">

            <Image
              src="/logo.png"
              alt="Rajput Common Service Centre logo"
              width={56}
              height={56}
              priority
              className="h-12 w-12 shrink-0 rounded-full sm:h-14 sm:w-14"
            />

            <div>

              <h2 className="font-bold text-xl text-slate-800">
                CSC Digital Center
              </h2>

              <p className="text-xs text-gray-500">
                Government Authorized Service Center
              </p>

            </div>

          </Link>

          {/* Desktop Menu */}

          <nav className="hidden lg:flex items-center gap-1">

            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-white" : "text-blue-600"}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link href="https://digitalseva.csc.gov.in/" target="_blank" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-sm font-semibold transition">

              <LinkIcon size={18} />
              CSC PORTAL
            </Link>

          </nav>

          {/* Mobile Button */}
          <div className="lg:hidden">

        <MobileNavBar/>
          </div>

        </div>

      </div>

      {/* Mobile Menu */}

      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileMenu ? "max-h-125" : "max-h-0"
          }`}
      >
        <div className="bg-white shadow-xl border-t mt-3">

          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="w-full text-left px-6 py-4 border-b hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {item.name}
            </Link>
          ))}

          <div className="p-6">

            <Link href="https://digitalseva.csc.gov.in/" target="_blank" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold">

              CSC

            </Link>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;

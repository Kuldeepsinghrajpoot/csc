"use client"

import React from 'react'
import { ChevronRight, CheckCircle2, IndianRupee } from 'lucide-react'
import Link from 'next/link'
import { centerInfo, services } from '@/lib/siteData'

const handleScroll = (e: any, targetId: string) => {
  e.preventDefault();
  const element = document.getElementById(targetId.replace('#', ''));
  if (element) element.scrollIntoView({ behavior: 'smooth' });
}

const RevealOnScroll = ({ children, delay = 0, className = "" }: any) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<any>(null);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(entry.target); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => { if (ref.current) obs.unobserve(ref.current); };
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}>
      {children}
    </div>
  )
}

export default function HomeView() {
  return (
    <>
      <section id="home" className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-blue-100">Authorized Digital Seva Kendra</span>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                  Government Services <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Made Simple</span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <p className="text-lg text-blue-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Welcome to <strong>{centerInfo.centerName}</strong>. Your trusted local partner for Aadhaar, Banking, Pan Cards, and over 100+ digital services right in your neighborhood.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/payment" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                    <IndianRupee size={20} /> Pay Online
                  </Link>
                  <a href="#services" onClick={(e) => handleScroll(e, '#services')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-lg font-bold transition backdrop-blur-sm">Our Services</a>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={400}>
                <div className="pt-8 border-t border-white/10 flex flex-wrap gap-8 justify-center lg:justify-start text-sm font-medium text-blue-200">
                  <div className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> Licensed VLE</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> Secure & Fast</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> Trusted by 1000+ Locals</div>
                </div>
              </RevealOnScroll>
            </div>

            <div className="hidden lg:block relative">
              <RevealOnScroll delay={500} className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-30 blur-2xl animate-pulse"></div>
                <div className="relative bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-slate-400 text-sm">csc.gov.in Portal Access</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-700 rounded w-1/2" />
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="bg-slate-700/50 p-4 rounded-lg h-32" />
                      <div className="bg-slate-700/50 p-4 rounded-lg h-32" />
                      <div className="bg-slate-700/50 p-4 rounded-lg h-32" />
                      <div className="bg-slate-700/50 p-4 rounded-lg h-32" />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg">We provide a comprehensive range of G2C (Government to Citizen) and B2C services. Get your work done quickly, securely, and correctly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: any, index: number) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden h-full">
                  {service.badge && (<div className="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">{service.badge}</div>)}
                  <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300`}><service.icon size={28} /></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">{service.description}</p>
                  <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition text-sm mt-auto">Enquire Now <ChevronRight size={16} /></a>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-blue-50 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Pradeep CSC?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm h-full">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><CheckCircle2 size={24} /></div>
              <h3 className="font-bold text-lg mb-2">Authorized VLE</h3>
              <p className="text-gray-600">Officially registered Village Level Entrepreneur with valid CSC ID.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm h-full">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><CheckCircle2 size={24} /></div>
              <h3 className="font-bold text-lg mb-2">Digital Payments</h3>
              <p className="text-gray-600">We accept UPI, AEPS, and Cards. Fully digital and transparent receipts.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm h-full">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><CheckCircle2 size={24} /></div>
              <h3 className="font-bold text-lg mb-2">Quick Service</h3>
              <p className="text-gray-600">Minimal waiting time. We value your time and ensure fast processing.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

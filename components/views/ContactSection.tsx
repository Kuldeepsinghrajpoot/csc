"use client"

import React from 'react'
import { Mail, Phone } from 'lucide-react'
import { centerInfo } from '@/lib/siteData'

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
        <p className="text-gray-600 mb-8">Visit our center or call us for assistance with documents, payments, and applications.</p>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full"><Phone size={20} className="text-blue-600" /></div>
              <div className="text-left">
                <div className="font-bold text-lg">Call Us</div>
                <div className="text-gray-600">{centerInfo.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full"><Mail size={20} className="text-blue-600" /></div>
              <div className="text-left">
                <div className="font-bold text-lg">Email</div>
                <div className="text-gray-600">{centerInfo.email}</div>
              </div>
            </div>

            <div className="text-left">
              <div className="font-bold text-lg">Visit</div>
              <div className="text-gray-600">{centerInfo.location}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

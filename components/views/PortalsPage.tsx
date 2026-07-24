"use client"

import React from 'react'
import { ArrowRight, Globe, ExternalLink } from 'lucide-react'
import { upPortals, centerInfo } from '@/lib/siteData'

export default function PortalsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <div className="relative bg-blue-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Vidhan_Bhavan_Lucknow_1.jpg" alt="Uttar Pradesh Vidhan Bhavan" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="flex items-center text-blue-100 hover:text-white mb-6 transition group">
            <ArrowRight className="rotate-180 mr-2 group-hover:-translate-x-1 transition" size={20} /> Back to Home
          </button>
          <div className="flex items-center gap-4 mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Seal_of_Uttar_Pradesh.svg" alt="UP Seal" className="w-16 h-16 drop-shadow-lg" />
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white tracking-tight">Uttar Pradesh</h1>
              <p className="text-xl text-blue-100 font-medium">Government Services Portal</p>
            </div>
          </div>
          <p className="text-blue-100 max-w-2xl text-lg">One-stop access to e-District, Bhulekh, Ration Card, and other essential citizen services.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {upPortals.map((portal, index) => (
            <a key={index} href={portal.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Globe size={20} /></div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500 transition" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition">{portal.name}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">{portal.desc}</p>
              <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded truncate">{portal.url.replace('https://', '')}</div>
            </a>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 border border-gray-200 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need help with these portals?</h3>
          <p className="text-gray-600 mb-6">Most of these services require technical knowledge, Hindi typing, or biometric authentication. Visit our center for hassle-free processing.</p>
          <button onClick={onBack} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">Visit {centerInfo.centerName}</button>
        </div>
      </div>
    </div>
  )
}

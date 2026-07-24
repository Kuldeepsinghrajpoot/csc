"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Globe, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="https://www.digitalindiagov.in/wp-content/uploads/2021/05/images.png" className="w-12 h-12 rounded-lg" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-none">Digital Seva</span>
              <span className="text-xs text-blue-600 font-bold tracking-wider mt-1">COMMON SERVICE CENTER</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
            <a href="#services" className="text-gray-600 hover:text-blue-600 font-medium">Services</a>
            <Link href="/merge-two-image" className="text-gray-600 hover:text-blue-600 font-medium">Merge Two Images</Link>
           
          </nav>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/" className="block w-full px-3 py-3 rounded-md text-base font-medium text-gray-700">Home</Link>
            <a href="#services" className="block w-full px-3 py-3 rounded-md text-base font-medium text-gray-700">Services</a>
            <Link href="/merge-two-image" className="block w-full px-3 py-3 rounded-md text-base font-medium text-gray-700">Merge Two Images</Link>
            <Link href="/payment" className="block w-full px-3 py-3 rounded-md text-base font-medium text-gray-700">Pay Online</Link>
          </div>
        </div>
      )}
    </header>
  )
}

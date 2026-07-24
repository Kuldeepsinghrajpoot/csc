export const metadata = { title: "About - Pradeep CSC" };

import React from 'react'

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-6">About Pradeep CSC</h1>
      <p className="text-lg text-gray-700 mb-4">Pradeep CSC & Digital Seva Kendra is a local common service center providing government and digital services to the community. We help citizens with Aadhaar, PAN, utility payments, and many other government-to-citizen services.</p>
      <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
        <p className="text-gray-600">To simplify access to essential government services for rural and urban users by offering assisted digital services at an affordable cost.</p>
      </section>
    </main>
  )
}

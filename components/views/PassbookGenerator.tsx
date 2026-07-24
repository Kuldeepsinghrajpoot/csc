"use client"

import React, { useState } from 'react'
import { ArrowRight, Printer, Upload, CheckCircle2, Landmark } from 'lucide-react'
import { banks as siteBanks, centerInfo } from '@/lib/siteData'

export default function PassbookGenerator({ onBack }: { onBack: () => void }) {
  const [selectedBank, setSelectedBank] = useState<keyof typeof siteBanks>('airtel')
  const [details, setDetails] = useState({ name: 'Pradeep Singh', fatherName: 'Rajendra Singh', accountNo: '9876543210', ifsc: 'AIRP0000001', mobile: '9876543210', address: 'Dharampura, Madhya Pradesh', cif: '12345678', dob: '01/01/1990' })
  const [image, setImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) setImage(URL.createObjectURL(file)) }
  const handlePrint = () => window.print()
  const currentBank = siteBanks[selectedBank]

  return (
    <div className="min-h-screen bg-slate-100 pb-12 animate-in slide-in-from-right duration-300">
      <div className="bg-blue-700 text-white py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="hover:bg-blue-600 p-2 rounded-full transition"><ArrowRight className="rotate-180" /></button>
            <div>
              <h1 className="text-2xl font-bold">Passbook Generator</h1>
              <p className="text-blue-200 text-sm">Create printable passbooks for customers</p>
            </div>
          </div>
          <button onClick={handlePrint} className="bg-white text-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-50 transition"><Printer size={18} /> Print Passbook</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit print:hidden">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Customer Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
              <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value as keyof typeof siteBanks)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                {Object.entries(siteBanks).map(([key, bank]) => (<option key={key} value={key}>{bank.name}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name</label>
                <input type="text" value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Father's Name</label>
                <input type="text" value={details.fatherName} onChange={e => setDetails({ ...details, fatherName: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Account No.</label>
                <input type="text" value={details.accountNo} onChange={e => setDetails({ ...details, accountNo: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">IFSC Code</label>
                <input type="text" value={details.ifsc} onChange={e => setDetails({ ...details, ifsc: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Customer Photo</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition"><Upload size={16} /> Upload Photo<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
                {image && <span className="text-xs text-green-600 font-bold">Photo Uploaded</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="mb-4 text-sm text-gray-500 print:hidden flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Live Preview (Standardized Format)</div>
          <div className="w-[800px] h-[480px] bg-white border-2 border-gray-300 shadow-xl print:shadow-none print:border-0 print:w-full print:h-auto overflow-hidden relative">
            <div className={`${currentBank.color} ${currentBank.text} p-6 flex justify-between items-center h-24`}>
              <div className="flex items-center gap-4"><div className="bg-white/20 p-2 rounded-lg"><Landmark size={40} className="text-white" /></div><div><h1 className="text-3xl font-bold uppercase tracking-wide">{currentBank.logoText}</h1><p className="text-sm opacity-90 uppercase tracking-widest text-xs">Payments Bank</p></div></div>
              <div className="text-right"><p className="text-sm opacity-80">CSP Code: {centerInfo.cscId}</p><p className="text-xs opacity-70">{centerInfo.location}</p></div>
            </div>
            <div className="p-8 flex gap-8">
              <div className="w-32 flex flex-col items-center gap-2"><div className="w-32 h-40 border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">{image ? <img src={image} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs text-center px-2">Paste Photo Here</span>}</div><p className="text-[10px] text-gray-500 text-center">Authorized Signatory</p></div>
              <div className="flex-1"><h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 uppercase">Identity Card / Mini Passbook</h2><table className="w-full text-sm"><tbody><tr className="border-b border-gray-100"><td className="py-2 text-gray-500 w-1/3 font-medium">Account Holder Name</td><td className="py-2 text-gray-900 font-bold uppercase">{details.name}</td></tr><tr className="border-b border-gray-100"><td className="py-2 text-gray-500 font-medium">Account Number</td><td className="py-2 text-gray-900 font-bold tracking-wider text-lg">{details.accountNo}</td></tr><tr className="border-b border-gray-100"><td className="py-2 text-gray-500 font-medium">IFSC Code</td><td className="py-2 text-gray-900 font-bold">{details.ifsc}</td></tr><tr className="border-b border-gray-100"><td className="py-2 text-gray-500 font-medium">Mobile Number</td><td className="py-2 text-gray-900 font-bold">{details.mobile}</td></tr></tbody></table></div>
            </div>
            <div className="absolute bottom-0 w-full bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-end"><div className="text-xs text-gray-400"><p>Generated at: {centerInfo.centerName}</p><p>Date: {new Date().toLocaleDateString()}</p></div><div className="text-center"><div className="h-12 w-32 border-b border-gray-400 mb-1"></div><p className="text-xs font-bold text-gray-600 uppercase">Bank Official Seal & Sign</p></div></div>
          </div>
          <p className="mt-8 text-xs text-gray-400 text-center max-w-lg print:hidden">Note: This is a generated mini-passbook for CSP reference. Ensure all details match official bank records before issuing to customer.</p>
        </div>
      </div>
    </div>
  )
}

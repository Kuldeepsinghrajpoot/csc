'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  CheckCircle2, 
  Clock, 
  Send, 
  Search,
  ArrowUpRight,
  MoreVertical,
  Wallet,
  CreditCard,
  User,
  Mail,
  DollarSign
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_REQUESTS = [
  { id: '1', recipient: 'alex.smith@example.com', amount: 450.00, status: 'accepted', date: '2023-10-24', description: 'Web Design Project' },
  { id: '2', recipient: 'sarah.jones@example.com', amount: 1200.50, status: 'pending', date: '2023-10-25', description: 'Consulting Services' },
  { id: '3', recipient: 'marketing@corp.com', amount: 85.00, status: 'pending', date: '2023-10-26', description: 'SaaS Subscription' },
  { id: '4', recipient: 'dev@studio.io', amount: 2500.00, status: 'accepted', date: '2023-10-22', description: 'Backend Integration' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [formData, setFormData] = useState({ recipient: '', amount: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // --- Handlers ---
  interface FormData {
    recipient: string;
    amount: string;
    description: string;
  }

  interface PaymentRequest {
    id: string;
    recipient: string;
    amount: number;
    description: string;
    status: 'pending' | 'accepted';
    date: string;
  }

  const handleCreateRequest = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newReq: PaymentRequest = {
        id: Math.random().toString(36).substr(2, 9),
        recipient: formData.recipient,
        amount: parseFloat(formData.amount),
        description: formData.description || 'General Payment',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      
      setRequests([newReq, ...requests]);
      setFormData({ recipient: '', amount: '', description: '' });
      setIsSubmitting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setActiveTab('history');
    }, 800);
  };

  // --- Components ---

  const Badge = ({ status }: { status: 'pending' | 'accepted' }) => {
    const isAccepted = status === 'accepted';
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit
        ${isAccepted ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
        {isAccepted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={20} />
          <span>Payment request sent successfully!</span>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Wallet className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                PayFlow
              </span>
            </div>
            
            <div className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => setActiveTab('new')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${activeTab === 'new' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <PlusCircle size={18} />
                <span className="hidden sm:inline">New Request</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${activeTab === 'history' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <History size={18} />
                <span className="hidden sm:inline">History</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User size={18} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'new' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Create Payment Request</h1>
              <p className="text-slate-500 mt-2">Send a professional payment link to your client via the gateway.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <form onSubmit={handleCreateRequest} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Mail size={16} className="text-slate-400" />
                          Recipient Email
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="client@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                          value={formData.recipient}
                          onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <DollarSign size={16} className="text-slate-400" />
                          Request Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                          <input
                            required
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          Description (Optional)
                        </label>
                        <textarea
                          placeholder="Project name, invoice ID, etc."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                          ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send size={18} />
                            Generate & Send Request
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-lg">
                  <CreditCard className="mb-4 opacity-80" size={32} />
                  <h3 className="text-lg font-bold mb-2 text-white">Payment Gateway</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                    Your request will be processed through our secure gateway. Clients can pay via Credit Card, Apple Pay, or Bank Transfer.
                  </p>
                  <div className="bg-white/10 p-3 rounded-lg flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded">
                      <LayoutDashboard size={16} />
                    </div>
                    <span className="text-xs font-medium">Auto-synced with Prisma DB</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {requests.slice(0, 3).map(req => (
                      <div key={req.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <div className="truncate pr-4">
                          <p className="font-semibold text-slate-700 truncate">{req.recipient}</p>
                          <p className="text-xs text-slate-400">{req.date}</p>
                        </div>
                        <p className="font-bold text-slate-900">${req.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Request History</h1>
                <p className="text-slate-500 mt-1">Manage and track all generated payment links.</p>
              </div>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search email or amount..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all w-full sm:w-64"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.length > 0 ? (
                      requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                {req.recipient.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">{req.recipient}</p>
                                <p className="text-xs text-slate-400">{req.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900 text-sm">
                              ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge status={req.status as 'pending' | 'accepted'} />
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {req.date}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <ArrowUpRight size={18} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center text-slate-400">
                            <LayoutDashboard size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">No requests found</p>
                            <p className="text-sm">Start by creating your first payment request.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                <span>Showing {requests.length} results</span>
                <div className="flex gap-2">
                  <button disabled className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 transition-colors">Prev</button>
                  <button disabled className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 transition-colors">Next</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
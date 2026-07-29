'use client'
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Phone,
    IndianRupee,
    ChevronRight,
    QrCode,
    Loader2,
    ArrowLeft,
    ShieldCheck,
    CheckCircle2,

} from 'lucide-react';
import { requestSchema } from '@/app/schema/payment-request';

// --- Validation Schema ---

export default function App() {
    const [view, setView] = useState('home');


    const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: zodResolver(requestSchema),
        defaultValues: { amount: '' as unknown as string }
    });

    const onSubmit = async (data: z.infer<typeof requestSchema>) => {

        const newTx = {
            id: Math.random().toString(36).substring(7),
            ...data,
            // status: 'Success',
            // createdAt: Date.now(),
            // type: data.description.length > 15 ? 'General' : data.description
        };

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTx })
            });
            const result = await response.json();
            // alert(`${'Payment request generated and sent to customer via SMS!'} ${JSON.stringify(result)}`);
            if (response.status !== 200) {
                throw new Error(result.error || 'Failed to create payment request');
            }

            setView('success');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (view === 'success') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                <div className="w-full max-w-sm bg-white rounded-sm  p-10 text-center border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle2 size={40} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Request Active</h2>
                    <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                        Payment link generated successfully .
                    </p>

                    <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
                        <button
                            onClick={() => { setView('home'); reset(); }}
                            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-sm font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            New Request
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFB]  py-24 text-slate-900 font-sans selection:bg-indigo-100">
            {/* Minimal Header */}
          

            <main className="max-w-md mx-auto px-6 pt-8 pb-20">
                {/* Form Card */}
                <div className="bg-white rounded-sm border border-slate-200/60  overflow-hidden mb-8">
                    <div className="p-6 border-b border-slate-50">
                        <h2 className="text-lg font-bold">Collect Payment</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Enter transaction details to generate link</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                        {/* Customer Phone */}
                        

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Amount</label>
                            <div className="relative group">
                                <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <Controller
                                    name="amount"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            value={field.value as string | number}
                                            type="number"
                                            placeholder="0.00"
                                            className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-sm outline-none transition-all text-sm
                                                ${errors.amount ? 'border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-indigo-50'}`}
                                        />
                                    )}
                                />
                            </div>
                            {errors.amount && <p className="text-xs text-red-500 font-medium ml-1">{errors.amount.message}</p>}
                        </div>

                        {/* Purpose */}


                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-sm font-bold  shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Generate Link <ChevronRight size={18} /></>}
                        </button>
                    </form>
                </div>

                {/* History Section (Shadcn style) */}
                {/* <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <History size={14} /> Recent Transactions
                        </h3>
                        <button className="text-xs font-semibold text-indigo-600 hover:underline">View All</button>
                    </div>

                    <div className="space-y-2">
                        {history.map((tx) => (
                            <div key={tx.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-slate-200 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">+{tx.phone}</p>
                                        <p className="text-xs text-slate-400 font-medium">{tx.type} • {tx.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">₹{tx.amount}</p>
                                    <div className="flex items-center justify-end gap-1 mt-0.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className={`text-[10px] font-bold uppercase ${tx.status === 'Success' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Security Footer */}
                <footer className="mt-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 py-2 px-4 bg-slate-100/50 rounded-full border border-slate-200/50">
                        <ShieldCheck size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Verified Merchant Environment</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium px-10 leading-relaxed">
                        Secure 256-bit encryption. Payment processing via PhonePe PG integration.
                    </p>
                </footer>
            </main>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import CustomerForm from "@/components/CustomerForm";
import PassbookPreview from "@/components/PassbookPreview";
import { CustomerData } from "@/lib/types";

export default function PassbookPage() {

      useEffect(() => { document.title = "Passbook Generator" }, []);
  
  const [customer, setCustomer] = useState<CustomerData>({
    bank: "airtel",
    customerName: "",
    fatherName: "",
    accountNumber: "",
    ifsc: "",
    mobile: "",
    cif: "",
    address: "",
    photo: "",
  });

  return (
    <main className="min-h-screen bg-slate-100 py-28 ">
      <header className="bg-blue-700 py-5 rounded-sm max-w-7xl mx-auto">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Passbook Generator
            </h1>

            <p className="text-blue-100">
              Create Professional Banking Passbook
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.5fr] xl:grid-cols-[0.9fr_1.6fr]">
          <CustomerForm
            customer={customer}
            setCustomer={setCustomer}
          />

          <PassbookPreview
            customer={customer}
          />
        </div>
      </div>
    </main>
  );
}
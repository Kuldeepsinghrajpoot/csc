'use client'

import GovernmentCard from "@/components/GovernmentCard";
import { governmentPortals } from "@/app/data/governmentPortals";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => { document.title = "Government Portals" }, []);

  
  return (
    <main className=" px-4 py-48 bg-slate-50 sm:px-6 lg:px-8">

      <div className="mb-12 text-center h-48">
        <p className="text-2xl font-semibold uppercase tracking-[0.3em] text-blue-600">
          Government Portals
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Explore essential citizen services
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Quick access to India's major government portals for identity, finance, health, transport, and more.
        </p>
      </div>
     <div className="mx-auto max-w-7xl">

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {governmentPortals.map((portal) => (
          <GovernmentCard key={portal.id} portal={portal} />
        ))}
      </div>
     </div>
    </main>
  );
}


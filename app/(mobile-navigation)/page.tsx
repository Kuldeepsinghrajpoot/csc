"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { navLinks } from "../nav";

export function MobileNavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu size={22} />
        </Button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)} // Close the sheet
                className={`flex items-center gap-3 rounded px-6 py-3 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-blue-600"}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
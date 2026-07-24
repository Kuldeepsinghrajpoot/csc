"use client";

import { useEffect, useMemo, useState } from "react";
import { rtdb } from "../lib/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  CreditCard,
  Clock3,
  Wallet,
  ExternalLink,
} from "lucide-react";

export default function PendingPaymentDialog() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    let paymentsRef: any = null;

    (async () => {
      if (!rtdb) return;

      const db = await import("firebase/database");

      paymentsRef = db.ref(rtdb, "transactions");

      db.onValue(paymentsRef, (snapshot: any) => {
        if (!snapshot.exists()) {
          setPending([]);
          return;
        }

        const data = snapshot.val();

        const list = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((tx: any) => tx.status === "PENDING");

        setPending(list);
        setOpen(list.length > 0);
      });
    })();

    return () => {
      if (paymentsRef) {
        try {
          const db = require("firebase/database");
          db.off(paymentsRef);
        } catch {}
      }
    };
  }, []);

  const totalAmount = useMemo(() => {
    return pending.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
  }, [pending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">

        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-6 py-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet className="h-6 w-6" />
              </div>

              <div>
                <DialogTitle className="text-2xl font-bold">
                  Pending Payments
                </DialogTitle>

                <p className="text-sm text-orange-100">
                  Complete your pending payments before they expire.
                </p>
              </div>

            </div>

            <div className="text-right">
              <p className="text-xs text-orange-100">
                Pending
              </p>

              <p className="text-3xl font-bold">
                {pending.length}
              </p>
            </div>

          </div>

        </DialogHeader>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border-b">

          <div className="rounded-lg bg-white border p-3">
            <p className="text-xs text-muted-foreground">
              Pending Requests
            </p>

            <p className="text-2xl font-bold">
              {pending.length}
            </p>
          </div>

          <div className="rounded-lg bg-white border p-3">
            <p className="text-xs text-muted-foreground">
              Total Amount
            </p>

            <p className="text-2xl font-bold text-green-600">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>

        </div>

        {/* Payment List */}
        <div className="max-h-[420px] overflow-y-auto p-4 space-y-2">

          {pending.map((tx) => (

            <div
              key={tx.id}
              className="flex items-center justify-between rounded-lg border bg-white p-3  hover:shadow-md transition"
            >

              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">

                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>

                <div className="min-w-0">

                  <p className="font-medium text-sm truncate">
                    {tx.orderId}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock3 className="h-3 w-3" />
                    {new Date(tx.expireAt).toLocaleString()}
                  </div>

                </div>

              </div>

              {/* Right */}
              <div className="flex items-center gap-4">

                <div className="text-right">

                  <p className="text-xs text-muted-foreground">
                    Amount
                  </p>

                  <p className="font-bold text-green-600">
                    ₹{Number(tx.amount).toLocaleString()}
                  </p>

                </div>

                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    window.open(tx.redirectUrl, "_blank")
                  }
                >
                  Pay
                  <ExternalLink className="h-4 w-4" />
                </Button>

              </div>

            </div>

          ))}

        </div>

        <DialogFooter className="border-t bg-slate-50 px-4 py-3">

          <DialogClose asChild>

            <Button variant="outline">
              Close
            </Button>

          </DialogClose>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
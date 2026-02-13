"use client";

import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { rtdb } from "../lib/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PendingPaymentDialog() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    const paymentsRef = ref(rtdb, "transactions");

    const unsub = onValue(paymentsRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();

      const list = Object.keys(data)
        .map((key) => ({
          id: key,
          ...data[key],
        }))
        .filter((tx) => tx.status === "PENDING"); // ✅ correct field

      if (list.length > 0) {
        setPending(list);
        setOpen(true);
      }
    });

    return () => off(paymentsRef);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pending Payments</DialogTitle>
          <DialogDescription>
            Complete the following payment requests
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4  overflow-y-auto">
          {pending.map((tx) => (
            <div
              key={tx.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{tx.orderId}</p>
                <p className="text-xs text-muted-foreground">
                  Expires: {new Date(tx.expireAt).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Amount: ₹{ Number(tx.amount)}
                </p>
              </div>

              <Button
                onClick={() => window.open(tx.redirectUrl, "_blank")}
              >
                Pay Now
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

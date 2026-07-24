import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // PhonePe sends raw body
    const bodyText = await req.text();
    const data = JSON.parse(bodyText);

    console.log("🔥 Webhook received:", data);

    // ✅ Correct field from PhonePe
    const phonepeOrderId = data?.payload?.orderId;
    const state = data?.payload?.state;
    const phonepeTxId =
      data?.payload?.paymentDetails?.[0]?.transactionId || null;

    // PhonePe sends amount in paise
    const amountRupees = (data?.payload?.amount || 0) / 100;

    if (!phonepeOrderId) {
      console.log("❌ No orderId in webhook");
      return new NextResponse("OK", { status: 200 });
    }

    // ✅ Find using the orderId you stored earlier
    const snap = await db
      .ref("transactions")
      .orderByChild("orderId")
      .equalTo(phonepeOrderId)
      .once("value");

    if (!snap.exists()) {
      console.log("❌ No matching transaction in DB:", phonepeOrderId);
      return new NextResponse("OK", { status: 200 });
    }

    const key = Object.keys(snap.val())[0];
    const existing = snap.val()[key];

    // ✅ Idempotent (PhonePe retries webhook many times)
    if (existing.status === "SUCCESS") {
      console.log("⚠️ Already marked SUCCESS:", phonepeOrderId);
      return new NextResponse("OK", { status: 200 });
    }

    if (state === "COMPLETED") {
      await db.ref(`transactions/${key}`).update({
        status: "SUCCESS",
        state: "SUCCESS",
        phonepeTransactionId: phonepeTxId,
        amount: amountRupees,
        paidAt: Date.now(),
      });

      console.log("✅ Payment marked SUCCESS:", phonepeOrderId);
    } else {
      console.log("ℹ️ State not completed:", state);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (e) {
    console.error("❌ Webhook error:", e);
    return new NextResponse("OK", { status: 200 });
  }
}

export async function GET() {
  return new NextResponse("Webhook alive", { status: 200 });
}

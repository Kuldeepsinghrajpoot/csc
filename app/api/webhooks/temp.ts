import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/phonepay";
import { db } from "@/app/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization") || "";
    const bodyText = await req.text();

    try {
        // ✅ 1. Validate PhonePe signature
        const isValid = await client.validateCallback(
            // "pradeepcsc", 
            process.env.PHONEPE_WEBHOOK_USERNAME!,
            // "SUK7pFm6uJ47Kpi"!,
            process.env.PHONEPE_WEBHOOK_PASSWORD!,
            authHeader,
            bodyText
        );

        if (!isValid) {
            return new NextResponse("Invalid Signature", { status: 401 });
        }

        // ✅ 2. Parse webhook body
        const data = JSON.parse(bodyText);
        const payment = data.response;

        const merchantOrderId = payment.merchantOrderId;

        console.log("Webhook for Order:", merchantOrderId);

        // ✅ 3. Find transaction in Realtime DB by orderId
        const snapshot = await db
            .ref("transactions")
            .orderByChild("orderId")
            .equalTo(merchantOrderId)
            .once("value");

        if (!snapshot.exists()) {
            console.log("Order not found in DB");
            return new NextResponse("OK", { status: 200 });
        }

        const firebaseKey = Object.keys(snapshot.val())[0];
        const orderRef = db.ref(`transactions/${firebaseKey}`);
        const orderData = snapshot.val()[firebaseKey];

        // 🛑 4. Idempotency check (already processed)
        if (orderData.status === "SUCCESS") {
            console.log("Already processed:", merchantOrderId);
            return new NextResponse("OK", { status: 200 });
        }

        // ✅ 5. Verify payment from PhonePe (source of truth)
        const status = await client.getOrderStatus(merchantOrderId);

        console.log("PhonePe Status:", status.state);

        if (status.state === "COMPLETED") {
            await orderRef.update({
                status: "SUCCESS",
                phonepeTransactionId: status.paymentDetails?.[0]?.transactionId || null,
                paidAt: Date.now(),
            });

            console.log("✅ Payment marked SUCCESS");
        } else if (status.state === "FAILED") {
            await orderRef.update({
                status: "FAILED",
            });

            console.log("❌ Payment marked FAILED");
        }

        // ✅ 6. Always return 200 to PhonePe
        return new NextResponse("OK", { status: 200 });

    } catch (err) {
        console.error("Webhook error:", err);
        return new NextResponse("Error", { status: 500 });
    }
}

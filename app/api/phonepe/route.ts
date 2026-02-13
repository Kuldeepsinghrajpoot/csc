import { NextResponse } from "next/server";
import { fetchPhonePeToken } from "../route";
import { db } from "@/app/lib/firebaseAdmin";
export async function POST(req: Request) {
    try {
        const { amount } = await req.json();
        const { access_token } = await fetchPhonePeToken();
        if (!access_token) {
            return NextResponse.json({
                error: "Failed to retrieve access token",
            });
        }
        // console.log(token?.refresh_token);
        const merchantOrderId = `TX${Date.now()}`; // Dynamically generate ID
        const res = await fetch(
            "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    merchantOrderId: merchantOrderId,
                    amount: amount * 100,
                    expireAfter: 1200,
                    paymentFlow: {
                        type: "PG_CHECKOUT",
                        message: "Payment message used for collect requests",
                        merchantUrls: {
                            redirectUrl: "http://localhost:3000/",
                        },
                        disablePaymentRetry: true,
                        paymentModeConfig: {
                            enabledPaymentModes: [
                                
                                {
                                    type: "UPI_QR",
                                },
                                {
                                    type: "NET_BANKING",
                                },
                                
                            ],
                        },
                    },
                    metaInfo: {
                        udf1: "additional-information-1",
                        udf2: "additional-information-2",
                        udf3: "additional-information-3",
                        udf4: "additional-information-4",
                        udf5: "additional-information-5",
                        udf6: "additional-information-6",
                        udf7: "additional-information-7",
                        udf8: "additional-information-8",
                        udf9: "additional-information-9",
                        udf10: "additional-information-10",
                        udf11: "additional-information-11",
                        udf12: "additional-information-12",
                        udf13: "additional-information-13",
                        udf14: "additional-information-14",
                        udf15: "additional-information-15",
                    },
                }),
            },
        );
        const data = await res.json();
        // console.log("PhonePe Payment Response:", data);
        if (!data.orderId) {
            return NextResponse.json({
                message: "Payment initiated not successfully",
            });
            // console.log("Payment initiated successfully with ID:", merchantOrderId);
        }
        const store = await db.ref("transactions").push({ 
          amount, orderId: data.orderId, status: "PENDING", expireAt: Date.now() + 1200 * 1000, redirectUrl: data.redirectUrl,
           });

        if (data.success) {
        }
        return NextResponse.json({ store });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

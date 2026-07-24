import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebaseAdmin";
import { fetchPhonePeToken } from "../phone-pay-token/fetchPhonePeToken";

export const runtime = "nodejs";

export async function GET() {
    try {
        const snapshot = await db.ref("transactions").once("value");
        if (!snapshot.exists()) {
            return NextResponse.json({ transactions: [] });
        }

        const data = snapshot.val();
        const { access_token } = await fetchPhonePeToken();

        const pendingTx = Object.keys(data)
            .map((key) => ({ firebaseId: key, ...data[key] }))
            .filter((tx) => tx.status === "PENDING" || tx.state === "PENDING");

        console.log("Pending count:", pendingTx.length);

        const results = await Promise.all(
            pendingTx.map(async (tx) => {
                try {
                    const res = await fetch(
                        `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${tx.orderId}/status`,
                        {
                            headers: {
                                Authorization: `O-Bearer ${access_token}`,
                            },
                        },
                    );

                    const statusData = await res.json();

                    if (statusData.state === "COMPLETED") {
                        const updates = {
                            status: "PAID",
                            state: "SUCCESS",
                            paidAt: new Date().toISOString(),
                        };

                        await db
                            .ref(`transactions/${tx.firebaseId}`)
                            .update(updates);
                        return { ...tx, ...updates };
                    }

                    return tx;
                } catch {
                    return tx;
                }
            }),
        );

        return NextResponse.json({ updated: results.length });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

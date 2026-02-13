// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebaseAdmin";
import { fetchPhonePeToken } from "../phone-pay-token/route"; 

export async function GET() {
    try {
        const snapshot = await db.ref("transactions").once("value");
        if (!snapshot.exists()) return NextResponse.json({ transactions: [] });

        const data = snapshot.val();
        const { access_token } = await fetchPhonePeToken();

        const allTransactions = Object.keys(data).map((key) => ({
            firebaseId: key,
            ...data[key],
        }));

        // Loop and update records that are still PENDING
        const updatedTransactions = await Promise.all(
            allTransactions.map(async (tx) => {
                // Adjust this check based on your exact data structure (e.g., tx.data.state)
                if (tx.state !== "PENDING" && tx.status !== "PENDING") return tx;

                try {
                    const statusRes = await fetch(
                        `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${tx.orderId}/status`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `O-Bearer ${access_token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const statusData = await statusRes.json();

                    // If PhonePe state is COMPLETED, update Firebase
                    if (statusData.state === "COMPLETED") {
                        const updates: any = { 
                            status: "PAID", 
                            state: "SUCCESS", // Updating the specific field your UI filters for
                            paidAt: new Date().toISOString() 
                        };
                        
                        // Use the update method to change only specific fields without overwriting
                        await db.ref(`transactions/${tx.firebaseId}`).update(updates);
                        return { ...tx, ...updates };
                    }
                    return tx;
                } catch (err) {
                    return tx;
                }
            })
        );

        return NextResponse.json({ transactions: updatedTransactions });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
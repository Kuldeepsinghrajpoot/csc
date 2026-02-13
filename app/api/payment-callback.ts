import { NextResponse, NextRequest } from "next/server";
import { client } from "@/app/lib/phonepay";
export async function POST(req: NextRequest) {
  try {
    // 1. Get the Authorization header and the raw body
    const authHeader = req.headers.get("Authorization") || "";
    const bodyText = await req.text(); // PhonePe sends the body as a string

    // 2. Use the SDK to validate the callback
    // NOTE: 'username' and 'password' are the ones you set in the PhonePe Dashboard for webhooks
    const isValid = await client.validateCallback(
      process.env.PHONEPE_WEBHOOK_USERNAME!,
      process.env.PHONEPE_WEBHOOK_PASSWORD!,
      authHeader,
      bodyText
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
    }

    // 3. Parse the validated data
    const callbackData = JSON.parse(bodyText);
    const { orderId, state, amount } = callbackData.payload;

    if (state === "COMPLETED") {
      // ✅ PAYMENT SUCCESSFUL
      // Update your database (e.g., mark order as paid)
      console.log(`Order ${orderId} was successful for amount ${amount}`);
    } else {
      // ❌ PAYMENT FAILED
      console.log(`Order ${orderId} failed with state: ${state}`);
    }

    // 4. Always respond with 200 OK to PhonePe so they stop retrying
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("Callback Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
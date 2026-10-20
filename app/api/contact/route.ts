import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { centerInfo } from "@/lib/siteData";

// ---------------------------------------------------------------------------
// Resend setup (set these in .env / your hosting dashboard)
//   RESEND_API_KEY      required
//   RESEND_FROM_EMAIL   e.g. "Pradeep CSC <noreply@yourdomain.com>"  (domain must be verified in Resend)
//   OWNER_EMAIL         where new leads are delivered
// Without a verified domain Resend only lets "onboarding@resend.dev" send to the
// email address of your own Resend account, so customer auto-replies will not arrive.
// ---------------------------------------------------------------------------
const FROM = process.env.RESEND_FROM_EMAIL || `${centerInfo.centerName} <onboarding@resend.dev>`;
const OWNER = process.env.OWNER_EMAIL || "ayush741555@gmail.com";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(120),
  service: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(2000),
});

// Stops visitors from injecting HTML into the emails
const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the form details" }, { status: 400 });
    }

    const name = esc(parsed.data.name);
    const phone = esc(parsed.data.phone);
    const service = esc(parsed.data.service);
    const message = esc(parsed.data.message).replace(/\n/g, "<br />");
    const email = parsed.data.email;

    // 1) Lead email to the owner (reply goes straight to the customer)
    const { error: adminError } = await resend.emails.send({
      from: FROM,
      to: OWNER,
      replyTo: email,
      subject: `New Lead: ${parsed.data.service} request from ${parsed.data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; color: #333;">
          <div style="background-color: #2563eb; padding: 24px; text-align: center;">
            <h2 style="margin: 0; color: #ffffff; font-size: 24px;">New Service Request</h2>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-bottom: 24px;">You have received a new booking request from your website.</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 12px 0; font-weight: bold; width: 120px;">Name:</td><td style="padding: 12px 0;">${name}</td></tr>
              <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 12px 0; font-weight: bold;">Phone:</td><td style="padding: 12px 0;">${phone}</td></tr>
              <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 12px 0; font-weight: bold;">Email:</td><td style="padding: 12px 0;">${esc(email)}</td></tr>
              <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 12px 0; font-weight: bold;">Service:</td><td style="padding: 12px 0;"><span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: bold;">${service}</span></td></tr>
            </table>
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #374151;">Message:</h3>
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">
              <p style="margin: 0; line-height: 1.5;">${message}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (adminError) {
      console.error("Resend (owner email) error:", adminError);
      return NextResponse.json({ error: adminError.message }, { status: 400 });
    }

    // 2) Auto-reply to the customer. A failure here must not fail the booking.
    try {
      const { error: userError } = await resend.emails.send({
        from: FROM,
        to: email,
        subject: `We received your request - ${centerInfo.centerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; color: #333;">
            <div style="background-color: #2563eb; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">${esc(centerInfo.centerName)}</h1>
            </div>
            <div style="padding: 32px; background-color: #ffffff;">
              <h2 style="margin-top: 0; color: #1f2937;">Hello ${name},</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Thank you for reaching out to us regarding <strong>${service}</strong>.</p>
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">We have received your details. One of our team members will contact you shortly at <strong>${phone}</strong>.</p>
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Best Regards,</p>
                <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #374151;">${esc(centerInfo.centerName)}</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">${esc(centerInfo.location)}</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">${esc(centerInfo.phone)}</p>
              </div>
            </div>
          </div>
        `,
      });
      if (userError) console.error("Resend (auto-reply) error:", userError);
    } catch (userEmailError) {
      console.error("Failed to send auto-reply:", userEmailError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

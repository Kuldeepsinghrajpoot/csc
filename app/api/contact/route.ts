import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, phone, email, service, message } = data;

    // =======================================================================
    // 1. EMAIL SENT TO YOU (THE OWNER)
    // =======================================================================
    const { error: adminError } = await resend.emails.send({
      from: "CSC Digital Seva <onboarding@resend.dev>", 
      to: "ayush741555@gmail.com", // <-- Your owner email is set here
      subject: `New Lead: ${service} request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; color: #333;">
          <div style="background-color: #2563eb; padding: 24px; text-align: center;">
            <h2 style="margin: 0; color: #ffffff; font-size: 24px;">New Service Request</h2>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-bottom: 24px;">You have received a new booking request from your website.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 12px 0;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 12px 0;">${phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Email:</td>
                <td style="padding: 12px 0;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold;">Service:</td>
                <td style="padding: 12px 0;">
                  <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: bold;">
                    ${service}
                  </span>
                </td>
              </tr>
            </table>

            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #374151;">Message:</h3>
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">
              <p style="margin: 0; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>
          </div>
        </div>
      `,
    });

    if (adminError) {
      console.error("Admin Email Error:", adminError);
      return NextResponse.json({ error: adminError.message }, { status: 400 });
    }

    // =======================================================================
    // 2. AUTO-REPLY SENT TO THE USER
    // =======================================================================
    try {
      await resend.emails.send({
        from: "CSC Digital Seva <onboarding@resend.dev>", 
        to: email, // <-- This grabs whatever email is typed into the contact form
        subject: "We received your request! - CSC Digital Seva",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; color: #333;">
            <div style="background-color: #2563eb; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">CSC Digital Seva Centre</h1>
            </div>
            <div style="padding: 32px; background-color: #ffffff;">
              <h2 style="margin-top: 0; color: #1f2937;">Hello ${name},</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                Thank you for reaching out to us regarding <strong>${service}</strong>. 
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                We have successfully received your details. One of our representatives will review your request and contact you shortly at <strong>${phone}</strong> to assist you further.
              </p>
              
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Best Regards,</p>
                <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #374151;">Pradeep CSC & Digital Seva Kendra</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Main Market Road, Your City</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (userEmailError) {
      console.error("Failed to send auto-reply to user:", userEmailError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
import { Resend } from "resend";
import type { ContactFormValues } from "@/lib/validations";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "noreply@orbitaisystems.com";
const NOTIFY = process.env.NOTIFICATION_EMAIL || "hello@orbitaisystems.com";

export async function sendLeadNotificationEmail(data: ContactFormValues & { id: string }) {
  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      subject: `New Lead: ${data.name} from ${data.company || "Unknown Company"}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 32px; border-radius: 12px;">
          <div style="border-bottom: 1px solid #21262d; padding-bottom: 24px; margin-bottom: 24px;">
            <h1 style="color: #2dd4bf; font-size: 24px; margin: 0;">New Consultation Request</h1>
            <p style="color: #8b949e; margin: 8px 0 0;">Orbit DataWorks — Lead #${data.id}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #8b949e; width: 160px;">Name</td>
              <td style="padding: 8px 0; color: #e6edf3; font-weight: 600;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #8b949e;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #2dd4bf;">${data.email}</a></td>
            </tr>
            ${data.phone ? `<tr><td style="padding: 8px 0; color: #8b949e;">Phone</td><td style="padding: 8px 0; color: #e6edf3;">${data.phone}</td></tr>` : ""}
            ${data.company ? `<tr><td style="padding: 8px 0; color: #8b949e;">Company</td><td style="padding: 8px 0; color: #e6edf3;">${data.company}</td></tr>` : ""}
            ${data.website ? `<tr><td style="padding: 8px 0; color: #8b949e;">Website</td><td style="padding: 8px 0;"><a href="${data.website}" style="color: #2dd4bf;">${data.website}</a></td></tr>` : ""}
            ${data.industry ? `<tr><td style="padding: 8px 0; color: #8b949e;">Industry</td><td style="padding: 8px 0; color: #e6edf3;">${data.industry}</td></tr>` : ""}
            ${data.companySize ? `<tr><td style="padding: 8px 0; color: #8b949e;">Company Size</td><td style="padding: 8px 0; color: #e6edf3;">${data.companySize}</td></tr>` : ""}
            ${data.serviceInterest ? `<tr><td style="padding: 8px 0; color: #8b949e;">Service Interest</td><td style="padding: 8px 0; color: #e6edf3;">${data.serviceInterest}</td></tr>` : ""}
            ${data.budgetRange ? `<tr><td style="padding: 8px 0; color: #8b949e;">Budget Range</td><td style="padding: 8px 0; color: #e6edf3;">${data.budgetRange}</td></tr>` : ""}
            ${data.preferredContactMethod ? `<tr><td style="padding: 8px 0; color: #8b949e;">Contact Method</td><td style="padding: 8px 0; color: #e6edf3;">${data.preferredContactMethod}</td></tr>` : ""}
          </table>

          ${
            data.currentChallenge
              ? `<div style="margin-top: 24px; padding: 16px; background: #161b22; border: 1px solid #21262d; border-radius: 8px;">
              <p style="color: #8b949e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Current Challenge</p>
              <p style="color: #e6edf3; margin: 0; line-height: 1.6;">${data.currentChallenge}</p>
            </div>`
              : ""
          }

          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads/${data.id}"
               style="display: inline-block; background: #2dd4bf; color: #0d1117; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Lead in Dashboard →
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send lead notification email:", error);
  }
}

export async function sendLeadConfirmationEmail(data: { name: string; email: string }) {
  try {
    await resend.emails.send({
      from: FROM,
      to: data.email,
      subject: "We received your consultation request — Orbit DataWorks",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 32px; border-radius: 12px;">
          <h1 style="color: #2dd4bf; font-size: 24px;">We've received your request, ${data.name.split(" ")[0]}.</h1>
          <p style="color: #8b949e; line-height: 1.7;">
            Thank you for reaching out to Orbit DataWorks. Our team will review your consultation request
            and get back to you within 1–2 business days.
          </p>
          <p style="color: #8b949e; line-height: 1.7;">
            In the meantime, you can learn more about how we help businesses automate operations at
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #2dd4bf;">orbitaisystems.com</a>.
          </p>
          <p style="color: #8b949e; line-height: 1.7;">
            If you'd like to get started with a free AI business audit, visit
            <a href="https://auriva.im" style="color: #2dd4bf;">auriva.im</a>.
          </p>
          <p style="color: #8b949e; margin-top: 32px;">
            — The Orbit DataWorks Team
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}

import { Resend } from "resend";
import type { ContactFormValues } from "@/lib/validations";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_NAME = process.env.RESEND_FROM_NAME || "Orbit DataWorks";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;
const NOTIFY = process.env.NOTIFICATION_EMAIL || FROM_EMAIL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendLeadNotificationEmail(data: ContactFormValues & { id: string }) {
  const result = await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    subject: `New Lead: ${data.name} from ${data.company || "Unknown Company"}`,
    html: adminHtml(data),
  });
  if (result.error) {
    throw new Error(`Resend notify failed: ${result.error.message}`);
  }
  return result;
}

export async function sendLeadConfirmationEmail(data: { name: string; email: string }) {
  const result = await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: "We received your consultation request — Orbit DataWorks",
    html: confirmationHtml(data),
  });
  if (result.error) {
    throw new Error(`Resend confirmation failed: ${result.error.message}`);
  }
  return result;
}

function adminHtml(data: ContactFormValues & { id: string }) {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 32px; border-radius: 12px;">
      <div style="border-bottom: 1px solid #21262d; padding-bottom: 24px; margin-bottom: 24px;">
        <h1 style="color: #2dd4bf; font-size: 24px; margin: 0;">New Consultation Request</h1>
        <p style="color: #8b949e; margin: 8px 0 0;">Orbit DataWorks — Lead #${data.id}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #8b949e; width: 160px;">Name</td><td style="padding: 8px 0; color: #e6edf3; font-weight: 600;">${data.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #8b949e;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #2dd4bf;">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding: 8px 0; color: #8b949e;">Phone</td><td style="padding: 8px 0; color: #e6edf3;">${data.phone}</td></tr>` : ""}
        ${data.company ? `<tr><td style="padding: 8px 0; color: #8b949e;">Company</td><td style="padding: 8px 0; color: #e6edf3;">${data.company}</td></tr>` : ""}
        ${data.industry ? `<tr><td style="padding: 8px 0; color: #8b949e;">Industry</td><td style="padding: 8px 0; color: #e6edf3;">${data.industry}</td></tr>` : ""}
        ${data.companySize ? `<tr><td style="padding: 8px 0; color: #8b949e;">Company Size</td><td style="padding: 8px 0; color: #e6edf3;">${data.companySize}</td></tr>` : ""}
        ${data.serviceInterest ? `<tr><td style="padding: 8px 0; color: #8b949e;">Service Interest</td><td style="padding: 8px 0; color: #e6edf3;">${data.serviceInterest}</td></tr>` : ""}
      </table>
      ${data.currentChallenge ? `<div style="margin-top: 24px; padding: 16px; background: #161b22; border: 1px solid #21262d; border-radius: 8px;">
        <p style="color: #8b949e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Current Challenge</p>
        <p style="color: #e6edf3; margin: 0; line-height: 1.6;">${data.currentChallenge}</p>
      </div>` : ""}
      <div style="margin-top: 24px; text-align: center;">
        <a href="${APP_URL}/admin/leads/${data.id}"
           style="display: inline-block; background: #2dd4bf; color: #0d1117; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View Lead in Dashboard →
        </a>
      </div>
    </div>
  `;
}

function confirmationHtml(data: { name: string; email: string }) {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 32px; border-radius: 12px;">
      <h1 style="color: #2dd4bf; font-size: 24px;">Thanks for the call, ${data.name.split(" ")[0]}.</h1>
      <p style="color: #8b949e; line-height: 1.7;">
        Your personalized AI automation audit report is being prepared and will arrive
        in your inbox within a few minutes. If you don&apos;t see it, please check your
        spam or promotions folder.
      </p>
      <p style="color: #8b949e; line-height: 1.7;">
        While you wait, you can explore how we help businesses automate operations at
        <a href="${APP_URL}" style="color: #2dd4bf;">orbitdataworks.com</a>.
      </p>
      <p style="color: #8b949e; margin-top: 32px;">
        — The Orbit DataWorks Team
      </p>
    </div>
  `;
}

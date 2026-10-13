import { Resend } from "resend";
import type { ContactFormValues } from "@/lib/validations";
import type { AnalysisResult } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_NAME = process.env.RESEND_FROM_NAME || "Orbit DataWorks";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;
const NOTIFY = process.env.NOTIFICATION_EMAIL || FROM_EMAIL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const CALENDLY = process.env.NEXT_PUBLIC_CALENDLY_URL || `${APP_URL}/contact`;

export async function sendAuditReport(params: {
  toEmail: string;
  toName: string;
  businessName: string;
  analysis: AnalysisResult;
  reportHtml: string;
  reportId: string;
}) {
  const { toEmail, toName, businessName, analysis, reportHtml, reportId } = params;
  const score = analysis.qualificationScore;
  const scoreColor = score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const previewHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;padding:40px 24px;color:#e6edf3;">
      <div style="background:linear-gradient(135deg,#2dd4bf,#0ea5e9);display:inline-block;padding:10px 22px;border-radius:8px;margin-bottom:28px;">
        <span style="color:#0a0a0f;font-weight:800;letter-spacing:0.5px;">ORBIT DATAWORKS</span>
      </div>
      <h1 style="font-size:24px;margin:0 0 14px;">Your AI audit report is ready, ${escapeHtml(toName.split(" ")[0])}.</h1>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;">Based on the call with our AI auditor about <strong style="color:#e6edf3;">${escapeHtml(businessName)}</strong>, we've prepared a personalized automation roadmap.</p>
      <div style="background:#111827;border:1px solid #1e293b;border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
        <p style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Automation Score</p>
        <div style="font-size:48px;font-weight:800;color:${scoreColor};line-height:1;">${score}<span style="font-size:20px;color:#475569;">/100</span></div>
        <div style="margin-top:18px;color:#94a3b8;font-size:14px;">
          <strong style="color:#2dd4bf;">${analysis.opportunities.length} automation opportunities</strong> ·
          <strong style="color:#2dd4bf;">${analysis.estimatedROI.monthlyHoursSaved}h/mo</strong> estimated savings
        </div>
      </div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${APP_URL}/reports/${reportId}" style="background:linear-gradient(135deg,#2dd4bf,#0ea5e9);color:#0a0a0f;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">View Full Report →</a>
      </div>
      <p style="color:#64748b;font-size:13px;margin:0;">The complete report (with all opportunities, ROI breakdown, and implementation roadmap) is included below.</p>
      <hr style="border:none;border-top:1px solid #1e293b;margin:40px 0;" />
      ${reportHtml}
    </div>
  `;

  const result = await resend.emails.send({
    from: FROM,
    to: toEmail,
    bcc: NOTIFY !== toEmail ? NOTIFY : undefined,
    subject: `Your AI Automation Audit — ${businessName}`,
    html: previewHtml,
  });
  if (result.error) {
    throw new Error(`Resend audit report failed: ${result.error.message}`);
  }
  return result;
}

export async function sendConsultationInvite(params: {
  toEmail: string;
  toName: string;
  businessName: string;
}) {
  const { toEmail, toName, businessName } = params;
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;padding:40px 24px;color:#e6edf3;">
      <div style="background:linear-gradient(135deg,#2dd4bf,#0ea5e9);display:inline-block;padding:10px 22px;border-radius:8px;margin-bottom:28px;">
        <span style="color:#0a0a0f;font-weight:800;letter-spacing:0.5px;">ORBIT DATAWORKS</span>
      </div>
      <h1 style="font-size:22px;margin:0 0 14px;">Hi ${escapeHtml(toName.split(" ")[0])}, ready to turn the audit into action?</h1>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">Your automation report for <strong style="color:#e6edf3;">${escapeHtml(businessName)}</strong> surfaced real, high-ROI opportunities. Let's turn that into a concrete 30-day plan.</p>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 28px;">Book a free 30-minute consultation and we'll:</p>
      <ul style="color:#94a3b8;line-height:1.8;margin:0 0 28px;padding-left:20px;">
        <li>Walk through the recommended automation roadmap</li>
        <li>Pick the 2-3 quick wins that pay back fastest</li>
        <li>Discuss implementation effort and pricing</li>
      </ul>
      <div style="text-align:center;margin:28px 0;">
        <a href="${CALENDLY}" style="background:linear-gradient(135deg,#2dd4bf,#0ea5e9);color:#0a0a0f;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">Book Free Consultation</a>
      </div>
      <p style="color:#64748b;font-size:13px;margin-top:32px;">— The Orbit DataWorks team</p>
    </div>
  `;

  const result = await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `Let's build your automation roadmap — ${businessName}`,
    html,
  });
  if (result.error) {
    throw new Error(`Resend consultation invite failed: ${result.error.message}`);
  }
  return result;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

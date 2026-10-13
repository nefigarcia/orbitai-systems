import OpenAI from "openai";
import type { AnalysisResult } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a senior AI business consultant at Orbit DataWorks, specializing in workflow automation and operational efficiency. Your role is to analyze business interview transcripts and generate comprehensive, actionable AI optimization reports.

Your analysis must be:
- Specific to the business described, not generic
- Data-driven with concrete ROI estimates
- Practical with realistic implementation timelines
- Prioritized by impact and ease of implementation

Always respond with valid JSON matching the exact schema provided.`;

interface AnalysisInput {
  transcript: string;
  businessName: string;
  industry: string;
  companySize: string;
  mainChallenge: string;
}

export async function analyzeTranscript(input: AnalysisInput): Promise<AnalysisResult> {
  const userPrompt = `Analyze this business interview transcript for ${input.businessName}, a ${input.companySize} company in the ${input.industry} industry.

Their stated main challenge: "${input.mainChallenge}"

INTERVIEW TRANSCRIPT:
${input.transcript}

Generate a comprehensive AI optimization report. Return ONLY valid JSON with this exact structure:

{
  "executiveSummary": "2-3 paragraph executive summary of the business situation and key opportunities",
  "bottlenecks": [
    { "area": "process area name", "description": "specific description of the inefficiency", "severity": "high|medium|low", "estimatedHoursLost": 10 }
  ],
  "opportunities": [
    { "title": "automation opportunity title", "description": "detailed description of how this automation works", "impact": "high|medium|low", "effort": "high|medium|low", "estimatedTimeSaved": 8, "tools": ["Tool 1", "Tool 2"] }
  ],
  "estimatedROI": {
    "monthlyHoursSaved": 40,
    "annualHoursSaved": 480,
    "estimatedMonthlySavings": 3200,
    "estimatedAnnualSavings": 38400,
    "implementationCost": "$2,000 - $5,000",
    "paybackPeriod": "2-3 months"
  },
  "implementationRoadmap": [
    { "phase": 1, "title": "Quick Wins", "duration": "Month 1-2", "actions": ["action 1", "action 2", "action 3"], "expectedOutcome": "expected outcome description" }
  ],
  "recommendedSystems": [
    { "name": "System Name", "category": "CRM|Voice AI|Scheduling|Support|Marketing|Analytics", "description": "brief description", "useCase": "specific use case for this business" }
  ],
  "qualificationScore": 75
}

The qualificationScore (0-100) reflects how strong an automation opportunity this business represents:
- 80-100: Hot lead, multiple high-impact opportunities
- 60-79: Good lead, clear opportunities
- 40-59: Warm lead, some opportunities
- Below 40: Low priority

Be specific and concrete. Reference details from the actual transcript.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
    max_tokens: 3000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned empty response");

  return JSON.parse(content) as AnalysisResult;
}

export function generateReportHTML(
  analysis: AnalysisResult,
  businessName: string,
  leadName: string
): string {
  const score = analysis.qualificationScore;
  const scoreColor = score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://orbitdataworks.com";
  const CALENDLY = process.env.NEXT_PUBLIC_CALENDLY_URL || `${APP_URL}/contact`;

  const opportunitiesHTML = analysis.opportunities
    .map(
      (opp, i) => `
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:24px;margin-bottom:16px;">
        <div style="margin-bottom:12px;">
          <h4 style="color:#e6edf3;font-size:17px;font-weight:600;margin:0 0 6px;">${i + 1}. ${escapeHtml(opp.title)}</h4>
          <span style="background:${opp.impact === "high" ? "#166534" : opp.impact === "medium" ? "#854d0e" : "#1e3a5f"};color:${opp.impact === "high" ? "#86efac" : opp.impact === "medium" ? "#fde68a" : "#93c5fd"};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;display:inline-block;">
            ${opp.impact.toUpperCase()} IMPACT
          </span>
        </div>
        <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 12px;">${escapeHtml(opp.description)}</p>
        <div style="color:#2dd4bf;font-size:13px;font-weight:600;margin-bottom:8px;">⏱ ${opp.estimatedTimeSaved}h/month saved · Effort: ${opp.effort}</div>
        <div>${opp.tools.map((t) => `<span style="background:#0a0a0f;color:#64748b;padding:3px 10px;border-radius:4px;font-size:12px;margin-right:6px;display:inline-block;">${escapeHtml(t)}</span>`).join("")}</div>
      </div>`
    )
    .join("");

  const bottlenecksHTML = analysis.bottlenecks
    .map(
      (b) => `
      <div style="background:#0f172a;border-left:3px solid ${b.severity === "high" ? "#ef4444" : b.severity === "medium" ? "#f59e0b" : "#2dd4bf"};border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:6px;">
          <h5 style="color:#e6edf3;font-size:14px;font-weight:600;margin:0;">${escapeHtml(b.area)}</h5>
          <span style="color:#64748b;font-size:12px;white-space:nowrap;">~${b.estimatedHoursLost}h/mo lost</span>
        </div>
        <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">${escapeHtml(b.description)}</p>
      </div>`
    )
    .join("");

  const roadmapHTML = analysis.implementationRoadmap
    .map(
      (phase) => `
      <div style="border-left:3px solid #2dd4bf;padding-left:24px;margin-bottom:28px;">
        <div style="margin-bottom:8px;">
          <span style="background:#2dd4bf;color:#0a0a0f;width:28px;height:28px;border-radius:50%;display:inline-block;text-align:center;line-height:28px;font-weight:700;font-size:13px;">${phase.phase}</span>
          <strong style="color:#e6edf3;font-size:16px;font-weight:600;margin-left:10px;">${escapeHtml(phase.title)}</strong>
          <span style="color:#64748b;font-size:13px;margin-left:8px;">· ${escapeHtml(phase.duration)}</span>
        </div>
        <ul style="color:#94a3b8;font-size:14px;line-height:1.8;margin:0 0 8px;padding-left:20px;">
          ${phase.actions.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}
        </ul>
        <p style="color:#2dd4bf;font-size:13px;font-weight:500;margin:0;">→ ${escapeHtml(phase.expectedOutcome)}</p>
      </div>`
    )
    .join("");

  const systemsHTML = analysis.recommendedSystems
    .map(
      (s) => `
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:16px;margin-bottom:10px;">
        <div style="margin-bottom:4px;">
          <strong style="color:#e6edf3;font-size:14px;font-weight:600;">${escapeHtml(s.name)}</strong>
          <span style="background:#2dd4bf;color:#0a0a0f;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;margin-left:8px;">${escapeHtml(s.category)}</span>
        </div>
        <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0 0 6px;">${escapeHtml(s.description)}</p>
        <p style="color:#64748b;font-size:12px;margin:0;"><em>Use case: ${escapeHtml(s.useCase)}</em></p>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Optimization Report — ${escapeHtml(businessName)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:720px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:40px;">
      <div style="background:linear-gradient(135deg,#2dd4bf,#0ea5e9);display:inline-block;padding:12px 28px;border-radius:8px;margin-bottom:20px;">
        <span style="color:#0a0a0f;font-size:16px;font-weight:800;letter-spacing:0.5px;">ORBIT DATAWORKS</span>
      </div>
      <h1 style="color:#e6edf3;font-size:28px;font-weight:700;margin:0 0 8px;">AI Optimization Report</h1>
      <p style="color:#64748b;font-size:15px;margin:0;">${escapeHtml(businessName)} · Prepared for ${escapeHtml(leadName)}</p>
    </div>

    <div style="background:linear-gradient(135deg,rgba(45,212,191,0.12),rgba(14,165,233,0.12));border:1px solid rgba(45,212,191,0.3);border-radius:16px;padding:28px;margin-bottom:32px;text-align:center;">
      <p style="color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Automation Opportunity Score</p>
      <div style="font-size:64px;font-weight:800;color:${scoreColor};line-height:1;">${score}</div>
      <div style="color:#64748b;font-size:14px;margin-top:4px;">out of 100</div>
      <table style="margin:24px auto 0;border-collapse:collapse;">
        <tr>
          <td style="padding:0 24px;text-align:center;">
            <div style="color:#e6edf3;font-size:22px;font-weight:700;">${analysis.estimatedROI.monthlyHoursSaved}h</div>
            <div style="color:#64748b;font-size:12px;">Hours Saved/Month</div>
          </td>
          <td style="padding:0 24px;text-align:center;">
            <div style="color:#e6edf3;font-size:22px;font-weight:700;">$${Math.round(analysis.estimatedROI.estimatedAnnualSavings / 1000)}k</div>
            <div style="color:#64748b;font-size:12px;">Est. Annual Savings</div>
          </td>
          <td style="padding:0 24px;text-align:center;">
            <div style="color:#e6edf3;font-size:22px;font-weight:700;">${analysis.opportunities.length}</div>
            <div style="color:#64748b;font-size:12px;">Opportunities Found</div>
          </td>
        </tr>
      </table>
    </div>

    <div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#e6edf3;font-size:18px;font-weight:700;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #1e293b;">Executive Summary</h2>
      <p style="color:#94a3b8;font-size:14px;line-height:1.8;margin:0;white-space:pre-line;">${escapeHtml(analysis.executiveSummary)}</p>
    </div>

    ${bottlenecksHTML ? `<div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#e6edf3;font-size:18px;font-weight:700;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #1e293b;">⚠ Current Bottlenecks</h2>
      ${bottlenecksHTML}
    </div>` : ""}

    <div style="margin-bottom:24px;">
      <h2 style="color:#e6edf3;font-size:18px;font-weight:700;margin:0 0 16px;">🚀 Automation Opportunities</h2>
      ${opportunitiesHTML}
    </div>

    <div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#e6edf3;font-size:18px;font-weight:700;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #1e293b;">💰 ROI Estimate</h2>
      <table style="width:100%;border-collapse:separate;border-spacing:12px;">
        <tr>
          <td style="background:#0a0a0f;border-radius:8px;padding:16px;width:50%;">
            <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Monthly Time Saved</div>
            <div style="color:#2dd4bf;font-size:24px;font-weight:700;">${analysis.estimatedROI.monthlyHoursSaved} hours</div>
          </td>
          <td style="background:#0a0a0f;border-radius:8px;padding:16px;width:50%;">
            <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Monthly Savings</div>
            <div style="color:#22c55e;font-size:24px;font-weight:700;">$${analysis.estimatedROI.estimatedMonthlySavings.toLocaleString()}</div>
          </td>
        </tr>
        <tr>
          <td style="background:#0a0a0f;border-radius:8px;padding:16px;">
            <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Annual Savings</div>
            <div style="color:#22c55e;font-size:24px;font-weight:700;">$${analysis.estimatedROI.estimatedAnnualSavings.toLocaleString()}</div>
          </td>
          <td style="background:#0a0a0f;border-radius:8px;padding:16px;">
            <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Payback Period</div>
            <div style="color:#f59e0b;font-size:24px;font-weight:700;">${escapeHtml(analysis.estimatedROI.paybackPeriod)}</div>
          </td>
        </tr>
      </table>
      <p style="color:#64748b;font-size:13px;margin:16px 0 0;">Est. implementation cost: <strong style="color:#e6edf3;">${escapeHtml(analysis.estimatedROI.implementationCost)}</strong></p>
    </div>

    <div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#e6edf3;font-size:18px;font-weight:700;margin:0 0 20px;padding-bottom:12px;border-bottom:1px solid #1e293b;">🗺️ Implementation Roadmap</h2>
      ${roadmapHTML}
    </div>

    ${systemsHTML ? `<div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:32px;">
      <h2 style="color:#e6edf3;font-size:18px;font-weight:700;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #1e293b;">🧰 Recommended Systems</h2>
      ${systemsHTML}
    </div>` : ""}

    <div style="background:linear-gradient(135deg,rgba(45,212,191,0.18),rgba(14,165,233,0.18));border:1px solid rgba(45,212,191,0.4);border-radius:16px;padding:32px;text-align:center;">
      <h3 style="color:#e6edf3;font-size:20px;font-weight:700;margin:0 0 12px;">Ready to implement these?</h3>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">Book a free 30-minute consultation with our automation specialists to turn this roadmap into a project plan.</p>
      <a href="${CALENDLY}" style="background:linear-gradient(135deg,#2dd4bf,#0ea5e9);color:#0a0a0f;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">Book Consultation</a>
    </div>

    <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #1e293b;">
      <p style="color:#475569;font-size:12px;margin:0;">© ${new Date().getFullYear()} Orbit DataWorks · AI-generated, reviewed for accuracy.</p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

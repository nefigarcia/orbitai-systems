import OpenAI from "openai";
import type { Lead } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function summarizeLeadChallenge(lead: Lead): Promise<string> {
  const prompt = `You are a senior AI automation consultant at Orbit DataWorks. Summarize the following lead's business challenge in 2-3 sentences, identifying the core operational problem and why AI/automation could help.

Lead Details:
- Company: ${lead.company || "Unknown"}
- Industry: ${lead.industry || "Unknown"}
- Company Size: ${lead.companySize || "Unknown"}
- Service Interest: ${lead.serviceInterest || "Unknown"}
- Current Challenge: ${lead.currentChallenge || "Not provided"}

Provide a concise, professional summary suitable for a sales team.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.4,
  });

  return response.choices[0]?.message?.content || "Unable to generate summary.";
}

export async function generateAutomationOpportunities(lead: Lead): Promise<string> {
  const prompt = `You are a senior AI automation consultant at Orbit DataWorks. Based on this lead's profile, identify 3-5 specific automation opportunities that would deliver measurable business value.

Lead Profile:
- Company: ${lead.company || "Unknown"}
- Industry: ${lead.industry || "Unknown"}
- Company Size: ${lead.companySize || "Unknown"}
- Service Interest: ${lead.serviceInterest || "Unknown"}
- Challenge: ${lead.currentChallenge || "Not provided"}
- Budget: ${lead.budgetRange || "Unknown"}

Format as a numbered list. Be specific and reference technologies like AI agents, workflow automation, dashboard analytics, or integrations where relevant.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400,
    temperature: 0.5,
  });

  return response.choices[0]?.message?.content || "Unable to generate opportunities.";
}

export async function scoreLeadPotential(lead: Lead): Promise<{
  score: number;
  reasoning: string;
}> {
  const prompt = `You are a sales analyst at Orbit DataWorks. Score this lead's potential on a scale of 1-10 for AI/automation consulting services.

Lead Profile:
- Company: ${lead.company || "Unknown"}
- Industry: ${lead.industry || "Unknown"}
- Company Size: ${lead.companySize || "Unknown"}
- Service Interest: ${lead.serviceInterest || "Unknown"}
- Budget: ${lead.budgetRange || "Unknown"}
- Challenge: ${lead.currentChallenge || "Not provided"}

Respond ONLY in this JSON format: {"score": 7, "reasoning": "Two sentence explanation."}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  try {
    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      score: Math.min(10, Math.max(1, Number(result.score) || 5)),
      reasoning: result.reasoning || "Unable to generate reasoning.",
    };
  } catch {
    return { score: 5, reasoning: "Unable to score lead." };
  }
}

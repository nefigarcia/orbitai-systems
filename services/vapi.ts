const VAPI_BASE_URL = "https://api.vapi.ai";

interface CallLeadParams {
  phoneNumber: string;
  leadId: string;
  leadName: string;
  company: string;
  industry: string;
  mainChallenge: string;
}

interface VapiCall {
  id: string;
  status: string;
}

export interface VapiCallDetail {
  id: string;
  status: string;
  endedReason?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
}

export async function getVapiCall(callId: string): Promise<VapiCallDetail> {
  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey) throw new Error("VAPI_API_KEY missing");

  const res = await fetch(`${VAPI_BASE_URL}/call/${encodeURIComponent(callId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`VAPI call lookup failed: ${res.status} ${error}`);
  }

  const data = (await res.json()) as {
    id: string;
    status: string;
    endedReason?: string | null;
    startedAt?: string | null;
    endedAt?: string | null;
  };
  return {
    id: data.id,
    status: data.status,
    endedReason: data.endedReason ?? null,
    startedAt: data.startedAt ?? null,
    endedAt: data.endedAt ?? null,
  };
}

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

export async function initiateConsultationCall(params: CallLeadParams): Promise<VapiCall> {
  const apiKey = process.env.VAPI_API_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
  const assistantId = process.env.VAPI_ASSISTANT_ID;

  if (!apiKey || !phoneNumberId || !assistantId) {
    throw new Error("VAPI configuration missing");
  }

  const payload = {
    phoneNumberId,
    assistantId,
    customer: {
      number: toE164(params.phoneNumber),
      name: params.leadName,
    },
    assistantOverrides: {
      variableValues: {
        leadName: params.leadName,
        businessName: params.company,
        industry: params.industry,
        mainChallenge: params.mainChallenge,
      },
    },
    metadata: {
      leadId: params.leadId,
    },
  };

  const res = await fetch(`${VAPI_BASE_URL}/call/phone`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`VAPI call initiation failed: ${res.status} ${error}`);
  }

  return res.json() as Promise<VapiCall>;
}

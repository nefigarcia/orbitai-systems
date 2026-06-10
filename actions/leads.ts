"use server";

import { contactFormSchema } from "@/lib/validations";
import type { LeadStatus } from "@prisma/client";
import { sendLeadNotificationEmail, sendLeadConfirmationEmail } from "@/services/email";
import type { ContactFormValues } from "@/lib/validations";

export async function submitContactForm(data: ContactFormValues) {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Validation failed",
    };
  }

  try {
    const { db } = await import("@/lib/db");

    const lead = await db.lead.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        company: parsed.data.company,
        website: parsed.data.website,
        industry: parsed.data.industry,
        companySize: parsed.data.companySize,
        serviceInterest: parsed.data.serviceInterest,
        currentChallenge: parsed.data.currentChallenge,
        budgetRange: parsed.data.budgetRange,
        preferredContactMethod: parsed.data.preferredContactMethod,
        status: "NEW",
        source: "website",
      },
    });

    await db.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        company: parsed.data.company,
        website: parsed.data.website,
        industry: parsed.data.industry,
        companySize: parsed.data.companySize,
        serviceInterest: parsed.data.serviceInterest,
        currentChallenge: parsed.data.currentChallenge,
        budgetRange: parsed.data.budgetRange,
        preferredContactMethod: parsed.data.preferredContactMethod,
      },
    });

    await db.activityLog.create({
      data: {
        leadId: lead.id,
        action: "LEAD_CREATED",
        details: `New lead created via website contact form`,
      },
    });

    await Promise.all([
      sendLeadNotificationEmail({ ...parsed.data, id: lead.id }),
      sendLeadConfirmationEmail({ name: parsed.data.name, email: parsed.data.email }),
    ]);

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  try {
    const { db } = await import("@/lib/db");

    const lead = await db.lead.update({
      where: { id: leadId },
      data: { status: status as LeadStatus },
    });

    await db.activityLog.create({
      data: {
        leadId,
        action: "STATUS_UPDATED",
        details: `Status changed to ${status}`,
      },
    });

    return { success: true, lead };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateLeadNotes(leadId: string, notes: string) {
  try {
    const { db } = await import("@/lib/db");
    const lead = await db.lead.update({
      where: { id: leadId },
      data: { notes },
    });
    return { success: true, lead };
  } catch (error) {
    console.error("Failed to update lead notes:", error);
    return { success: false, error: "Failed to update notes" };
  }
}

export async function getLeads(options?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const { db } = await import("@/lib/db");

  const where: Record<string, unknown> = {};

  if (options?.status && options.status !== "ALL") {
    where.status = options.status;
  }

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search } },
      { email: { contains: options.search } },
      { company: { contains: options.search } },
    ];
  }

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    }),
    db.lead.count({ where }),
  ]);

  return { leads, total };
}

export async function getLeadById(id: string) {
  const { db } = await import("@/lib/db");
  return db.lead.findUnique({
    where: { id },
    include: { activityLogs: { orderBy: { createdAt: "desc" } } },
  });
}

export async function getDashboardStats() {
  const { db } = await import("@/lib/db");

  const [total, newLeads, qualified, won, recent] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: "NEW" } }),
    db.lead.count({ where: { status: "QUALIFIED" } }),
    db.lead.count({ where: { status: "WON" } }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return { total, newLeads, qualified, won, recent };
}

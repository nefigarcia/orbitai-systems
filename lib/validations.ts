import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  serviceInterest: z.string().min(1, "Please select a service area"),
  currentChallenge: z
    .string()
    .min(20, "Please describe your challenge in at least 20 characters"),
  budgetRange: z.string().optional(),
  preferredContactMethod: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const wizardContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .refine((v) => v.replace(/\D/g, "").length >= 7, "Please enter a valid phone number"),
  company: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Please select your industry"),
  companySize: z.string().min(1, "Please select your company size"),
  challenges: z
    .array(z.string())
    .min(1, "Pick at least one challenge")
    .max(8, "Too many challenges selected"),
  challengeDetail: z.string().optional(),
});

export type WizardContactValues = z.infer<typeof wizardContactSchema>;

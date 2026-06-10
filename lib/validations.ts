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

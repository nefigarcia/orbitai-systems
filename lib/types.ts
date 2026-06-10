export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL_SENT"
  | "WON"
  | "LOST";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  website?: string | null;
  industry?: string | null;
  companySize?: string | null;
  serviceInterest?: string | null;
  currentChallenge?: string | null;
  budgetRange?: string | null;
  preferredContactMethod?: string | null;
  status: LeadStatus;
  source?: string | null;
  notes?: string | null;
  aiSummary?: string | null;
  aiOpportunities?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  serviceInterest?: string;
  currentChallenge?: string;
  budgetRange?: string;
  preferredContactMethod?: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ProductCard {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string | null;
  color: string;
  features: string[];
}

export interface CaseStudyCard {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  service: string;
  summary: string;
  metrics: { label: string; value: string }[];
  featured: boolean;
  imageUrl: string | null;
}

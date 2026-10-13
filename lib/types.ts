export type LeadStatus =
  | "NEW"
  | "CALL_SCHEDULED"
  | "CALL_IN_PROGRESS"
  | "CALL_COMPLETED"
  | "REPORT_GENERATED"
  | "REPORT_SENT"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL_SENT"
  | "WON"
  | "LOST";

export interface ReportBottleneck {
  area: string;
  description: string;
  severity: "high" | "medium" | "low";
  estimatedHoursLost: number;
}

export interface AutomationOpportunity {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  estimatedTimeSaved: number;
  tools: string[];
}

export interface ROIEstimate {
  monthlyHoursSaved: number;
  annualHoursSaved: number;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  implementationCost: string;
  paybackPeriod: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  actions: string[];
  expectedOutcome: string;
}

export interface RecommendedSystem {
  name: string;
  category: string;
  description: string;
  useCase: string;
}

export interface AnalysisResult {
  executiveSummary: string;
  bottlenecks: ReportBottleneck[];
  opportunities: AutomationOpportunity[];
  estimatedROI: ROIEstimate;
  implementationRoadmap: RoadmapPhase[];
  recommendedSystems: RecommendedSystem[];
  qualificationScore: number;
}

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

export const SITE_NAME = "Orbit DataWorks";
export const SITE_TAGLINE = "Intelligent Business Automation";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://orbitaisystems.com";
export const AURIVA_URL = process.env.NEXT_PUBLIC_AURIVA_URL || "https://auriva.im";

export const SERVICES = [
  {
    id: "ai-automation",
    title: "AI Automation",
    tagline: "Automate repetitive operations at scale",
    description:
      "Voice agents, support automation, lead qualification, and intelligent follow-up systems that run 24/7 without manual intervention.",
    icon: "Bot",
    features: [
      "Voice AI agents",
      "Customer support automation",
      "Lead qualification workflows",
      "Follow-up automation",
      "AI-powered chatbots",
      "Process automation pipelines",
    ],
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    tagline: "Turn raw data into actionable intelligence",
    description:
      "Executive dashboards, KPI monitoring systems, and custom analytics portals that give leadership real-time visibility into business performance.",
    icon: "BarChart3",
    features: [
      "Executive dashboards",
      "KPI monitoring systems",
      "Power BI integrations",
      "Custom analytics portals",
      "Data pipeline architecture",
      "Real-time reporting",
    ],
  },
  {
    id: "enterprise-integrations",
    title: "Enterprise Integrations",
    tagline: "Connect your critical business systems",
    description:
      "SAP, CRM, ERP, and custom API integrations that unify your data and eliminate silos across your entire technology stack.",
    icon: "Network",
    features: [
      "SAP integration & analytics",
      "CRM integration (Salesforce, HubSpot)",
      "ERP integration",
      "Custom API development",
      "Data synchronization",
      "Middleware architecture",
    ],
  },
  {
    id: "custom-software",
    title: "Custom Software",
    tagline: "Purpose-built tools for your operations",
    description:
      "SaaS applications, internal tools, client portals, and workflow platforms engineered to fit your exact business model.",
    icon: "Code2",
    features: [
      "SaaS application development",
      "Internal operations tools",
      "Client portal development",
      "Workflow management platforms",
      "Custom admin dashboards",
      "Mobile-ready web apps",
    ],
  },
  {
    id: "process-optimization",
    title: "Process Optimization",
    tagline: "Identify bottlenecks, unlock efficiency",
    description:
      "Workflow audits, automation roadmaps, and ROI planning that help you prioritize where technology creates the most business value.",
    icon: "GitBranch",
    features: [
      "Workflow audits",
      "Automation roadmaps",
      "Bottleneck analysis",
      "ROI planning",
      "Technology stack review",
      "Digital transformation strategy",
    ],
  },
];

export const PRODUCTS = [
  {
    id: "auriva",
    name: "Auriva",
    tagline: "AI Business Audit Platform",
    description:
      "Auriva analyzes your business operations and identifies automation opportunities, inefficiencies, and AI-ready workflows — generating a prioritized action plan in minutes.",
    url: "https://auriva.im",
    color: "from-violet-500 to-indigo-600",
    features: [
      "Business process analysis",
      "Automation opportunity scoring",
      "AI readiness assessment",
      "ROI estimation",
      "Prioritized action plan",
    ],
  },
  {
    id: "healthai",
    name: "HealthAI",
    tagline: "Healthcare AI Automation Platform",
    description:
      "An AI-powered platform for clinics and healthcare providers — automating patient intake, appointment scheduling, clinical documentation, and follow-up communications.",
    url: null,
    color: "from-teal-500 to-cyan-600",
    features: [
      "Patient intake automation",
      "Appointment scheduling AI",
      "Clinical documentation",
      "Follow-up communications",
      "HIPAA-compliant workflows",
    ],
  },
  {
    id: "woodcraft-os",
    name: "WoodCraft OS",
    tagline: "Cabinet Manufacturing Workflow Platform",
    description:
      "A complete operations management platform for cabinet and manufacturing companies — from job quoting and material ordering to production tracking and client delivery.",
    url: null,
    color: "from-amber-500 to-orange-600",
    features: [
      "Job quoting system",
      "Material procurement",
      "Production tracking",
      "Client portal",
      "Delivery management",
    ],
  },
];

export const CASE_STUDIES = [
  {
    id: "kingspan-roofing",
    slug: "kingspan-roofing",
    title: "SAP Analytics Dashboard Integration",
    client: "Kingspan Roofing",
    industry: "Construction & Manufacturing",
    service: "Enterprise Integrations / Data & Analytics",
    summary:
      "Orbit DataWorks helped design a data integration and analytics dashboard concept to connect SAP data with actionable business insights.",
    metrics: [
      { label: "Data Sources Connected", value: "4" },
      { label: "Report Generation Time", value: "−90%" },
      { label: "Executive Dashboards", value: "3" },
    ],
    featured: true,
    imageUrl: null,
  },
  {
    id: "healthcare-ai",
    slug: "healthcare-ai-assistant",
    title: "AI Patient Communication System",
    client: "Healthcare Provider",
    industry: "Healthcare",
    service: "AI Automation",
    summary:
      "Automated patient intake, appointment reminders, and follow-up workflows — reducing administrative overhead by over 60%.",
    metrics: [
      { label: "Admin Time Saved", value: "60%" },
      { label: "Response Time", value: "−80%" },
      { label: "Patient Satisfaction", value: "+34%" },
    ],
    featured: false,
    imageUrl: null,
  },
  {
    id: "woodcraft",
    slug: "woodcraft-manufacturing",
    title: "Cabinet Manufacturing Platform",
    client: "Cabinet Manufacturer",
    industry: "Manufacturing",
    service: "Custom Software",
    summary:
      "End-to-end operations platform replacing spreadsheets and manual processes with a unified digital workflow system.",
    metrics: [
      { label: "Quote Time", value: "−70%" },
      { label: "Order Errors", value: "−45%" },
      { label: "Production Visibility", value: "100%" },
    ],
    featured: false,
    imageUrl: null,
  },
  {
    id: "ai-audit",
    slug: "ai-business-audit",
    title: "AI Business Audit Automation",
    client: "Multiple Clients",
    industry: "Multi-Industry",
    service: "Process Optimization",
    summary:
      "Automated business audit tool that analyzes operational workflows and surfaces automation opportunities with estimated ROI.",
    metrics: [
      { label: "Audit Time", value: "−95%" },
      { label: "Opportunities Found", value: "12 avg" },
      { label: "Client Satisfaction", value: "4.9/5" },
    ],
    featured: false,
    imageUrl: null,
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    description:
      "We map your current systems, workflows, and pain points through structured discovery sessions with your team.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "We architect the solution — data flows, integrations, AI components, and user interfaces — before writing a single line of code.",
  },
  {
    step: "03",
    title: "Automate",
    description:
      "We build and deploy AI agents, automation workflows, and system integrations using proven enterprise-grade technology.",
  },
  {
    step: "04",
    title: "Integrate",
    description:
      "We connect your new systems to existing tools — SAP, CRMs, ERPs, databases — ensuring seamless data flow across your stack.",
  },
  {
    step: "05",
    title: "Optimize",
    description:
      "Post-launch, we monitor performance, measure ROI, and continuously refine workflows to maximize business value.",
  },
];

export const INDUSTRIES = [
  "Manufacturing",
  "Healthcare",
  "Construction",
  "Financial Services",
  "Retail & E-Commerce",
  "Logistics & Supply Chain",
  "Professional Services",
  "Technology",
  "Real Estate",
  "Other",
];

export const COMPANY_SIZES = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "500+ employees",
];

export const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000+",
  "Not sure yet",
];

export const SERVICE_INTERESTS = [
  "AI Automation & Agents",
  "Data & Analytics Dashboards",
  "SAP / ERP Integration",
  "CRM Integration",
  "Custom Software Development",
  "Process Optimization & Audit",
  "Voice AI",
  "Not sure — need consultation",
];

export const CONTACT_METHODS = ["Email", "Phone", "Video Call", "Any"];

export type Industry = "Mortgage Broker" | "Accounting Firm" | "Dental Clinic" | "Law Firm" | "Trades Business";

export type AuditStatus = "Prospecting" | "In Progress" | "Ready for Report";

export type AuditCategory =
  | "Lead Capture"
  | "Lead Response Speed"
  | "Follow-Up System"
  | "Sales Process"
  | "Customer Support / Reception"
  | "Admin Efficiency"
  | "Marketing Funnel Quality"
  | "Website Conversion Readiness"
  | "AI Adoption Potential"
  | "Automation Readiness"
  | "Trust & Authority"
  | "Operational Bottlenecks";

export interface AssumptionModel {
  hoursSavedPerWeek: number;
  leadsRecoverablePerMonth: number;
  adminHoursReduciblePerWeek: number;
  avgLeadValue: number;
  responseTimeImprovementPct: number;
  followUpImprovementPct: number;
}

export interface AuditScore {
  category: AuditCategory;
  score: number;
  findings: string;
  risks: string;
  opportunities: string;
  estimatedBusinessImpact: string;
  recommendedActions: string;
}

export interface Recommendation {
  title: string;
  problem: string;
  whyItMatters: string;
  suggestedFix: string;
  estimatedImpact: string;
  implementationDifficulty: "Low" | "Medium" | "High";
  category: AuditCategory;
  priority: "P1" | "P2" | "P3";
  aiHelp: boolean;
  automationHelp: boolean;
  impacts: Array<"Revenue" | "Time" | "Customer Experience">;
}

export interface CompanyAudit {
  id: string;
  companyName: string;
  website?: string;
  industry: Industry;
  location: string;
  sizeEstimate: string;
  inboundVolume: string;
  tools: string;
  notes: string;
  manualObservations?: string;
  status: AuditStatus;
  createdAt: string;
  stage: "Pre-Audit" | "Full Audit";
  scores: AuditScore[];
  recommendations: Recommendation[];
  assumptions: AssumptionModel;
  internalNotes: string;
  reportBranding: { agencyName: string; primaryColor: string; logoText: string };
}

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

export type SectionId =
  | "cover"
  | "executiveSummary"
  | "companySnapshot"
  | "workflowIssues"
  | "aiOpportunities"
  | "automationOpportunities"
  | "salesInefficiencies"
  | "recommendations"
  | "implementationRoadmap"
  | "roi"
  | "consultantNotes";

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

export interface AuditMeta {
  reportTitle: string;
  reportSubtitle: string;
  clientBusinessName: string;
  preparedFor: string;
  reportDate: string;
  preparedBy: string;
  positioningLine: string;
  agencyName: string;
  logoText: string;
  primaryColor: string;
}

export interface ExecutiveSummary {
  currentState: string;
  keyIssues: string;
  primaryOpportunities: string;
  recommendedFocus: string;
}

export interface SnapshotItem {
  id: string;
  label: string;
  value: string;
}

export interface WorkflowIssue {
  id: string;
  title: string;
  description: string;
  businessImpact: string;
  severity: "High" | "Medium" | "Low";
}

export interface OpportunityItem {
  id: string;
  area: string;
  opportunity: string;
  systemType: string;
  readiness: "Ready" | "Pilot First" | "Needs Cleanup";
  expectedImpact: string;
}

export interface LeadIssue {
  id: string;
  title: string;
  symptom: string;
  consequence: string;
  recommendedResponse: string;
}

export interface RoadmapPhase {
  id: string;
  phase: "Now" | "Next" | "Later";
  title: string;
  objective: string;
  actions: string[];
  likelyOutcome: string;
}

export interface ConsultantNotes {
  clientNotes: string;
  internalNotes: string;
  nextSteps: string;
}

export interface AuditProfile {
  industry: Industry;
  website: string;
  location: string;
  sizeEstimate: string;
  inboundVolume: string;
  tools: string;
  leadChannels: string;
  deliveryModel: string;
  notes: string;
  manualObservations: string;
}

export interface AuditSections {
  order: SectionId[];
  visibility: Record<SectionId, boolean>;
}

export interface AuditDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: AuditStatus;
  stage: "Pre-Audit" | "Full Audit";
  meta: AuditMeta;
  profile: AuditProfile;
  executiveSummary: ExecutiveSummary;
  companySnapshot: SnapshotItem[];
  workflowIssues: WorkflowIssue[];
  aiOpportunities: OpportunityItem[];
  automationOpportunities: OpportunityItem[];
  salesInefficiencies: LeadIssue[];
  quickWins: string[];
  roadmap: RoadmapPhase[];
  consultantNotes: ConsultantNotes;
  scores: AuditScore[];
  recommendations: Recommendation[];
  assumptions: AssumptionModel;
  sections: AuditSections;
}

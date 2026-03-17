import { AuditCategory, CompanyAudit, Industry } from "../types";
import { buildRecommendations, buildScores, calculateAssumptions } from "../lib/engines";

const categories: AuditCategory[] = [
  "Lead Capture",
  "Lead Response Speed",
  "Follow-Up System",
  "Sales Process",
  "Customer Support / Reception",
  "Admin Efficiency",
  "Marketing Funnel Quality",
  "Website Conversion Readiness",
  "AI Adoption Potential",
  "Automation Readiness",
  "Trust & Authority",
  "Operational Bottlenecks"
];

export const industryChecks: Record<Industry, string[]> = {
  "Mortgage Broker": [
    "Enquiry response within 10 minutes",
    "Trust signals: lender panel + accreditations visible",
    "Appointment booking flow friction",
    "Follow-up cadence after document request",
    "Client onboarding pack clarity"
  ],
  "Accounting Firm": [
    "Consultation funnel clarity by service line",
    "Authority signals: case studies and reviews",
    "Intake/admin friction in onboarding",
    "FAQ education and objection handling",
    "Response-time expectation management"
  ],
  "Dental Clinic": ["Booking conversion flow", "Review capture process", "No-show follow-up"],
  "Law Firm": ["Matter intake friction", "Trust badges/credentials", "Response SLA"],
  "Trades Business": ["Quote turnaround speed", "Call handling", "Review acquisition"]
};

export function createSeedAudit(partial: Pick<CompanyAudit, "id" | "companyName" | "industry" | "location" | "stage">): CompanyAudit {
  const scores = buildScores(categories, partial.industry);
  return {
    ...partial,
    website: `https://${partial.companyName.toLowerCase().replace(/\s+/g, "")}.com.au`,
    sizeEstimate: partial.industry === "Mortgage Broker" ? "8-15" : "12-25",
    inboundVolume: "80 leads/month",
    tools: "HubSpot, Google Workspace, Calendly, Xero",
    notes: "Strong demand, inconsistent follow-up and manual operations overhead.",
    manualObservations: "Website trust content is present but conversion flow needs simplification.",
    status: "In Progress",
    createdAt: new Date().toISOString(),
    scores,
    recommendations: buildRecommendations(scores),
    assumptions: calculateAssumptions(scores),
    internalNotes: "Founder handles high-value leads personally; ops team overloaded during peak periods.",
    reportBranding: { agencyName: "Your Agency", primaryColor: "#111827", logoText: "YA" }
  };
}

export const demoAudits: CompanyAudit[] = [
  createSeedAudit({
    id: "audit-mortgage-1",
    companyName: "Northline Mortgage Advisory",
    industry: "Mortgage Broker",
    location: "Sydney",
    stage: "Full Audit"
  }),
  createSeedAudit({
    id: "audit-accounting-1",
    companyName: "Harbor Ridge Accounting",
    industry: "Accounting Firm",
    location: "Melbourne",
    stage: "Pre-Audit"
  })
];

import { buildRecommendations, buildScores, calculateAssumptions, DEFAULT_AUDIT_CATEGORIES } from "../lib/engines";
import {
  AuditDocument,
  Industry,
  OpportunityItem,
  RoadmapPhase,
  SectionId,
  SnapshotItem,
  WorkflowIssue,
  LeadIssue
} from "../types";

export const industryChecks: Record<Industry, string[]> = {
  "Mortgage Broker": [
    "Enquiry response within 10 minutes",
    "Trust signals: lender panel and accreditations visible",
    "Appointment booking flow friction",
    "Follow-up cadence after document request",
    "Client onboarding pack clarity"
  ],
  "Accounting Firm": [
    "Consultation funnel clarity by service line",
    "Authority signals: case studies and reviews",
    "Intake and admin friction in onboarding",
    "FAQ education and objection handling",
    "Response-time expectation management"
  ],
  "Dental Clinic": ["Booking conversion flow", "Review capture process", "No-show follow-up"],
  "Law Firm": ["Matter intake friction", "Trust badges and credentials", "Response SLA"],
  "Trades Business": ["Quote turnaround speed", "Call handling", "Review acquisition"]
};

export const sectionDefinitions: Array<{ id: SectionId; label: string; kicker: string; description: string }> = [
  { id: "cover", label: "Cover", kicker: "01", description: "Title page, client metadata, and brand positioning." },
  { id: "executiveSummary", label: "Current State Overview", kicker: "02", description: "What the business looks like now and where the biggest drag is sitting." },
  { id: "companySnapshot", label: "Business Snapshot", kicker: "03", description: "Business context, team profile, channels, and operating baseline." },
  { id: "workflowIssues", label: "Current Workflow Bloat", kicker: "04", description: "Where time, response speed, and internal momentum are being lost." },
  { id: "aiOpportunities", label: "AI Opportunities", kicker: "05", description: "Where AI can improve speed, reporting, and customer communication." },
  { id: "automationOpportunities", label: "Automation Opportunities", kicker: "06", description: "Which manual processes should be tightened or automated next." },
  { id: "salesInefficiencies", label: "Lead and Sales Inefficiencies", kicker: "07", description: "Revenue leakage across response, qualification, and follow-up." },
  { id: "recommendations", label: "Priority Recommendations", kicker: "08", description: "Most important changes to make first based on the audit." },
  { id: "implementationRoadmap", label: "Implementation Roadmap", kicker: "09", description: "Phased rollout plan showing how to implement in the right order." },
  { id: "roi", label: "ROI and Value Estimate", kicker: "10", description: "Time, money, and operating upside created by implementation." },
  { id: "implementationRecommendation", label: "Implementation Recommendation", kicker: "11", description: "Recommended delivery model, timeline, and investment framing." },
  { id: "upsellArchitecture", label: "Upsell Architecture", kicker: "12", description: "How the audit naturally leads into implementation and ongoing support." },
  { id: "consultantNotes", label: "Consultant Notes", kicker: "13", description: "Final recommendation, next step, and consultant perspective." }
];

const defaultSectionOrder = sectionDefinitions.map((section) => section.id);

const defaultSectionVisibility = sectionDefinitions.reduce<Record<SectionId, boolean>>((accumulator, section) => {
  accumulator[section.id] = true;
  return accumulator;
}, {} as Record<SectionId, boolean>);

const industryNarratives: Record<
  Industry,
  {
    preparedFor: string;
    sizeEstimate: string;
    inboundVolume: string;
    tools: string;
    leadChannels: string;
    deliveryModel: string;
    notes: string;
    manualObservations: string;
    executiveState: string;
    keyIssues: string;
    opportunities: string;
    focus: string;
    snapshot: SnapshotItem[];
    workflowIssues: WorkflowIssue[];
    aiOpportunities: OpportunityItem[];
    automationOpportunities: OpportunityItem[];
    salesInefficiencies: LeadIssue[];
  }
> = {
  "Mortgage Broker": {
    preparedFor: "Emma Lewis, Founder",
    sizeEstimate: "8-15 team members",
    inboundVolume: "80 new enquiries / month",
    tools: "HubSpot, Gmail, Calendly, Notion, Xero",
    leadChannels: "Referrals, paid search, repeat clients, broker partners",
    deliveryModel: "Founder-led qualification with ops-supported settlements",
    notes: "Demand is healthy, but response speed and document handling still rely on a small number of people.",
    manualObservations: "Trust is present on the site, though conversion friction appears in document collection and follow-up.",
    executiveState:
      "Demand is strong and advisory quality is trusted. Growth is now constrained by manual follow-up, uneven lead response, and founder dependency across qualification and settlement handoffs.",
    keyIssues:
      "Lead response speed varies, pipeline updates are manual, and post-call follow-up is inconsistent once workload spikes.",
    opportunities:
      "Automate the handoff layer, use AI for first-response drafting, and standardize qualification summaries before introducing heavier workflow automation.",
    focus:
      "Protect lead response and tighten follow-up ownership first, then standardize proposal and settlement handoffs before scaling reporting.",
    snapshot: [
      { id: "offer", label: "Core offer", value: "Home loans, refinancing, investor finance strategy" },
      { id: "client-fit", label: "Best-fit clients", value: "Professionals, property investors, time-poor families" },
      { id: "ops-pressure", label: "Primary bottleneck", value: "Manual follow-up and founder inbox load" },
      { id: "decision-cycle", label: "Decision cycle", value: "7-30 days depending on lender complexity" }
    ],
    workflowIssues: [
      {
        id: "response",
        title: "Lead response slows when founder load spikes",
        description: "High-intent enquiries often wait for manual triage and a founder-written first reply.",
        businessImpact: "Warm leads cool quickly and conversion quality drops.",
        severity: "High"
      },
      {
        id: "docs",
        title: "Document collection creates repeated admin loops",
        description: "Clients are asked for similar information across calls, emails, and file requests.",
        businessImpact: "Advisor time is lost to repeated chases and clarification.",
        severity: "High"
      },
      {
        id: "handoff",
        title: "Settlement handoffs rely on memory",
        description: "Context from qualification does not always arrive cleanly to operations.",
        businessImpact: "Momentum drops and client confidence weakens during delivery.",
        severity: "Medium"
      }
    ],
    aiOpportunities: [
      {
        id: "ai-triage",
        area: "Lead response",
        opportunity: "AI-assisted first-response drafting based on enquiry intent and lender fit.",
        systemType: "Assisted response layer",
        readiness: "Ready",
        expectedImpact: "Faster same-hour responses without lowering quality."
      },
      {
        id: "ai-qa",
        area: "Qualification",
        opportunity: "Summarize call notes into a clean qualification brief for every lead.",
        systemType: "Meeting summary workflow",
        readiness: "Ready",
        expectedImpact: "Cleaner next actions and fewer missed details."
      }
    ],
    automationOpportunities: [
      {
        id: "auto-followup",
        area: "Follow-up",
        opportunity: "Trigger reminders and client nudges after document requests or stalled applications.",
        systemType: "Workflow automation",
        readiness: "Ready",
        expectedImpact: "Fewer dormant files and stronger pipeline progression."
      },
      {
        id: "auto-reporting",
        area: "Reporting",
        opportunity: "Generate weekly pipeline summaries from CRM stages and lender progress.",
        systemType: "Ops reporting layer",
        readiness: "Pilot First",
        expectedImpact: "Better leadership visibility with less manual assembly."
      }
    ],
    salesInefficiencies: [
      {
        id: "lead-cooling",
        title: "Warm enquiries lose urgency before first follow-up",
        symptom: "Reply speed depends on inbox load and ad hoc triage.",
        consequence: "Conversion leakage during the most valuable window.",
        recommendedResponse: "Introduce same-hour response coverage and AI-supported first drafts."
      },
      {
        id: "qualification-depth",
        title: "Qualification quality varies by advisor",
        symptom: "Notes are inconsistent and next steps are not always structured.",
        consequence: "Proposal and lender-fit decisions take longer than they should.",
        recommendedResponse: "Adopt one qualification template and auto-summarize every call."
      },
      {
        id: "post-call",
        title: "Post-call follow-up ownership is blurry",
        symptom: "Actions live across email, CRM tasks, and memory.",
        consequence: "Clients wait longer than expected for next steps.",
        recommendedResponse: "Use stage-based follow-up triggers and explicit owners."
      }
    ]
  },
  "Accounting Firm": {
    preparedFor: "Luca Nguyen, Managing Partner",
    sizeEstimate: "12-25 team members",
    inboundVolume: "55 qualified enquiries / month",
    tools: "Xero Practice Manager, Gmail, HubSpot, FYI Docs, Slack",
    leadChannels: "Referrals, outbound partner channels, local search, repeat clients",
    deliveryModel: "Partner-led advisory with team-based compliance delivery",
    notes: "Client demand is stable, but delivery consistency and follow-up speed soften whenever partners absorb too much coordination.",
    manualObservations: "Authority is strong, though proposal and onboarding steps still feel manually stitched together.",
    executiveState:
      "The firm has credibility and recurring demand, but partner dependency, manual onboarding, and inconsistent follow-up are absorbing too much senior capacity.",
    keyIssues:
      "Proposal turnaround varies, intake information is duplicated, and client updates rely on manual reminders.",
    opportunities:
      "Use AI to draft scoping and summary material, standardize handoffs, and automate recurring client communication and reporting workflows.",
    focus:
      "Standardize intake and proposal preparation first, then automate recurring client comms and internal status reporting.",
    snapshot: [
      { id: "offer", label: "Core offer", value: "Tax, CFO advisory, compliance, business structuring" },
      { id: "client-fit", label: "Best-fit clients", value: "Growth-stage SMEs, founders, professional services firms" },
      { id: "ops-pressure", label: "Primary bottleneck", value: "Partner review load and intake duplication" },
      { id: "decision-cycle", label: "Decision cycle", value: "14-45 days depending on scope and urgency" }
    ],
    workflowIssues: [
      {
        id: "proposal",
        title: "Proposal turnaround is uneven",
        description: "Scoping documents depend on partner review cycles and manually collated client context.",
        businessImpact: "Sales cycles lengthen and close momentum fades.",
        severity: "High"
      },
      {
        id: "onboarding",
        title: "Onboarding repeats information already captured",
        description: "Client data is re-entered across intake forms, document requests, and internal notes.",
        businessImpact: "Senior and admin time is wasted on avoidable admin.",
        severity: "High"
      },
      {
        id: "visibility",
        title: "Internal status visibility arrives late",
        description: "Weekly reporting is manually assembled from multiple systems.",
        businessImpact: "Leaders make slower resourcing and follow-up decisions.",
        severity: "Medium"
      }
    ],
    aiOpportunities: [
      {
        id: "ai-scope",
        area: "Scoping",
        opportunity: "Draft engagement scopes and summaries from structured intake notes.",
        systemType: "Proposal drafting support",
        readiness: "Ready",
        expectedImpact: "Faster proposals with stronger consistency."
      },
      {
        id: "ai-knowledge",
        area: "Internal knowledge",
        opportunity: "Answer recurring policy and precedent questions from a curated knowledge base.",
        systemType: "Internal assistant",
        readiness: "Pilot First",
        expectedImpact: "Less partner interruption and faster staff execution."
      }
    ],
    automationOpportunities: [
      {
        id: "auto-onboarding",
        area: "Client onboarding",
        opportunity: "Automate task creation and document request sequences after engagement acceptance.",
        systemType: "Workflow automation",
        readiness: "Ready",
        expectedImpact: "Smoother onboarding with less admin rework."
      },
      {
        id: "auto-reporting",
        area: "Firm reporting",
        opportunity: "Create weekly delivery and pipeline summaries from existing systems.",
        systemType: "Reporting automation",
        readiness: "Pilot First",
        expectedImpact: "Faster visibility into capacity, risk, and growth opportunities."
      }
    ],
    salesInefficiencies: [
      {
        id: "scope-drift",
        title: "Scoping conversations drift before a proposal is sent",
        symptom: "Client context is held in inboxes, calls, and partner notes.",
        consequence: "Proposals take longer and client confidence softens.",
        recommendedResponse: "Use one scoping template and generate first-draft proposals from it."
      },
      {
        id: "followup-gap",
        title: "Follow-up falls between partners and client service",
        symptom: "Tasks are spread across CRM reminders, inboxes, and memory.",
        consequence: "Interested prospects wait too long for the next touchpoint.",
        recommendedResponse: "Introduce stage-triggered follow-up ownership."
      },
      {
        id: "handoff-gap",
        title: "Closed-won context does not transfer cleanly to onboarding",
        symptom: "Delivery teams re-ask questions already covered in sales.",
        consequence: "Clients experience a slow, repetitive onboarding period.",
        recommendedResponse: "Create a mandatory client handoff summary for every new engagement."
      }
    ]
  },
  "Dental Clinic": {
    preparedFor: "Practice Director",
    sizeEstimate: "10-20 team members",
    inboundVolume: "120 booking requests / month",
    tools: "Cliniko, Gmail, Google Ads, SMS, Xero",
    leadChannels: "Search, repeat patients, referrals",
    deliveryModel: "Reception-led bookings with clinician-led delivery",
    notes: "Front desk throughput defines growth, and small delays quickly affect booking conversion.",
    manualObservations: "The clinic looks credible, though reminders and post-treatment follow-up remain manual.",
    executiveState:
      "Patient demand exists, but the clinic is still relying on manual front-desk coordination for bookings, reminders, and reactivation.",
    keyIssues: "Booking response, no-show follow-up, and reactivation sequences are inconsistent.",
    opportunities: "Use AI for response support and automation for reminders, reactivation, and scheduling handoffs.",
    focus: "Stabilize booking conversion and reactivation before expanding reporting or internal assistants.",
    snapshot: [
      { id: "offer", label: "Core offer", value: "General dentistry, cosmetic treatments, hygiene plans" },
      { id: "client-fit", label: "Best-fit patients", value: "Families, cosmetic cases, recurring hygiene patients" },
      { id: "ops-pressure", label: "Primary bottleneck", value: "Reception load and reactivation follow-up" },
      { id: "decision-cycle", label: "Decision cycle", value: "Same day to 14 days depending on treatment value" }
    ],
    workflowIssues: [
      {
        id: "booking",
        title: "Booking requests wait too long for confirmation",
        description: "Reception load creates delays across calls, forms, and missed callbacks.",
        businessImpact: "Booking conversion drops when urgency is lost.",
        severity: "High"
      },
      {
        id: "no-show",
        title: "No-show and late cancellation handling is reactive",
        description: "Follow-up is inconsistent and rebooking opportunities are missed.",
        businessImpact: "Chair utilization and revenue suffer.",
        severity: "Medium"
      },
      {
        id: "reactivation",
        title: "Patient reactivation is underused",
        description: "There is no consistent process to bring overdue patients back in.",
        businessImpact: "Lifetime value is lower than it should be.",
        severity: "Medium"
      }
    ],
    aiOpportunities: [
      {
        id: "ai-booking",
        area: "Reception support",
        opportunity: "AI-assisted reply suggestions for booking and treatment enquiries.",
        systemType: "Response support",
        readiness: "Ready",
        expectedImpact: "Faster, more consistent patient communication."
      }
    ],
    automationOpportunities: [
      {
        id: "auto-reminders",
        area: "Reminders",
        opportunity: "Automate reminders, no-show recovery, and reactivation sequences.",
        systemType: "Patient lifecycle automation",
        readiness: "Ready",
        expectedImpact: "Higher booking utilization and patient retention."
      }
    ],
    salesInefficiencies: [
      {
        id: "reception-load",
        title: "High-value enquiries compete with everyday front-desk workload",
        symptom: "Callbacks and form responses queue behind day-to-day admin.",
        consequence: "Treatment conversion slows.",
        recommendedResponse: "Introduce same-day triage rules and templated reply support."
      }
    ]
  },
  "Law Firm": {
    preparedFor: "Managing Partner",
    sizeEstimate: "10-22 team members",
    inboundVolume: "40 qualified matters / month",
    tools: "Clio, Gmail, Calendly, Slack, Xero",
    leadChannels: "Referrals, search, partnerships",
    deliveryModel: "Partner-led intake with associate-led matter delivery",
    notes: "Intake quality is strong, but partner dependency still defines response speed and matter onboarding.",
    manualObservations: "Trust is high, though matter intake and handoff remain fragmented.",
    executiveState:
      "The firm is trusted, but intake, follow-up, and matter handoff still depend too heavily on senior attention and manual coordination.",
    keyIssues: "Matter intake, engagement follow-up, and internal handoffs create delays and repeat work.",
    opportunities: "Use AI for summaries and drafting support, then automate client updates and internal task creation.",
    focus: "Tighten intake ownership and client communication first.",
    snapshot: [
      { id: "offer", label: "Core offer", value: "Commercial, employment, and advisory matters" },
      { id: "client-fit", label: "Best-fit clients", value: "SMEs, employers, owner-led businesses" },
      { id: "ops-pressure", label: "Primary bottleneck", value: "Partner-led intake and handoff depth" },
      { id: "decision-cycle", label: "Decision cycle", value: "7-21 days for most retained matters" }
    ],
    workflowIssues: [
      {
        id: "intake",
        title: "Matter intake depends on senior availability",
        description: "Initial responses and fit assessment sit with a small number of people.",
        businessImpact: "Potential matters wait too long for momentum.",
        severity: "High"
      }
    ],
    aiOpportunities: [
      {
        id: "ai-summary",
        area: "Matter intake",
        opportunity: "Generate concise matter summaries and suggested next steps from intake notes.",
        systemType: "Summary support",
        readiness: "Ready",
        expectedImpact: "Cleaner handoffs and less senior rework."
      }
    ],
    automationOpportunities: [
      {
        id: "auto-client-updates",
        area: "Client updates",
        opportunity: "Automate internal reminders and client update checkpoints.",
        systemType: "Workflow automation",
        readiness: "Pilot First",
        expectedImpact: "Better visibility and fewer dropped follow-ups."
      }
    ],
    salesInefficiencies: [
      {
        id: "matter-followup",
        title: "Follow-up on new matters is inconsistent",
        symptom: "Tasks live in inboxes and personal reminders.",
        consequence: "Matter conversion slows and clients experience uncertainty.",
        recommendedResponse: "Use stage-based task creation and clear owners."
      }
    ]
  },
  "Trades Business": {
    preparedFor: "Owner Operator",
    sizeEstimate: "10-30 field and office staff",
    inboundVolume: "140 quote requests / month",
    tools: "ServiceM8, Gmail, Xero, phone, SMS",
    leadChannels: "Search, referrals, repeat clients",
    deliveryModel: "Office triage with field-team delivery",
    notes: "Quote speed and scheduling reliability determine win rate more than top-of-funnel demand.",
    manualObservations: "The business looks capable, but quotes, scheduling, and review capture are still manual.",
    executiveState:
      "Demand is present, but quote turnaround, job scheduling, and follow-up still rely on office coordination and memory.",
    keyIssues: "Quote speed, call handling, and post-job follow-up are inconsistent.",
    opportunities: "Use AI for quote drafting support and automate scheduling, reminders, and review requests.",
    focus: "Reduce quote delays and tighten after-hours lead handling first.",
    snapshot: [
      { id: "offer", label: "Core offer", value: "Service jobs, maintenance, and project installs" },
      { id: "client-fit", label: "Best-fit clients", value: "Residential homeowners, strata, small commercial" },
      { id: "ops-pressure", label: "Primary bottleneck", value: "Quote turnaround and scheduling gaps" },
      { id: "decision-cycle", label: "Decision cycle", value: "Same day to 10 days depending on scope" }
    ],
    workflowIssues: [
      {
        id: "quotes",
        title: "Quote turnaround is too dependent on owner availability",
        description: "Site notes and pricing details are manually assembled before a quote can be sent.",
        businessImpact: "High-intent jobs go elsewhere.",
        severity: "High"
      }
    ],
    aiOpportunities: [
      {
        id: "ai-quote",
        area: "Quote drafting",
        opportunity: "Generate first-draft quotes from technician notes and pricing rules.",
        systemType: "Quote drafting support",
        readiness: "Ready",
        expectedImpact: "Faster quote turnaround with cleaner consistency."
      }
    ],
    automationOpportunities: [
      {
        id: "auto-reminders",
        area: "Scheduling",
        opportunity: "Automate appointment reminders, review asks, and no-response follow-up.",
        systemType: "Lifecycle automation",
        readiness: "Ready",
        expectedImpact: "Higher close rates and stronger post-job follow-through."
      }
    ],
    salesInefficiencies: [
      {
        id: "after-hours",
        title: "After-hours leads wait too long for a response",
        symptom: "Calls and web forms queue until office hours resume.",
        consequence: "Urgent jobs book with faster competitors.",
        recommendedResponse: "Use first-response automation with clear next-step messaging."
      }
    ]
  }
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function createSeedAudit(partial: Pick<AuditDocument, "id" | "status" | "stage"> & { companyName: string; industry: Industry; location: string }): AuditDocument {
  const narrative = industryNarratives[partial.industry];
  const createdAt = new Date().toISOString();
  const scores = buildScores(DEFAULT_AUDIT_CATEGORIES, partial.industry);
  const assumptions = calculateAssumptions(scores);

  return {
    id: partial.id,
    createdAt,
    updatedAt: createdAt,
    status: partial.status,
    stage: partial.stage,
    meta: {
      reportTitle: "AI Efficiency Audit",
      reportSubtitle: "Where time is being lost, what to fix first, and where AI can help without adding complexity.",
      clientBusinessName: partial.companyName,
      preparedFor: narrative.preparedFor,
      reportDate: formatDate(new Date()),
      preparedBy: "AuditAI Advisory",
      positioningLine: "Premium diagnostic roadmap for faster response, cleaner delivery, and lower manual overhead.",
      agencyName: "AuditAI Advisory",
      logoText: "AA",
      primaryColor: "#009866"
    },
    profile: {
      industry: partial.industry,
      website: `https://${partial.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com.au`,
      location: partial.location,
      sizeEstimate: narrative.sizeEstimate,
      inboundVolume: narrative.inboundVolume,
      tools: narrative.tools,
      leadChannels: narrative.leadChannels,
      deliveryModel: narrative.deliveryModel,
      notes: narrative.notes,
      manualObservations: narrative.manualObservations
    },
    executiveSummary: {
      currentState: narrative.executiveState,
      keyIssues: narrative.keyIssues,
      primaryOpportunities: narrative.opportunities,
      recommendedFocus: narrative.focus
    },
    companySnapshot: narrative.snapshot,
    workflowIssues: narrative.workflowIssues,
    aiOpportunities: narrative.aiOpportunities,
    automationOpportunities: narrative.automationOpportunities,
    salesInefficiencies: narrative.salesInefficiencies,
    quickWins: [
      "Set one response-time standard and fallback owner for every new lead.",
      "Use a single qualification or intake template for every opportunity.",
      "Automate follow-up reminders after calls, proposals, and delivery milestones.",
      "Ship one operating summary each week before leadership review.",
      "Define a clear handoff summary before work moves to the next team."
    ],
    roadmap: [
      {
        id: "phase-now",
        phase: "Now",
        title: "Stabilize speed and ownership",
        objective: "Protect response speed and stop avoidable task drop-off.",
        actions: [
          "Set one owner for every high-friction stage.",
          "Introduce AI-supported first-response or drafting workflows.",
          "Deploy follow-up triggers after calls, proposals, and key milestones."
        ],
        likelyOutcome: "Faster response and fewer dropped actions inside the first month."
      },
      {
        id: "phase-next",
        phase: "Next",
        title: "Standardize handoffs",
        objective: "Reduce rework by improving context transfer between sales, delivery, and operations.",
        actions: [
          "Create one structured handoff summary for every won opportunity.",
          "Consolidate core process knowledge into one operating source.",
          "Introduce consistent proposal or onboarding templates."
        ],
        likelyOutcome: "Cleaner execution with less internal back-and-forth."
      },
      {
        id: "phase-later",
        phase: "Later",
        title: "Scale visibility and optimization",
        objective: "Give leadership faster visibility without manual reporting overhead.",
        actions: [
          "Automate recurring reporting and exception monitoring.",
          "Review quality checkpoints and edge cases monthly.",
          "Track realized time savings and conversion lift against the baseline."
        ],
        likelyOutcome: "A more resilient operating rhythm with lower admin dependency."
      }
    ],
    implementationRecommendation: {
      summary:
        "The strongest path is a staged implementation that starts with one quick-win operating layer, then moves into workflow tightening and reporting visibility once the basics are stable.",
      whyNow:
        "The business already has enough demand and operating complexity for AI support to create meaningful leverage. The risk is not moving too early. The risk is letting manual admin and slow follow-up continue to absorb senior time.",
      recommendedOffer: "AI Audit + 30-day implementation sprint",
      estimatedTimeline: "2 to 6 weeks depending on internal complexity and system access",
      investmentRange: "$3k–$12k depending on scope, integrations, and delivery depth"
    },
    upsellArchitecture: {
      quickWinOffer: "Quick-win implementation sprint focused on response speed, follow-up, and one reporting workflow",
      coreImplementationOffer: "Done-for-you operating layer covering qualification, admin reduction, and reporting improvements",
      ongoingSupportOffer: "Monthly optimization and support retainer for refinement, reporting, and new workflow rollouts",
      positioningNote:
        "The audit should feel like the diagnostic entry point. The implementation offer should feel like the obvious next step once the client sees where time and money are being lost."
    },
    consultantNotes: {
      clientNotes:
        "This business does not need a bigger tool stack first. It needs tighter ownership, faster response coverage, and a more structured handoff layer before scaling automation.",
      internalNotes:
        "Founder or partner dependency remains the core risk. Position the first phase around speed, consistency, and quality control rather than broad AI transformation language.",
      nextSteps:
        "Run a 30-day implementation sprint focused on response speed, handoff quality, and follow-up reliability before introducing larger automation scope."
    },
    scores,
    recommendations: buildRecommendations(scores),
    assumptions,
    sections: {
      order: [...defaultSectionOrder],
      visibility: { ...defaultSectionVisibility }
    }
  };
}

export const demoAudits: AuditDocument[] = [
  createSeedAudit({
    id: "audit-mortgage-1",
    companyName: "Northline Mortgage Advisory",
    industry: "Mortgage Broker",
    location: "Sydney",
    status: "Ready for Report",
    stage: "Full Audit"
  }),
  createSeedAudit({
    id: "audit-accounting-1",
    companyName: "Harbor Ridge Accounting",
    industry: "Accounting Firm",
    location: "Melbourne",
    status: "In Progress",
    stage: "Pre-Audit"
  })
];

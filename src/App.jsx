import { useMemo, useState } from "react";

const initialAudit = {
  meta: {
    reportTitle: "AI Efficiency Audit",
    reportSubtitle: "Operational Breakdown & System Recommendations",
    clientBusinessName: "Northstar Property Advisory",
    preparedFor: "Emma Lewis, Founder",
    date: "17 March 2026",
    preparedBy: "Temporary Utopia"
  },
  executiveSummary: {
    currentState:
      "Leads are healthy and delivery quality is strong. As volume rises, manual coordination creates lag between sales, delivery, and reporting.",
    keyIssues:
      "Lead response speed varies by owner availability. Proposal drafting and reporting are repeatedly assembled by hand.",
    primaryOpportunities:
      "Standardise handoffs, automate repeat admin, and add AI-assisted support to response, proposals, and reporting summaries.",
    recommendedFocus:
      "Prioritise response speed and workflow consistency first, then roll out higher-leverage systems with clear ownership controls."
  },
  businessSnapshot: [
    { label: "Business Type", value: "Boutique property advisory service" },
    { label: "Team Size", value: "8 total (2 founders, 4 advisors, 2 ops)" },
    { label: "Core Services", value: "Portfolio planning, acquisition advisory, strategy reviews" },
    { label: "Lead Sources", value: "Referrals, inbound web enquiries, LinkedIn, partner channels" },
    { label: "Current Tools", value: "HubSpot, Gmail, Notion, Calendly, Slack, Xero" },
    { label: "Sales / Delivery Model", value: "Founder-led sales, advisor-led delivery, ops-assisted follow-through" },
    { label: "Key Workflow Areas Reviewed", value: "Lead intake, qualification, booking, delivery, follow-up, reporting and admin" }
  ],
  workflowMap: [
    {
      stage: "Lead Capture",
      happening: "Enquiries arrive via web form, email, LinkedIn, and referral channels.",
      owner: "Marketing + Founder",
      tools: "Web forms, Gmail, LinkedIn",
      friction: "Medium"
    },
    {
      stage: "Lead Response",
      happening: "First response quality is good, but speed depends on founder inbox load.",
      owner: "Founder",
      tools: "Gmail, phone",
      friction: "High"
    },
    {
      stage: "Qualification",
      happening: "Fit and urgency checks are done manually with inconsistent note depth.",
      owner: "Founder + Advisors",
      tools: "HubSpot, Notion",
      friction: "Medium"
    },
    {
      stage: "Booking / Conversion",
      happening: "Calls are scheduled quickly, but proposal turnaround varies by current workload.",
      owner: "Founder + Ops",
      tools: "Calendly, Docs, email",
      friction: "Medium"
    },
    {
      stage: "Delivery",
      happening: "Delivery quality remains high but process standards differ by advisor.",
      owner: "Advisors",
      tools: "Notion, spreadsheets",
      friction: "Medium"
    },
    {
      stage: "Follow-Up",
      happening: "Post-engagement follow-up is ad hoc and often delayed.",
      owner: "Operations",
      tools: "HubSpot, email",
      friction: "High"
    },
    {
      stage: "Reporting / Admin",
      happening: "Weekly reporting and internal admin updates are manually assembled.",
      owner: "Operations + Founder",
      tools: "HubSpot exports, Notion, Xero",
      friction: "High"
    }
  ],
  frictionIssues: [
    {
      title: "Slow Lead Follow-Up",
      happening: "First response times vary from 15 minutes to 24 hours based on owner workload.",
      whyItMatters: "Delays reduce conversion quality and cool high-intent enquiries.",
      severity: "High",
      impactType: "Revenue"
    },
    {
      title: "Repeated Manual Admin",
      happening: "Qualification notes and status updates are entered across multiple tools.",
      whyItMatters: "Admin overhead consumes advisory capacity each week.",
      severity: "High",
      impactType: "Time"
    },
    {
      title: "Inconsistent Proposal Handling",
      happening: "Proposal structure and turnaround differ by owner and urgency.",
      whyItMatters: "Inconsistency drives rework and weakens expectation setting.",
      severity: "Medium",
      impactType: "Consistency"
    },
    {
      title: "Weak Handoffs",
      happening: "Sales context does not flow cleanly into delivery planning.",
      whyItMatters: "Delivery teams ask repeated questions and lose momentum.",
      severity: "Medium",
      impactType: "Visibility"
    },
    {
      title: "Reporting Built by Hand",
      happening: "Pipeline and performance snapshots are manually stitched together weekly.",
      whyItMatters: "Decision cadence slows and visibility quality drops.",
      severity: "High",
      impactType: "Visibility"
    }
  ],
  communicationGaps: [
    {
      gap: "Unclear ownership",
      signal: "Tasks remain in chat threads without explicit owner assignment.",
      effect: "Follow-through is inconsistent between sales, delivery, and admin."
    },
    {
      gap: "Repeated questions",
      signal: "Delivery team requests context already captured during qualification.",
      effect: "Client confidence drops and onboarding time extends."
    },
    {
      gap: "Fragmented information",
      signal: "Critical details are split across inboxes, notes, and CRM records.",
      effect: "Decision quality depends on who is online and context-rich."
    },
    {
      gap: "Missed updates",
      signal: "Status changes are not reflected consistently across tools.",
      effect: "Leaders act on stale assumptions."
    },
    {
      gap: "Approval bottlenecks",
      signal: "Founder sign-off is required on low-risk, high-volume actions.",
      effect: "Throughput plateaus during busy periods."
    }
  ],
  opportunities: [
    {
      area: "Lead Response",
      opportunity: "AI-assisted triage and first-draft response support",
      systemType: "Assisted responder workflow",
      readiness: "Ready",
      expectedImpact: "Faster first responses and stronger conversion continuity"
    },
    {
      area: "Follow-Up",
      opportunity: "Automated post-call and post-project sequence triggers",
      systemType: "Workflow automation",
      readiness: "Ready",
      expectedImpact: "Less dropped follow-through and cleaner client continuity"
    },
    {
      area: "Admin",
      opportunity: "Auto-generate tasks and stage updates from notes",
      systemType: "Task orchestration layer",
      readiness: "Needs process clarity",
      expectedImpact: "Reduced repeated admin and less owner prompting"
    },
    {
      area: "Knowledge",
      opportunity: "Internal assistant for SOPs, proposals, and client context",
      systemType: "Knowledge assistant",
      readiness: "Needs source cleanup",
      expectedImpact: "Lower dependency on inbox memory and senior heads"
    },
    {
      area: "Reporting",
      opportunity: "Weekly summary workflow across pipeline and delivery",
      systemType: "Summary pipeline",
      readiness: "Ready",
      expectedImpact: "Better leadership visibility with less manual assembly"
    },
    {
      area: "Proposals",
      opportunity: "Assisted drafting from qualification notes and prior examples",
      systemType: "Draft support system",
      readiness: "Pilot first",
      expectedImpact: "Faster proposal turnaround with improved consistency"
    }
  ],
  systemRecommendations: [
    {
      systemName: "AI Lead Response Layer",
      whatItDoes: "Assists triage and first-draft replies using agreed qualification logic.",
      whyItMatters: "Improves response speed without lowering quality control.",
      complexity: "Low",
      rolloutPhase: "Phase 1"
    },
    {
      systemName: "Follow-Up Automation Flow",
      whatItDoes: "Triggers client and team follow-up sequences after key milestones.",
      whyItMatters: "Protects pipeline continuity and reduces dropped actions.",
      complexity: "Low",
      rolloutPhase: "Phase 1"
    },
    {
      systemName: "Proposal Drafting Support",
      whatItDoes: "Generates first-draft proposals from structured discovery fields.",
      whyItMatters: "Cuts manual drafting time and standardises output quality.",
      complexity: "Medium",
      rolloutPhase: "Phase 2"
    },
    {
      systemName: "Internal Knowledge Assistant",
      whatItDoes: "Centralises searchable answers across SOPs and client histories.",
      whyItMatters: "Reduces repeated questions and owner dependency.",
      complexity: "Medium",
      rolloutPhase: "Phase 2"
    },
    {
      systemName: "Reporting Summary System",
      whatItDoes: "Creates weekly operational snapshots from selected data sources.",
      whyItMatters: "Improves decision cadence and visibility quality.",
      complexity: "High",
      rolloutPhase: "Phase 3"
    }
  ],
  implementationPlan: [
    {
      phase: "Phase 1",
      title: "Immediate quick wins",
      objective: "Stabilise response speed and remove obvious repeat admin.",
      actions: [
        "Deploy triage rules and first-response drafting support.",
        "Set follow-up triggers after calls and project milestones.",
        "Assign explicit owner at each high-friction stage."
      ],
      likelyOutcome: "Faster throughput and fewer dropped tasks in 2-4 weeks."
    },
    {
      phase: "Phase 2",
      title: "Stabilise key workflows",
      objective: "Improve consistency through stronger handoffs and standardised execution.",
      actions: [
        "Introduce structured handoff summary from sales to delivery.",
        "Deploy proposal drafting support linked to qualification fields.",
        "Consolidate key knowledge into a searchable base."
      ],
      likelyOutcome: "Lower rework and more consistent delivery quality."
    },
    {
      phase: "Phase 3",
      title: "Scale higher-leverage systems",
      objective: "Increase decision quality while reducing manual reporting effort.",
      actions: [
        "Roll out automated weekly reporting summaries.",
        "Add approval controls for quality and exception handling.",
        "Review system performance monthly and refine."
      ],
      likelyOutcome: "Cleaner execution rhythm and stronger decision confidence."
    }
  ],
  quickWins: [
    "Set a 60-minute response standard with fallback owner coverage.",
    "Use one structured qualification template across the team.",
    "Automate reminder triggers for post-call and post-project follow-up.",
    "Adopt a single proposal format with approval thresholds.",
    "Publish a weekly operational summary before leadership review."
  ],
  riskReadiness: [
    {
      risk: "Team adoption risk",
      note: "New systems may be bypassed if the workflow feels heavier than current habits."
    },
    {
      risk: "Over-automation risk",
      note: "Automating unclear process can scale errors and reduce service quality."
    },
    {
      risk: "Weak process clarity",
      note: "Undefined handoffs create unreliable automation logic."
    },
    {
      risk: "Poor data hygiene",
      note: "Inconsistent CRM fields weaken triage and reporting reliability."
    },
    {
      risk: "Unclear ownership",
      note: "Shared responsibility without explicit accountability stalls exceptions."
    },
    {
      risk: "Missing human approvals",
      note: "No approval checkpoints can create avoidable output risk."
    }
  ],
  estimatedImpact: [
    {
      category: "Faster lead response",
      baseline: "Variable and owner-dependent",
      projected: "More consistent same-hour response coverage",
      confidence: "High"
    },
    {
      category: "Less admin time",
      baseline: "High manual status handling",
      projected: "Reduced repetitive admin and cleaner handoff overhead",
      confidence: "Medium"
    },
    {
      category: "Stronger consistency",
      baseline: "Execution varies by operator",
      projected: "More repeatable proposals and delivery workflows",
      confidence: "Medium"
    },
    {
      category: "Improved visibility",
      baseline: "Reporting assembled manually",
      projected: "Regular summary cadence with fewer blind spots",
      confidence: "High"
    },
    {
      category: "Cleaner execution",
      baseline: "Fragmented process and tool movement",
      projected: "Clear stage ownership and stronger follow-through",
      confidence: "Medium"
    }
  ],
  nextSteps: {
    optionOne:
      "Use this report internally to sequence quick wins, assign ownership, and run phased implementation in-house.",
    optionTwo:
      "Engage Temporary Utopia for hands-on implementation support, rollout control, and operating system refinement."
  }
};

const badgeTones = {
  neutral: "border-zinc-300 bg-zinc-100 text-zinc-700",
  low: "border-zinc-300 bg-zinc-100 text-zinc-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  caution: "border-orange-200 bg-orange-50 text-orange-700"
};

function toneFromSeverity(value) {
  const lower = value.toLowerCase();
  if (lower.includes("high")) return "high";
  if (lower.includes("medium")) return "medium";
  return "low";
}

function toneFromReadiness(value) {
  const lower = value.toLowerCase();
  if (lower.includes("ready")) return "ready";
  if (lower.includes("pilot")) return "medium";
  return "caution";
}

function Page({ children, breakAfter = true }) {
  return (
    <section
      className={`report-page w-full border border-zinc-200 bg-white p-8 shadow-report print:shadow-none ${
        breakAfter ? "print:break-after-page" : ""
      }`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ number, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="border-b border-zinc-200 pb-3">
        <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">{number}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      </div>
      {subtitle ? <p className="mt-3 max-w-4xl text-sm leading-relaxed text-zinc-600">{subtitle}</p> : null}
    </div>
  );
}

function Badge({ label, tone = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
        badgeTones[tone] || badgeTones.neutral
      }`}
    >
      {label}
    </span>
  );
}

function InputLabel({ children }) {
  return <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">{children}</label>;
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
    />
  );
}

function TextArea({ value, onChange, rows = 3, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed text-zinc-900 outline-none transition focus:border-zinc-500"
    />
  );
}

export default function App() {
  const [audit, setAudit] = useState(initialAudit);
  const [jsonDraft, setJsonDraft] = useState(JSON.stringify(initialAudit, null, 2));
  const [jsonError, setJsonError] = useState("");
  const [mode, setMode] = useState("builder");

  const quickWinText = useMemo(() => audit.quickWins.join("\n"), [audit.quickWins]);

  const updateMeta = (key, value) => {
    setAudit((prev) => ({ ...prev, meta: { ...prev.meta, [key]: value } }));
  };

  const updateExecutive = (key, value) => {
    setAudit((prev) => ({
      ...prev,
      executiveSummary: { ...prev.executiveSummary, [key]: value }
    }));
  };

  const updateListFromLines = (value) => {
    const rows = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    setAudit((prev) => ({ ...prev, quickWins: rows }));
  };

  const applyJsonDraft = () => {
    try {
      const parsed = JSON.parse(jsonDraft);
      setAudit(parsed);
      setJsonError("");
    } catch (error) {
      setJsonError(error.message);
    }
  };

  const reloadCurrentData = () => {
    setJsonDraft(JSON.stringify(audit, null, 2));
    setJsonError("");
  };

  const resetData = () => {
    setAudit(initialAudit);
    setJsonDraft(JSON.stringify(initialAudit, null, 2));
    setJsonError("");
  };

  return (
    <div
      className="min-h-screen bg-canvas text-zinc-900"
      style={{ fontFamily: '"Suisse Intl", "Avenir Next", "Manrope", "Segoe UI", sans-serif' }}
    >
      <header className="screen-only border-b border-zinc-300 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Temporary Utopia</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">AI Efficiency Audit Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`rounded-md border px-3 py-2 text-xs font-medium uppercase tracking-wide ${
                mode === "builder" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"
              }`}
              onClick={() => setMode("builder")}
              type="button"
            >
              Builder
            </button>
            <button
              className={`rounded-md border px-3 py-2 text-xs font-medium uppercase tracking-wide ${
                mode === "preview" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"
              }`}
              onClick={() => setMode("preview")}
              type="button"
            >
              Preview
            </button>
            <button
              className="rounded-md border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
              onClick={() => window.print()}
              type="button"
            >
              Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 md:px-6 lg:grid-cols-12">
        {mode === "builder" ? (
          <aside className="screen-only lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl border border-zinc-300 bg-white p-4">
                <p className="text-sm font-semibold tracking-tight text-zinc-900">Report Meta</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <InputLabel>Client business name</InputLabel>
                    <TextInput
                      value={audit.meta.clientBusinessName}
                      onChange={(event) => updateMeta("clientBusinessName", event.target.value)}
                    />
                  </div>
                  <div>
                    <InputLabel>Prepared for</InputLabel>
                    <TextInput value={audit.meta.preparedFor} onChange={(event) => updateMeta("preparedFor", event.target.value)} />
                  </div>
                  <div>
                    <InputLabel>Date</InputLabel>
                    <TextInput value={audit.meta.date} onChange={(event) => updateMeta("date", event.target.value)} />
                  </div>
                  <div>
                    <InputLabel>Prepared by</InputLabel>
                    <TextInput value={audit.meta.preparedBy} onChange={(event) => updateMeta("preparedBy", event.target.value)} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-300 bg-white p-4">
                <p className="text-sm font-semibold tracking-tight text-zinc-900">Executive Summary</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <InputLabel>Current State</InputLabel>
                    <TextArea
                      value={audit.executiveSummary.currentState}
                      onChange={(event) => updateExecutive("currentState", event.target.value)}
                    />
                  </div>
                  <div>
                    <InputLabel>Key Issues Identified</InputLabel>
                    <TextArea
                      value={audit.executiveSummary.keyIssues}
                      onChange={(event) => updateExecutive("keyIssues", event.target.value)}
                    />
                  </div>
                  <div>
                    <InputLabel>Primary Opportunities</InputLabel>
                    <TextArea
                      value={audit.executiveSummary.primaryOpportunities}
                      onChange={(event) => updateExecutive("primaryOpportunities", event.target.value)}
                    />
                  </div>
                  <div>
                    <InputLabel>Recommended Focus</InputLabel>
                    <TextArea
                      value={audit.executiveSummary.recommendedFocus}
                      onChange={(event) => updateExecutive("recommendedFocus", event.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-300 bg-white p-4">
                <p className="text-sm font-semibold tracking-tight text-zinc-900">Quick Wins</p>
                <p className="mt-2 text-xs text-zinc-600">One line per action.</p>
                <TextArea value={quickWinText} rows={6} onChange={(event) => updateListFromLines(event.target.value)} />
              </div>

              <div className="rounded-xl border border-zinc-300 bg-white p-4">
                <p className="text-sm font-semibold tracking-tight text-zinc-900">Advanced JSON Data</p>
                <p className="mt-2 text-xs text-zinc-600">
                  Full dataset editor for all report sections. Paste valid JSON to update the full audit.
                </p>
                <TextArea value={jsonDraft} rows={14} onChange={(event) => setJsonDraft(event.target.value)} />
                {jsonError ? <p className="mt-2 text-xs text-rose-600">{jsonError}</p> : null}
                <div className="mt-3 flex gap-2">
                  <button
                    className="rounded-md border border-zinc-900 bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                    onClick={applyJsonDraft}
                    type="button"
                  >
                    Apply JSON
                  </button>
                  <button
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700"
                    onClick={reloadCurrentData}
                    type="button"
                  >
                    Load Current
                  </button>
                  <button
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700"
                    onClick={resetData}
                    type="button"
                  >
                    Reset Sample
                  </button>
                </div>
              </div>
            </div>
          </aside>
        ) : null}

        <div className={mode === "builder" ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="mx-auto max-w-[220mm] space-y-6 print:space-y-0">
            <Page>
              <div className="flex min-h-[260mm] flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Temporary Utopia</p>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Diagnostic Report</p>
                </div>

                <div className="mt-16">
                  <div className="inline-flex items-center rounded-full border border-zinc-300 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-700">
                    {audit.meta.reportTitle}
                  </div>
                  <h2 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-zinc-950">
                    {audit.meta.reportTitle}
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg text-zinc-600">{audit.meta.reportSubtitle}</p>

                  <div className="mt-12 grid gap-5 border-y border-zinc-200 py-7 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Client Business Name</p>
                      <p className="mt-2 text-base font-medium text-zinc-900">{audit.meta.clientBusinessName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Prepared For</p>
                      <p className="mt-2 text-base font-medium text-zinc-900">{audit.meta.preparedFor}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Date</p>
                      <p className="mt-2 text-base font-medium text-zinc-900">{audit.meta.date}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Prepared By</p>
                      <p className="mt-2 text-base font-medium text-zinc-900">{audit.meta.preparedBy}</p>
                    </div>
                  </div>
                </div>

                <p className="max-w-3xl text-sm leading-relaxed text-zinc-600">
                  Diagnostic-first audit designed to identify operational friction, rank AI-fit opportunities, and define a
                  practical implementation sequence.
                </p>
              </div>
            </Page>

            <Page>
              <SectionHeading
                number="01"
                title="Executive Summary"
                subtitle="Current operating picture, core issues, and immediate priorities."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <article className="avoid-break rounded-xl border border-zinc-200 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Current State</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">{audit.executiveSummary.currentState}</p>
                </article>
                <article className="avoid-break rounded-xl border border-zinc-200 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Key Issues Identified</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">{audit.executiveSummary.keyIssues}</p>
                </article>
                <article className="avoid-break rounded-xl border border-zinc-200 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Primary Opportunities</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">{audit.executiveSummary.primaryOpportunities}</p>
                </article>
                <article className="avoid-break rounded-xl border border-zinc-200 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Recommended Focus</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">{audit.executiveSummary.recommendedFocus}</p>
                </article>
              </div>

              <div className="mt-12">
                <SectionHeading
                  number="02"
                  title="Business Snapshot"
                  subtitle="Operating context reviewed during the audit."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {audit.businessSnapshot.map((item) => (
                    <article key={item.label} className="avoid-break rounded-xl border border-zinc-200 p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-800">{item.value}</p>
                    </article>
                  ))}
                </div>
              </div>
            </Page>

            <Page>
              <SectionHeading
                number="03"
                title="Current Workflow Map"
                subtitle="Visual stage map showing ownership, tools, and friction concentration."
              />
              <div className="ml-2 border-l border-zinc-200 pl-6">
                {audit.workflowMap.map((stage, index) => (
                  <article key={stage.stage} className="avoid-break relative mb-5 last:mb-0">
                    <span className="absolute -left-[34px] top-5 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-white text-[10px] font-semibold text-zinc-600">
                      {index + 1}
                    </span>
                    <div className="rounded-xl border border-zinc-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold tracking-tight text-zinc-900">{stage.stage}</h3>
                        <Badge label={`Friction: ${stage.friction}`} tone={toneFromSeverity(stage.friction)} />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-700">{stage.happening}</p>
                      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                        <div className="rounded-lg bg-zinc-100 p-3">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Owner</p>
                          <p className="mt-1 text-zinc-800">{stage.owner}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-100 p-3">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Tools</p>
                          <p className="mt-1 text-zinc-800">{stage.tools}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Page>

            <Page>
              <SectionHeading
                number="04"
                title="Friction & Bottleneck Analysis"
                subtitle="Most material inefficiencies affecting time, revenue, and execution consistency."
              />
              <div className="grid gap-4 md:grid-cols-2">
                {audit.frictionIssues.map((issue) => (
                  <article key={issue.title} className="avoid-break rounded-xl border border-zinc-200 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold tracking-tight text-zinc-900">{issue.title}</h3>
                      <Badge label={issue.severity} tone={toneFromSeverity(issue.severity)} />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                      <span className="font-semibold text-zinc-900">What is happening:</span> {issue.happening}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                      <span className="font-semibold text-zinc-900">Why it matters:</span> {issue.whyItMatters}
                    </p>
                    <div className="mt-4">
                      <Badge label={`Impact: ${issue.impactType}`} />
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-12">
                <SectionHeading
                  number="05"
                  title="Communication & Handoff Gaps"
                  subtitle="Where coordination weakens and operational reliability drops."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {audit.communicationGaps.map((gap) => (
                    <article key={gap.gap} className="avoid-break rounded-xl border border-zinc-200 p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{gap.gap}</p>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                        <span className="font-semibold text-zinc-900">Observed signal:</span> {gap.signal}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                        <span className="font-semibold text-zinc-900">Operational effect:</span> {gap.effect}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </Page>

            <Page>
              <SectionHeading
                number="06"
                title="AI & Automation Opportunity Map"
                subtitle="Opportunity matrix highlighting suitability, readiness, and likely operational effect."
              />
              <div className="overflow-hidden rounded-xl border border-zinc-200">
                <div className="grid grid-cols-12 border-b border-zinc-200 bg-zinc-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                  <p className="col-span-2">Area</p>
                  <p className="col-span-3">Opportunity</p>
                  <p className="col-span-2">System Type</p>
                  <p className="col-span-2">Readiness</p>
                  <p className="col-span-3">Expected Impact</p>
                </div>
                {audit.opportunities.map((item) => (
                  <div
                    key={`${item.area}-${item.systemType}`}
                    className="avoid-break grid grid-cols-12 gap-3 border-b border-zinc-200 px-4 py-4 text-sm last:border-b-0"
                  >
                    <p className="col-span-2 font-medium text-zinc-900">{item.area}</p>
                    <p className="col-span-3 text-zinc-700">{item.opportunity}</p>
                    <p className="col-span-2 text-zinc-700">{item.systemType}</p>
                    <p className="col-span-2">
                      <Badge label={item.readiness} tone={toneFromReadiness(item.readiness)} />
                    </p>
                    <p className="col-span-3 text-zinc-700">{item.expectedImpact}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <SectionHeading
                  number="07"
                  title="System Recommendations"
                  subtitle="Concrete diagnostic outputs prepared for phased implementation."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {audit.systemRecommendations.map((rec) => (
                    <article key={rec.systemName} className="avoid-break rounded-xl border border-zinc-200 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-semibold tracking-tight text-zinc-900">{rec.systemName}</h3>
                        <Badge label={rec.rolloutPhase} tone="neutral" />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                        <span className="font-semibold text-zinc-900">What it does:</span> {rec.whatItDoes}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                        <span className="font-semibold text-zinc-900">Why it matters:</span> {rec.whyItMatters}
                      </p>
                      <div className="mt-4">
                        <Badge label={`Complexity: ${rec.complexity}`} tone={toneFromSeverity(rec.complexity)} />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Page>

            <Page>
              <SectionHeading
                number="08"
                title="Priority Implementation Plan"
                subtitle="Phased roadmap balancing speed, sequencing, and delivery confidence."
              />
              <div className="space-y-4">
                {audit.implementationPlan.map((phase) => (
                  <article key={phase.phase} className="avoid-break rounded-xl border border-zinc-200 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{phase.phase}</p>
                        <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-950">{phase.title}</h3>
                      </div>
                      <Badge label={phase.phase} />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                      <span className="font-semibold text-zinc-900">Objective:</span> {phase.objective}
                    </p>
                    <div className="mt-3 space-y-2">
                      {phase.actions.map((action) => (
                        <p key={action} className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {action}
                        </p>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                      <span className="font-semibold text-zinc-900">Likely outcome:</span> {phase.likelyOutcome}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-12">
                <SectionHeading
                  number="09"
                  title="Quick Wins"
                  subtitle="Immediate actions that provide operational value without full rollout dependency."
                />
                <div className="grid gap-3 md:grid-cols-2">
                  {audit.quickWins.map((item) => (
                    <article key={item} className="avoid-break rounded-xl border border-zinc-200 bg-zinc-100 p-4 text-sm text-zinc-800">
                      {item}
                    </article>
                  ))}
                </div>
              </div>
            </Page>

            <Page breakAfter={false}>
              <SectionHeading
                number="10"
                title="Risk & Readiness Notes"
                subtitle="Key considerations to improve adoption quality and protect service reliability."
              />
              <div className="grid gap-4 md:grid-cols-2">
                {audit.riskReadiness.map((item) => (
                  <article key={item.risk} className="avoid-break rounded-xl border border-zinc-200 p-5">
                    <h3 className="text-base font-semibold tracking-tight text-zinc-900">{item.risk}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">{item.note}</p>
                  </article>
                ))}
              </div>

              <div className="mt-12">
                <SectionHeading
                  number="11"
                  title="Estimated Impact"
                  subtitle="Commercially grounded effect estimates across key operating outcomes."
                />
                <div className="space-y-4">
                  {audit.estimatedImpact.map((impact) => (
                    <article key={impact.category} className="avoid-break rounded-xl border border-zinc-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold tracking-tight text-zinc-900">{impact.category}</h3>
                        <Badge label={`Confidence: ${impact.confidence}`} tone={toneFromSeverity(impact.confidence)} />
                      </div>
                      <p className="mt-3 text-sm text-zinc-700">
                        <span className="font-semibold text-zinc-900">Baseline:</span> {impact.baseline}
                      </p>
                      <p className="mt-1 text-sm text-zinc-700">
                        <span className="font-semibold text-zinc-900">Expected direction:</span> {impact.projected}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-12 border-t border-zinc-200 pt-8">
                <SectionHeading
                  number="12"
                  title="Next Steps"
                  subtitle="Two practical paths depending on internal implementation capacity."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-xl border border-zinc-200 p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Option 1</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-950">Use this report internally</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">{audit.nextSteps.optionOne}</p>
                  </article>
                  <article className="rounded-xl border border-zinc-200 p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Option 2</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-950">
                      Engage Temporary Utopia for implementation support
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">{audit.nextSteps.optionTwo}</p>
                  </article>
                </div>
              </div>
            </Page>
          </div>
        </div>
      </main>
    </div>
  );
}

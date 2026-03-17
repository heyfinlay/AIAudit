import React, { useMemo, useState } from "react";

const initialAudit = {
  meta: {
    reportTitle: "AI Efficiency Audit",
    reportSubtitle: "Where time is being lost, what to fix first, and where AI can help without adding complexity.",
    clientBusinessName: "Northstar Property Advisory",
    preparedFor: "Emma Lewis, Founder",
    date: "17 March 2026",
    preparedBy: "Temporary Utopia",
    positioningLine: "Diagnostic dossier for faster response, cleaner delivery, and lower owner load"
  },
  executiveSummary: {
    currentState:
      "Demand is strong and delivery quality is trusted. Growth is now constrained by manual coordination, founder bottlenecks, and inconsistent follow-through between sales, delivery, and operations.",
    keyIssues:
      "Lead response speed drops when the founder is overloaded, follow-up actions are inconsistently owned, and reporting takes manual assembly each week.",
    primaryOpportunities:
      "Standardise handoffs, automate repetitive updates, and use AI support for first responses, proposals, and weekly summaries.",
    recommendedFocus:
      "Stabilise response and follow-up first, then roll out proposal and reporting systems once ownership and process standards are clear."
  },
  businessSnapshot: [
    { label: "Business type", value: "Boutique property advisory" },
    { label: "Team", value: "8 people (2 founders, 4 advisors, 2 operations)" },
    { label: "Core offer", value: "Portfolio planning, acquisitions, strategy reviews" },
    { label: "Main lead channels", value: "Referrals, web enquiries, LinkedIn, partners" },
    { label: "Current tools", value: "HubSpot, Gmail, Notion, Calendly, Slack, Xero" },
    { label: "Delivery model", value: "Founder-led sales, advisor-led delivery, ops-supported follow-through" }
  ],
  workflowMap: [
    {
      stage: "Lead capture",
      happening: "Enquiries arrive across web, inbox, LinkedIn, and referral channels.",
      owner: "Marketing + Founder",
      tools: "Web forms, Gmail, LinkedIn",
      friction: "Medium"
    },
    {
      stage: "Lead response",
      happening: "Quality is strong, but response speed depends on founder inbox load.",
      owner: "Founder",
      tools: "Gmail, phone",
      friction: "High"
    },
    {
      stage: "Qualification",
      happening: "Fit and urgency are checked manually with inconsistent note depth.",
      owner: "Founder + Advisors",
      tools: "HubSpot, Notion",
      friction: "Medium"
    },
    {
      stage: "Booking + conversion",
      happening: "Calls book fast, but proposal turnaround varies by current workload.",
      owner: "Founder + Ops",
      tools: "Calendly, docs, email",
      friction: "Medium"
    },
    {
      stage: "Delivery",
      happening: "Client outcomes remain high quality but execution standards vary by advisor.",
      owner: "Advisors",
      tools: "Notion, spreadsheets",
      friction: "Medium"
    },
    {
      stage: "Follow-up",
      happening: "Post-project follow-up is ad hoc and often delayed.",
      owner: "Operations",
      tools: "HubSpot, email",
      friction: "High"
    },
    {
      stage: "Reporting + admin",
      happening: "Weekly reporting and internal updates are manually assembled.",
      owner: "Operations + Founder",
      tools: "HubSpot exports, Notion, Xero",
      friction: "High"
    }
  ],
  frictionIssues: [
    {
      title: "Slow lead follow-up",
      happening: "First response times vary from 15 minutes to 24 hours based on founder load.",
      whyItMatters: "High-intent leads cool quickly and conversion quality drops.",
      severity: "High",
      impactType: "Revenue"
    },
    {
      title: "Repeated manual admin",
      happening: "Qualification notes and status updates are entered across multiple tools.",
      whyItMatters: "Advisory time is lost to duplicate admin every week.",
      severity: "High",
      impactType: "Time"
    },
    {
      title: "Reporting built by hand",
      happening: "Pipeline and performance snapshots are manually stitched together weekly.",
      whyItMatters: "Leadership visibility is delayed and decisions happen later than needed.",
      severity: "High",
      impactType: "Visibility"
    },
    {
      title: "Weak handoffs",
      happening: "Sales context does not flow cleanly into delivery planning.",
      whyItMatters: "Teams repeat questions and lose momentum during onboarding.",
      severity: "Medium",
      impactType: "Client experience"
    },
    {
      title: "Inconsistent proposal handling",
      happening: "Proposal structure and turnaround differ by owner and urgency.",
      whyItMatters: "Inconsistency creates rework and weakens expectation setting.",
      severity: "Medium",
      impactType: "Consistency"
    }
  ],
  communicationGaps: [
    {
      gap: "Unclear ownership",
      signal: "Tasks remain in chat threads without clear accountability.",
      effect: "Follow-through is inconsistent across sales, delivery, and admin."
    },
    {
      gap: "Repeated questions",
      signal: "Delivery asks for context already captured in qualification.",
      effect: "Onboarding slows and client confidence drops."
    },
    {
      gap: "Fragmented information",
      signal: "Critical details are split across inboxes, notes, and CRM records.",
      effect: "Execution quality depends on who has context in the moment."
    },
    {
      gap: "Missed status updates",
      signal: "Updates are not reflected consistently across tools.",
      effect: "Leaders act on stale information."
    }
  ],
  opportunities: [
    {
      area: "Lead response",
      opportunity: "AI-assisted triage and first-draft response support",
      systemType: "Assisted responder workflow",
      readiness: "Ready",
      expectedImpact: "Faster first responses and stronger conversion continuity"
    },
    {
      area: "Follow-up",
      opportunity: "Automated post-call and post-project sequence triggers",
      systemType: "Workflow automation",
      readiness: "Ready",
      expectedImpact: "Fewer dropped actions and cleaner client continuity"
    },
    {
      area: "Proposals",
      opportunity: "Assisted drafting from qualification notes and prior examples",
      systemType: "Draft support system",
      readiness: "Pilot first",
      expectedImpact: "Faster turnaround with better consistency"
    },
    {
      area: "Knowledge",
      opportunity: "Internal assistant for SOPs, proposals, and client context",
      systemType: "Knowledge assistant",
      readiness: "Needs source cleanup",
      expectedImpact: "Lower owner dependency and fewer repeated internal questions"
    }
  ],
  systemRecommendations: [
    {
      systemName: "Lead response layer",
      whatItDoes: "Assists triage and first-draft replies using agreed qualification logic.",
      whyItMatters: "Protects response speed while keeping human quality control.",
      complexity: "Low",
      rolloutPhase: "Now"
    },
    {
      systemName: "Follow-up sequence flow",
      whatItDoes: "Triggers client and team follow-up at key milestones.",
      whyItMatters: "Reduces dropped actions and keeps momentum between teams.",
      complexity: "Low",
      rolloutPhase: "Now"
    },
    {
      systemName: "Proposal drafting support",
      whatItDoes: "Generates first-draft proposals from structured qualification fields.",
      whyItMatters: "Cuts drafting time and improves proposal consistency.",
      complexity: "Medium",
      rolloutPhase: "Next"
    },
    {
      systemName: "Internal knowledge assistant",
      whatItDoes: "Centralises searchable answers across SOPs and client history.",
      whyItMatters: "Reduces repeated questions and removes inbox dependency.",
      complexity: "Medium",
      rolloutPhase: "Next"
    }
  ],
  implementationPlan: [
    {
      phase: "Now",
      title: "Stabilise speed and ownership",
      objective: "Protect lead response and stop avoidable task drop-off.",
      actions: [
        "Deploy triage rules and first-response support.",
        "Set follow-up triggers after calls and project milestones.",
        "Assign a single owner for every high-friction stage."
      ],
      likelyOutcome: "Faster response and fewer dropped actions within 2-4 weeks."
    },
    {
      phase: "Next",
      title: "Standardise handoffs",
      objective: "Reduce rework by making information flow cleaner between teams.",
      actions: [
        "Introduce a structured handoff summary from sales to delivery.",
        "Roll out proposal drafting support tied to qualification fields.",
        "Consolidate priority knowledge into one searchable base."
      ],
      likelyOutcome: "More consistent delivery and less internal back-and-forth."
    },
    {
      phase: "Later",
      title: "Scale visibility systems",
      objective: "Improve leadership visibility without manual reporting effort.",
      actions: [
        "Implement weekly auto-generated reporting summaries.",
        "Add quality checkpoints for edge cases and approvals.",
        "Review system performance monthly and refine."
      ],
      likelyOutcome: "Stronger decision rhythm with lower admin load."
    }
  ],
  quickWins: [
    "Set a 60-minute response standard with fallback coverage.",
    "Use one qualification template for every new lead.",
    "Automate reminders for post-call and post-project follow-up.",
    "Adopt one proposal format with clear approval thresholds.",
    "Publish a weekly one-page operating summary before leadership review."
  ],
  riskReadiness: [
    {
      risk: "Adoption risk",
      note: "If the new workflow feels heavier, teams may revert to old habits."
    },
    {
      risk: "Automation before clarity",
      note: "Automating unclear processes can scale mistakes quickly."
    },
    {
      risk: "Data quality",
      note: "Inconsistent CRM fields weaken response triage and reporting quality."
    },
    {
      risk: "Shared ownership",
      note: "Without clear accountability, exceptions stall and bottlenecks return."
    }
  ],
  estimatedImpact: [
    {
      category: "Lead response speed",
      baseline: "Variable and owner-dependent",
      projected: "Consistent same-hour coverage",
      confidence: "High"
    },
    {
      category: "Admin load",
      baseline: "High manual status handling",
      projected: "Less repeated admin and cleaner handoffs",
      confidence: "Medium"
    },
    {
      category: "Client continuity",
      baseline: "Follow-up is inconsistent",
      projected: "Fewer drop-offs and clearer next actions",
      confidence: "Medium"
    },
    {
      category: "Leadership visibility",
      baseline: "Reporting assembled manually",
      projected: "Faster weekly insight cadence",
      confidence: "High"
    }
  ],
  nextSteps: {
    optionOne: "Use this report in-house to run the first phase with clear ownership and weekly review.",
    optionTwo:
      "Engage Temporary Utopia to implement the roadmap with setup, rollout support, and quality control checkpoints."
  }
};

const badgeTones = {
  low: "border-zinc-300 bg-zinc-100 text-zinc-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  caution: "border-orange-200 bg-orange-50 text-orange-700"
};

const severityScore = { high: 5, medium: 3, low: 1 };

function toneFromValue(value) {
  const lower = value.toLowerCase();
  if (lower.includes("high") || lower.includes("now")) return "high";
  if (lower.includes("medium") || lower.includes("next") || lower.includes("pilot")) return "medium";
  if (lower.includes("ready")) return "ready";
  if (lower.includes("needs") || lower.includes("later")) return "caution";
  return "low";
}

function Page({ children, breakAfter = true }) {
  return (
    <section className={`report-page relative w-full overflow-hidden border border-zinc-200 bg-white p-8 shadow-report ${breakAfter ? "print:break-after-page" : ""}`}>
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-zinc-900" />
      {children}
    </section>
  );
}

function SectionHeading({ number, title, subtitle }) {
  return (
    <div className="mb-7">
      <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">{number}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      {subtitle ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">{subtitle}</p> : null}
    </div>
  );
}

function Badge({ label, tone = "low" }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${badgeTones[tone]}`}>{label}</span>;
}

function InputLabel({ children }) {
  return <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">{children}</label>;
}

function TextInput({ value, onChange }) {
  return <input value={value} onChange={onChange} className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />;
}

function TextArea({ value, onChange, rows = 3 }) {
  return <textarea value={value} onChange={onChange} rows={rows} className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm leading-relaxed" />;
}

export default function App() {
  const [audit, setAudit] = useState(initialAudit);
  const [jsonDraft, setJsonDraft] = useState(JSON.stringify(initialAudit, null, 2));
  const [jsonError, setJsonError] = useState("");
  const [mode, setMode] = useState("builder");

  const quickWinText = useMemo(() => audit.quickWins.join("\n"), [audit.quickWins]);

  const rankedIssues = useMemo(
    () =>
      [...audit.frictionIssues]
        .map((issue) => ({ ...issue, score: severityScore[issue.severity.toLowerCase()] ?? 1 }))
        .sort((a, b) => b.score - a.score),
    [audit.frictionIssues]
  );

  const ownerDependencyScore = useMemo(() => Math.round((audit.workflowMap.filter((item) => item.owner.toLowerCase().includes("founder")).length / audit.workflowMap.length) * 100), [audit.workflowMap]);

  const highFrictionCount = useMemo(() => audit.workflowMap.filter((item) => item.friction.toLowerCase() === "high").length, [audit.workflowMap]);

  const updateMeta = (key, value) => setAudit((prev) => ({ ...prev, meta: { ...prev.meta, [key]: value } }));
  const updateExecutive = (key, value) => setAudit((prev) => ({ ...prev, executiveSummary: { ...prev.executiveSummary, [key]: value } }));

  const updateQuickWins = (value) => {
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

  return (
    <div className="min-h-screen bg-canvas text-zinc-900" style={{ fontFamily: '"Suisse Intl", "Avenir Next", "Manrope", "Segoe UI", sans-serif' }}>
      <header className="screen-only border-b border-zinc-300 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Temporary Utopia</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">AI Efficiency Audit Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className={`rounded-md border px-3 py-2 text-xs font-medium uppercase tracking-wide ${mode === "builder" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`} onClick={() => setMode("builder")} type="button">Builder</button>
            <button className={`rounded-md border px-3 py-2 text-xs font-medium uppercase tracking-wide ${mode === "preview" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`} onClick={() => setMode("preview")} type="button">Preview</button>
            <button className="rounded-md border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white" onClick={() => window.print()} type="button">Export PDF</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 md:px-6 lg:grid-cols-12">
        {mode === "builder" ? (
          <aside className="screen-only lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl border border-zinc-300 bg-white p-4">
                <p className="text-sm font-semibold">Report Meta</p>
                <div className="mt-4 space-y-3">
                  <div><InputLabel>Client business name</InputLabel><TextInput value={audit.meta.clientBusinessName} onChange={(e) => updateMeta("clientBusinessName", e.target.value)} /></div>
                  <div><InputLabel>Prepared for</InputLabel><TextInput value={audit.meta.preparedFor} onChange={(e) => updateMeta("preparedFor", e.target.value)} /></div>
                  <div><InputLabel>Date</InputLabel><TextInput value={audit.meta.date} onChange={(e) => updateMeta("date", e.target.value)} /></div>
                  <div><InputLabel>Prepared by</InputLabel><TextInput value={audit.meta.preparedBy} onChange={(e) => updateMeta("preparedBy", e.target.value)} /></div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-300 bg-white p-4">
                <p className="text-sm font-semibold">Executive Summary</p>
                <div className="mt-4 space-y-3">
                  <div><InputLabel>Current State</InputLabel><TextArea value={audit.executiveSummary.currentState} onChange={(e) => updateExecutive("currentState", e.target.value)} /></div>
                  <div><InputLabel>Key Issues</InputLabel><TextArea value={audit.executiveSummary.keyIssues} onChange={(e) => updateExecutive("keyIssues", e.target.value)} /></div>
                  <div><InputLabel>Primary Opportunities</InputLabel><TextArea value={audit.executiveSummary.primaryOpportunities} onChange={(e) => updateExecutive("primaryOpportunities", e.target.value)} /></div>
                  <div><InputLabel>What to fix first</InputLabel><TextArea value={audit.executiveSummary.recommendedFocus} onChange={(e) => updateExecutive("recommendedFocus", e.target.value)} /></div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-300 bg-white p-4">
                <p className="text-sm font-semibold">Quick Wins</p>
                <TextArea value={quickWinText} rows={7} onChange={(e) => updateQuickWins(e.target.value)} />
              </div>

              <div className="rounded-xl border border-zinc-300 bg-white p-4">
                <p className="text-sm font-semibold">Advanced JSON Data</p>
                <TextArea value={jsonDraft} rows={12} onChange={(e) => setJsonDraft(e.target.value)} />
                {jsonError ? <p className="mt-2 text-xs text-rose-600">{jsonError}</p> : null}
                <button className="mt-3 rounded-md border border-zinc-900 bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white" onClick={applyJsonDraft} type="button">Apply JSON</button>
              </div>
            </div>
          </aside>
        ) : null}

        <div className={mode === "builder" ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="mx-auto max-w-[220mm] space-y-6 print:space-y-0">
            <Page>
              <div className="flex min-h-[260mm] flex-col justify-between">
                <div className="flex justify-between text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  <p>Temporary Utopia</p><p>Diagnostic dossier</p>
                </div>
                <div className="mt-10">
                  <p className="text-xs uppercase tracking-[0.26em] text-zinc-500">AI Efficiency Audit</p>
                  <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight tracking-tight">{audit.meta.clientBusinessName}</h2>
                  <p className="mt-4 max-w-2xl text-lg text-zinc-700">{audit.meta.reportSubtitle}</p>
                  <p className="mt-6 max-w-2xl text-sm text-zinc-600">{audit.meta.positioningLine}</p>
                  <div className="mt-12 grid gap-4 border-y border-zinc-200 py-7 md:grid-cols-3">
                    <div><p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Prepared for</p><p className="mt-2 text-base">{audit.meta.preparedFor}</p></div>
                    <div><p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Prepared by</p><p className="mt-2 text-base">{audit.meta.preparedBy}</p></div>
                    <div><p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Date</p><p className="mt-2 text-base">{audit.meta.date}</p></div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Confidential</p>
                  <p className="text-xs text-zinc-500">AI Efficiency Audit • Temporary Utopia</p>
                </div>
              </div>
            </Page>

            <Page>
              <SectionHeading number="01" title="Executive Summary" subtitle="The key issues, the likely cost, and what to fix first." />
              <div className="grid gap-6 md:grid-cols-5">
                <div className="md:col-span-3">
                  <p className="text-base leading-relaxed text-zinc-700">{audit.executiveSummary.currentState}</p>
                  <div className="mt-6 space-y-3">
                    {rankedIssues.slice(0, 3).map((issue, i) => (
                      <article key={issue.title} className="rounded-xl border border-zinc-200 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Key finding {i + 1}</p>
                          <Badge label={issue.severity} tone={toneFromValue(issue.severity)} />
                        </div>
                        <h3 className="mt-2 text-lg font-semibold">{issue.title}</h3>
                        <p className="mt-2 text-sm text-zinc-600">{issue.whyItMatters}</p>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 md:col-span-2">
                  <article className="rounded-xl bg-zinc-900 p-5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">What this is likely costing</p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-100">Slower response, repeated admin, and delayed reporting are creating lost revenue opportunities and avoidable internal load each week.</p>
                  </article>
                  <article className="rounded-xl border border-zinc-200 p-5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">What to fix first</p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">{audit.executiveSummary.recommendedFocus}</p>
                  </article>
                </div>
              </div>
            </Page>

            <Page>
              <SectionHeading number="02" title="Business Snapshot" subtitle="Only the context that matters for interpreting the findings." />
              <div className="grid gap-x-10 gap-y-5 md:grid-cols-2">
                {audit.businessSnapshot.map((item) => (
                  <div key={item.label} className="border-b border-zinc-200 pb-3">
                    <p className="text-xs uppercase tracking-[0.17em] text-zinc-500">{item.label}</p>
                    <p className="mt-2 text-sm text-zinc-800">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <article className="rounded-xl border border-zinc-200 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Owner dependency snapshot</p><p className="mt-2 text-3xl font-semibold">{ownerDependencyScore}%</p><p className="text-sm text-zinc-600">of stages currently rely on founder involvement.</p></article>
                <article className="rounded-xl border border-zinc-200 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Time leak summary</p><p className="mt-2 text-3xl font-semibold">{highFrictionCount}</p><p className="text-sm text-zinc-600">high-friction stages are slowing weekly throughput.</p></article>
                <article className="rounded-xl border border-zinc-200 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Top 3 immediate priorities</p><p className="mt-2 text-sm text-zinc-700">Lead response speed, structured handoffs, and automated follow-up.</p></article>
              </div>
            </Page>

            <Page>
              <SectionHeading number="03" title="Workflow Map" subtitle="How work currently moves, where delays happen, and who owns each stage." />
              <div className="space-y-4">
                {audit.workflowMap.map((item, index) => (
                  <article key={item.stage} className="avoid-break rounded-xl border border-zinc-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-8 w-8 rounded-full border border-zinc-300 text-center text-xs font-semibold leading-8">{index + 1}</div>
                        <div>
                          <h3 className="text-lg font-semibold">{item.stage}</h3>
                          <p className="mt-1 text-sm text-zinc-600">{item.happening}</p>
                        </div>
                      </div>
                      <Badge label={`${item.friction} friction`} tone={toneFromValue(item.friction)} />
                    </div>
                    <div className="mt-3 grid gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500 md:grid-cols-2">
                      <p>Owner: <span className="normal-case tracking-normal text-zinc-700">{item.owner}</span></p>
                      <p>Tools: <span className="normal-case tracking-normal text-zinc-700">{item.tools}</span></p>
                    </div>
                  </article>
                ))}
              </div>
            </Page>

            <Page>
              <SectionHeading number="04" title="Top Friction Points" subtitle="Where the business is leaking time, momentum, and consistency." />
              <div className="space-y-4">
                {rankedIssues.map((issue, index) => (
                  <article key={issue.title} className="avoid-break grid gap-4 rounded-xl border border-zinc-200 p-5 md:grid-cols-12">
                    <div className="md:col-span-1"><p className="text-2xl font-semibold text-zinc-300">{index + 1}</p></div>
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-2"><h3 className="text-lg font-semibold">{issue.title}</h3><Badge label={issue.impactType} /></div>
                      <p className="mt-2 text-sm text-zinc-600">{issue.happening}</p>
                      <p className="mt-2 text-sm text-zinc-800">{issue.whyItMatters}</p>
                    </div>
                    <div className="md:col-span-3 md:text-right"><Badge label={`${issue.severity} severity`} tone={toneFromValue(issue.severity)} /><p className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">Priority score: {issue.score}/5</p></div>
                  </article>
                ))}
              </div>

              <div className="mt-10 rounded-xl bg-zinc-100 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Client journey friction view</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">The biggest experience drop-off appears between qualification and follow-up: response and onboarding are strong when closely managed, but momentum falls when ownership is split and updates are manual.</p>
              </div>
            </Page>

            <Page>
              <SectionHeading number="05" title="Where Communication Breaks" subtitle="Where information gets stuck, ownership blurs, and execution slows down." />
              <div className="grid gap-4 md:grid-cols-2">
                {audit.communicationGaps.map((item) => (
                  <article key={item.gap} className="avoid-break rounded-xl border border-zinc-200 p-5">
                    <h3 className="text-base font-semibold">{item.gap}</h3>
                    <p className="mt-2 text-sm text-zinc-600"><span className="font-semibold text-zinc-900">Signal:</span> {item.signal}</p>
                    <p className="mt-2 text-sm text-zinc-700"><span className="font-semibold text-zinc-900">Business effect:</span> {item.effect}</p>
                  </article>
                ))}
              </div>

              <div className="mt-10 rounded-xl border border-zinc-200 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">What changes first</p>
                <p className="mt-3 text-sm text-zinc-700">Assigning explicit stage owners and introducing one shared handoff summary will remove most repeated questions before any major system rollout.</p>
              </div>
            </Page>

            <Page>
              <SectionHeading number="06" title="Where AI Can Save Time First" subtitle="Practical opportunities with clear effort and expected upside." />
              <div className="space-y-3">
                {audit.opportunities.map((item) => (
                  <article key={item.area} className="avoid-break grid gap-4 rounded-xl border border-zinc-200 p-4 md:grid-cols-12">
                    <h3 className="text-base font-semibold md:col-span-2">{item.area}</h3>
                    <p className="text-sm text-zinc-700 md:col-span-5">{item.opportunity}</p>
                    <p className="text-sm text-zinc-600 md:col-span-3">{item.expectedImpact}</p>
                    <div className="md:col-span-2 md:text-right"><Badge label={item.readiness} tone={toneFromValue(item.readiness)} /></div>
                  </article>
                ))}
              </div>

              <div className="mt-10">
                <SectionHeading number="07" title="Recommended Upgrades" subtitle="Concrete systems to deploy, why they matter, and when to phase them." />
                <div className="grid gap-4 md:grid-cols-2">
                  {audit.systemRecommendations.map((item) => (
                    <article key={item.systemName} className="avoid-break rounded-xl border border-zinc-200 p-5">
                      <div className="flex items-center justify-between gap-2"><h3 className="text-base font-semibold">{item.systemName}</h3><Badge label={item.rolloutPhase} tone={toneFromValue(item.rolloutPhase)} /></div>
                      <p className="mt-3 text-sm text-zinc-700"><span className="font-semibold text-zinc-900">What it is:</span> {item.whatItDoes}</p>
                      <p className="mt-2 text-sm text-zinc-700"><span className="font-semibold text-zinc-900">Why it matters:</span> {item.whyItMatters}</p>
                    </article>
                  ))}
                </div>
              </div>
            </Page>

            <Page>
              <SectionHeading number="08" title="Priority Implementation Path" subtitle="A phased plan that reduces overwhelm and keeps momentum." />
              <div className="grid gap-4 md:grid-cols-3">
                {audit.implementationPlan.map((phase) => (
                  <article key={phase.phase} className="avoid-break rounded-xl border border-zinc-200 p-5">
                    <Badge label={phase.phase} tone={toneFromValue(phase.phase)} />
                    <h3 className="mt-3 text-lg font-semibold">{phase.title}</h3>
                    <p className="mt-2 text-sm text-zinc-700"><span className="font-semibold text-zinc-900">Objective:</span> {phase.objective}</p>
                    <ul className="mt-3 space-y-1 text-sm text-zinc-600">{phase.actions.map((action) => <li key={action}>• {action}</li>)}</ul>
                    <p className="mt-3 text-sm text-zinc-700"><span className="font-semibold text-zinc-900">Likely outcome:</span> {phase.likelyOutcome}</p>
                  </article>
                ))}
              </div>

              <div className="mt-10">
                <SectionHeading number="09" title="Quick Wins You Can Start This Week" subtitle="Immediate actions with real value before full implementation." />
                <div className="grid gap-3 md:grid-cols-2">
                  {audit.quickWins.map((item) => (
                    <article key={item} className="avoid-break rounded-xl bg-zinc-100 p-4 text-sm text-zinc-800">{item}</article>
                  ))}
                </div>
              </div>
            </Page>

            <Page breakAfter={false}>
              <SectionHeading number="10" title="What Could Slow This Down" subtitle="Readiness considerations to protect quality and adoption." />
              <div className="grid gap-4 md:grid-cols-2">
                {audit.riskReadiness.map((item) => (
                  <article key={item.risk} className="avoid-break rounded-xl border border-zinc-200 p-5">
                    <h3 className="text-base font-semibold">{item.risk}</h3>
                    <p className="mt-2 text-sm text-zinc-700">{item.note}</p>
                  </article>
                ))}
              </div>

              <div className="mt-12">
                <SectionHeading number="11" title="What Changes If This Gets Fixed" subtitle="Commercial impact view using conservative directional estimates." />
                <div className="space-y-3">
                  {audit.estimatedImpact.map((item) => (
                    <article key={item.category} className="avoid-break grid gap-3 rounded-xl border border-zinc-200 p-4 md:grid-cols-12">
                      <h3 className="font-semibold md:col-span-3">{item.category}</h3>
                      <p className="text-sm text-zinc-600 md:col-span-4"><span className="font-semibold text-zinc-900">Today:</span> {item.baseline}</p>
                      <p className="text-sm text-zinc-700 md:col-span-4"><span className="font-semibold text-zinc-900">After improvements:</span> {item.projected}</p>
                      <div className="md:col-span-1 md:text-right"><Badge label={item.confidence} tone={toneFromValue(item.confidence)} /></div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-12 rounded-2xl bg-zinc-900 p-7 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">12 • Next steps</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">Move from diagnosis to execution</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <article className="rounded-xl border border-zinc-700 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Path A</p><p className="mt-2 text-sm text-zinc-100">{audit.nextSteps.optionOne}</p></article>
                  <article className="rounded-xl border border-zinc-700 p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Path B</p><p className="mt-2 text-sm text-zinc-100">{audit.nextSteps.optionTwo}</p></article>
                </div>
                <p className="mt-5 text-sm text-zinc-300">Recommended: begin with a 30-day implementation sprint focused on lead response, handoffs, and follow-up reliability.</p>
              </div>
            </Page>
          </div>
        </div>
      </main>
    </div>
  );
}

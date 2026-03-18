import { ReactNode } from "react";
import { sectionDefinitions } from "../data/templates";
import { estimatedRevenueOpportunity, overallScore } from "../lib/engines";
import { AuditDocument, LeadIssue, OpportunityItem, Recommendation, RoadmapPhase, SectionId, WorkflowIssue } from "../types";

const sectionMeta = Object.fromEntries(sectionDefinitions.map((section) => [section.id, section])) as Record<
  SectionId,
  (typeof sectionDefinitions)[number]
>;

export function AuditPreview({ audit }: { audit: AuditDocument }) {
  const visibleSections = audit.sections.order.filter((sectionId) => audit.sections.visibility[sectionId]);
  const score = overallScore(audit.scores);
  const monthlyValue = estimatedRevenueOpportunity(audit.assumptions);

  return (
    <div className="rounded-[30px] border border-white/10 bg-[#050a08] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
      <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#f3f6f4]">
        {visibleSections.map((sectionId) => (
          <section key={sectionId} className="border-b border-[#dce7e0] last:border-b-0">
            {sectionId === "cover" && <CoverSection audit={audit} score={score} monthlyValue={monthlyValue} />}
            {sectionId === "executiveSummary" && <ExecutiveSection audit={audit} score={score} />}
            {sectionId === "companySnapshot" && <CompanySnapshotSection audit={audit} />}
            {sectionId === "workflowIssues" && <WorkflowIssuesSection issues={audit.workflowIssues} />}
            {sectionId === "aiOpportunities" && <OpportunitiesSection title="AI Opportunities" items={audit.aiOpportunities} sectionId={sectionId} />}
            {sectionId === "automationOpportunities" && (
              <OpportunitiesSection title="Automation Opportunities" items={audit.automationOpportunities} sectionId={sectionId} />
            )}
            {sectionId === "salesInefficiencies" && <SalesIssuesSection issues={audit.salesInefficiencies} />}
            {sectionId === "recommendations" && <RecommendationsSection audit={audit} />}
            {sectionId === "implementationRoadmap" && <RoadmapSection phases={audit.roadmap} />}
            {sectionId === "roi" && <RoiSection audit={audit} monthlyValue={monthlyValue} />}
            {sectionId === "consultantNotes" && <ConsultantNotesSection audit={audit} />}
          </section>
        ))}
      </div>
    </div>
  );
}

function CoverSection({ audit, score, monthlyValue }: { audit: AuditDocument; score: number; monthlyValue: number }) {
  return (
    <div
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(0,152,102,0.24),_transparent_28%),linear-gradient(135deg,#07110d_0%,#0e1613_45%,#07110d_100%)] px-6 py-7 text-[#edf4ef] md:px-10 md:py-10"
      style={{ borderTop: `4px solid ${audit.meta.primaryColor}` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.03)_45%,transparent_100%)]" />
      <div className="relative space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#90b4a8]">{audit.meta.agencyName}</p>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white md:text-[3.2rem] md:leading-[1.05]">
              {audit.meta.clientBusinessName}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#c8d8d1]">{audit.meta.reportSubtitle}</p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#9fb9af]">{audit.meta.positioningLine}</p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8cb9aa]">Audit grade</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.06em]" style={{ color: audit.meta.primaryColor }}>
              {score}
            </p>
            <p className="mt-2 text-sm text-[#d3e2db]">Deterministic score across delivery, sales, and automation readiness.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricPanel label="Prepared For" value={audit.meta.preparedFor} />
          <MetricPanel label="Prepared By" value={audit.meta.preparedBy} />
          <MetricPanel label="Report Date" value={audit.meta.reportDate} />
          <MetricPanel label="Monthly Value" value={formatCurrency(monthlyValue)} />
        </div>
      </div>
    </div>
  );
}

function ExecutiveSection({ audit, score }: { audit: AuditDocument; score: number }) {
  return (
    <ReportSection id="executiveSummary" title="Executive Summary">
      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <NarrativeCard label="Current State" body={audit.executiveSummary.currentState} />
          <NarrativeCard label="Key Issues" body={audit.executiveSummary.keyIssues} />
          <NarrativeCard label="Primary Opportunities" body={audit.executiveSummary.primaryOpportunities} />
        </div>
        <div className="space-y-4">
          <div className="rounded-[24px] bg-[#0d1613] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#91baa9]">What to fix first</p>
            <p className="mt-3 text-sm leading-relaxed text-[#e7efeb]">{audit.executiveSummary.recommendedFocus}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <StatCard label="Overall score" value={`${score}/10`} hint="Weighted by 12 operating categories." />
            <StatCard label="Critical recommendations" value={`${audit.recommendations.filter((item) => item.priority === "P1").length}`} hint="Immediate opportunities to prioritize." />
            <StatCard
              label="Response improvement"
              value={`${audit.assumptions.responseTimeImprovementPct}%`}
              hint="Directional lift from stronger workflows."
            />
          </div>
        </div>
      </div>
    </ReportSection>
  );
}

function CompanySnapshotSection({ audit }: { audit: AuditDocument }) {
  const profileCards = [
    { label: "Industry", value: audit.profile.industry },
    { label: "Location", value: audit.profile.location },
    { label: "Team size", value: audit.profile.sizeEstimate },
    { label: "Inbound volume", value: audit.profile.inboundVolume }
  ];

  return (
    <ReportSection id="companySnapshot" title="Company Snapshot">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {profileCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} hint="" />
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {audit.companySnapshot.length ? (
            audit.companySnapshot.map((item) => <DetailRow key={item.id} label={item.label} value={item.value} />)
          ) : (
            <EmptyCard copy="Add business context cards to deepen the report narrative." />
          )}
        </div>

        <div className="space-y-4">
          <NarrativeCard label="Current stack" body={audit.profile.tools} />
          <NarrativeCard label="Lead channels" body={audit.profile.leadChannels} />
          <NarrativeCard label="Delivery model" body={audit.profile.deliveryModel} />
          <NarrativeCard label="Consultant observations" body={audit.profile.manualObservations || audit.profile.notes} />
        </div>
      </div>
    </ReportSection>
  );
}

function WorkflowIssuesSection({ issues }: { issues: WorkflowIssue[] }) {
  return (
    <ReportSection id="workflowIssues" title="Current Workflow Issues">
      <div className="space-y-4">
        {issues.length ? (
          issues.map((issue, index) => (
            <article key={issue.id} className="rounded-[24px] border border-[#d6e3dc] bg-white px-5 py-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf5f0] text-sm font-semibold text-[#0c5f46]">{index + 1}</div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#101714]">{issue.title}</h3>
                </div>
                <ToneBadge value={issue.severity} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#46544d]">{issue.description}</p>
              <div className="mt-4 rounded-[18px] bg-[#f2f6f4] px-4 py-3 text-sm text-[#1f2c27]">
                <span className="font-semibold text-[#101714]">Business impact:</span> {issue.businessImpact}
              </div>
            </article>
          ))
        ) : (
          <EmptyCard copy="No workflow issues added yet. Use the builder to document the highest-friction stages." />
        )}
      </div>
    </ReportSection>
  );
}

function OpportunitiesSection({ title, items, sectionId }: { title: string; items: OpportunityItem[]; sectionId: SectionId }) {
  return (
    <ReportSection id={sectionId} title={title}>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.length ? (
          items.map((item) => (
            <article key={item.id} className="rounded-[24px] border border-[#d6e3dc] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#698578]">{item.area}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#101714]">{item.opportunity}</h3>
                </div>
                <ToneBadge value={item.readiness} />
              </div>
              <p className="mt-3 text-sm text-[#4a5951]">{item.systemType}</p>
              <div className="mt-4 rounded-[18px] bg-[#0e1613] px-4 py-4 text-sm text-[#d8e7df]">{item.expectedImpact}</div>
            </article>
          ))
        ) : (
          <EmptyCard copy={`No ${title.toLowerCase()} have been added yet.`} />
        )}
      </div>
    </ReportSection>
  );
}

function SalesIssuesSection({ issues }: { issues: LeadIssue[] }) {
  return (
    <ReportSection id="salesInefficiencies" title="Lead and Sales Inefficiencies">
      <div className="space-y-4">
        {issues.length ? (
          issues.map((issue) => (
            <article key={issue.id} className="rounded-[24px] border border-[#d6e3dc] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#101714]">{issue.title}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MiniNote label="Signal" body={issue.symptom} />
                <MiniNote label="Commercial cost" body={issue.consequence} />
                <MiniNote label="Recommended response" body={issue.recommendedResponse} />
              </div>
            </article>
          ))
        ) : (
          <EmptyCard copy="Add commercial inefficiencies to show where revenue and trust are leaking." />
        )}
      </div>
    </ReportSection>
  );
}

function RecommendationsSection({ audit }: { audit: AuditDocument }) {
  return (
    <ReportSection id="recommendations" title="Recommendations">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {audit.recommendations.length ? (
            audit.recommendations.map((recommendation) => <RecommendationCard key={recommendation.title} recommendation={recommendation} />)
          ) : (
            <EmptyCard copy="Raise or lower the scorecards to generate deterministic recommendations." />
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] bg-[#0d1613] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#91baa9]">Quick wins</p>
            <div className="mt-4 space-y-3">
              {audit.quickWins.length ? (
                audit.quickWins.map((item) => (
                  <div key={item} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e6efea]">
                    {item}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#dbe7e0]">No quick wins defined yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#d6e3dc] bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#698578]">Score blocks</p>
            <div className="mt-4 space-y-3">
              {audit.scores.slice(0, 5).map((item) => (
                <div key={item.category} className="rounded-[18px] bg-[#f2f6f4] px-4 py-3">
                  <div className="flex items-center justify-between gap-4 text-sm font-medium text-[#101714]">
                    <span>{item.category}</span>
                    <span>{item.score}/10</span>
                  </div>
                  <p className="mt-2 text-sm text-[#4b5a52]">{item.findings}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ReportSection>
  );
}

function RoadmapSection({ phases }: { phases: RoadmapPhase[] }) {
  return (
    <ReportSection id="implementationRoadmap" title="Implementation Roadmap">
      <div className="grid gap-4 xl:grid-cols-3">
        {phases.length ? (
          phases.map((phase) => (
            <article key={phase.id} className="rounded-[24px] border border-[#d6e3dc] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
              <ToneBadge value={phase.phase} />
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#101714]">{phase.title}</h3>
              <p className="mt-3 text-sm text-[#334139]">{phase.objective}</p>
              <div className="mt-4 space-y-2">
                {phase.actions.map((action) => (
                  <div key={action} className="rounded-[16px] bg-[#f2f6f4] px-3 py-3 text-sm text-[#1d2924]">
                    {action}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#4a5951]">
                <span className="font-semibold text-[#101714]">Likely outcome:</span> {phase.likelyOutcome}
              </p>
            </article>
          ))
        ) : (
          <EmptyCard copy="Roadmap phases will appear here as you build the implementation plan." />
        )}
      </div>
    </ReportSection>
  );
}

function RoiSection({ audit, monthlyValue }: { audit: AuditDocument; monthlyValue: number }) {
  return (
    <ReportSection id="roi" title="ROI and Value Estimate">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Hours saved / week" value={`${audit.assumptions.hoursSavedPerWeek}`} hint="Directional estimate from workflow improvements." />
        <StatCard label="Admin hours reduced" value={`${audit.assumptions.adminHoursReduciblePerWeek}`} hint="Recovered time from less manual coordination." />
        <StatCard label="Leads recoverable / month" value={`${audit.assumptions.leadsRecoverablePerMonth}`} hint="Conservative conversion opportunity estimate." />
        <StatCard label="Revenue opportunity / month" value={formatCurrency(monthlyValue)} hint={`Avg lead value: ${formatCurrency(audit.assumptions.avgLeadValue)}`} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] bg-[#0d1613] p-5 text-white">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#91baa9]">Value framing</p>
          <p className="mt-4 text-sm leading-relaxed text-[#e5efea]">
            The value case is driven by faster response, fewer dropped follow-ups, cleaner handoffs, and lower manual admin load. This is positioned as a practical operating uplift, not a speculative AI transformation bet.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MiniNote label="Response time improvement" body={`${audit.assumptions.responseTimeImprovementPct}%`} />
          <MiniNote label="Follow-up lift" body={`${audit.assumptions.followUpImprovementPct}%`} />
          <MiniNote label="Business notes" body={audit.profile.notes} />
          <MiniNote label="Current tools" body={audit.profile.tools} />
        </div>
      </div>
    </ReportSection>
  );
}

function ConsultantNotesSection({ audit }: { audit: AuditDocument }) {
  return (
    <ReportSection id="consultantNotes" title="Consultant Notes">
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <NarrativeCard label="Client-facing notes" body={audit.consultantNotes.clientNotes} />
        <NarrativeCard label="Internal notes" body={audit.consultantNotes.internalNotes} />
      </div>

      <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#07110d_0%,#0d1613_100%)] p-6 text-white">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#8eb4a5]">Next step</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#e4eee9]">{audit.consultantNotes.nextSteps}</p>
      </div>
    </ReportSection>
  );
}

function ReportSection({ id, title, children }: { id: SectionId; title: string; children: ReactNode }) {
  return (
    <div className="px-6 py-7 md:px-10 md:py-9">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#698578]">{sectionMeta[id].kicker}</p>
          <h2 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.04em] text-[#101714]">{title}</h2>
        </div>
        <p className="max-w-md text-right text-sm leading-relaxed text-[#5c6f65]">{sectionMeta[id].description}</p>
      </div>
      {children}
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <article className="rounded-[24px] border border-[#d6e3dc] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#698578]">{recommendation.category}</p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#101714]">{recommendation.title}</h3>
        </div>
        <span className="rounded-full bg-[#e9f7f1] px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[#0c694d]">{recommendation.priority}</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <MiniNote label="Problem" body={recommendation.problem} />
        <MiniNote label="Why it matters" body={recommendation.whyItMatters} />
        <MiniNote label="Suggested fix" body={recommendation.suggestedFix} />
      </div>
    </article>
  );
}

function NarrativeCard({ label, body }: { label: string; body: string }) {
  return (
    <article className="rounded-[24px] border border-[#d6e3dc] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#698578]">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#34423b]">{body}</p>
    </article>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-[22px] border border-[#d6e3dc] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#698578]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#101714]">{value}</p>
      {hint ? <p className="mt-2 text-sm text-[#5b6e64]">{hint}</p> : null}
    </article>
  );
}

function MetricPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#8cb8aa]">{label}</p>
      <p className="mt-3 text-sm text-white">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[22px] border border-[#d6e3dc] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#698578]">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#1d2924]">{value}</p>
    </article>
  );
}

function MiniNote({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-[18px] bg-[#f2f6f4] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#6a8278]">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#22302a]">{body}</p>
    </div>
  );
}

function EmptyCard({ copy }: { copy: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#b7ccc2] bg-[#eff5f1] p-6 text-sm text-[#547065]">
      {copy}
    </div>
  );
}

function ToneBadge({ value }: { value: string }) {
  const styles = toneStyles(value);
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${styles}`}>{value}</span>;
}

function toneStyles(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes("high") || normalized.includes("now")) {
    return "bg-[#ecf9f3] text-[#0d7656]";
  }

  if (normalized.includes("pilot") || normalized.includes("medium") || normalized.includes("next")) {
    return "bg-[#f4efe7] text-[#8a5d12]";
  }

  if (normalized.includes("needs") || normalized.includes("later")) {
    return "bg-[#eef1f3] text-[#4f6472]";
  }

  return "bg-[#eef7f3] text-[#0d7656]";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(value);
}

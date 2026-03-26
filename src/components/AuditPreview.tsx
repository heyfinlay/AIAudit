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
  const manualCost = audit.assumptions.adminHoursReduciblePerWeek * 4.3 * 85;
  const timeSavedValue = audit.assumptions.hoursSavedPerWeek * 4.3 * 85;

  return (
    <div className="rounded-[34px] border border-white/10 bg-[#050907] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
      <div className="overflow-hidden rounded-[28px] border border-[#d7e2dc] bg-[#f7f3eb]">
        {visibleSections.map((sectionId) => (
          <section key={sectionId} className="border-b border-[#ddd7ca] last:border-b-0">
            {sectionId === "cover" && (
              <CoverSection audit={audit} score={score} monthlyValue={monthlyValue} manualCost={manualCost} timeSavedValue={timeSavedValue} />
            )}
            {sectionId === "executiveSummary" && <ExecutiveSection audit={audit} score={score} monthlyValue={monthlyValue} />}
            {sectionId === "companySnapshot" && <CompanySnapshotSection audit={audit} />}
            {sectionId === "workflowIssues" && <WorkflowIssuesSection issues={audit.workflowIssues} />}
            {sectionId === "aiOpportunities" && (
              <OpportunitiesSection
                title="Where AI Can Improve the Business"
                intro="These are the clearest places where AI can improve speed, consistency, reporting quality, and customer communication without making the business feel robotic."
                items={audit.aiOpportunities}
                sectionId={sectionId}
              />
            )}
            {sectionId === "automationOpportunities" && (
              <OpportunitiesSection
                title="Workflow and Automation Opportunities"
                intro="These are the process changes that remove repetitive admin, tighten handoffs, and make the delivery side of the business easier to run."
                items={audit.automationOpportunities}
                sectionId={sectionId}
              />
            )}
            {sectionId === "salesInefficiencies" && <SalesIssuesSection issues={audit.salesInefficiencies} />}
            {sectionId === "recommendations" && <RecommendationsSection audit={audit} />}
            {sectionId === "implementationRoadmap" && <RoadmapSection phases={audit.roadmap} />}
            {sectionId === "roi" && <RoiSection audit={audit} monthlyValue={monthlyValue} manualCost={manualCost} timeSavedValue={timeSavedValue} />}
            {sectionId === "implementationRecommendation" && <ImplementationRecommendationSection audit={audit} />}
            {sectionId === "upsellArchitecture" && <UpsellArchitectureSection audit={audit} />}
            {sectionId === "consultantNotes" && <ConsultantNotesSection audit={audit} />}
          </section>
        ))}
      </div>
    </div>
  );
}

function CoverSection({
  audit,
  score,
  monthlyValue,
  manualCost,
  timeSavedValue
}: {
  audit: AuditDocument;
  score: number;
  monthlyValue: number;
  manualCost: number;
  timeSavedValue: number;
}) {
  return (
    <div
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(201,109,66,0.18),_transparent_24%),radial-gradient(circle_at_left,_rgba(46,125,111,0.18),_transparent_30%),linear-gradient(135deg,#111714_0%,#18211e_45%,#101613_100%)] px-6 py-7 text-[#edf4ef] md:px-10 md:py-10"
      style={{ borderTop: `5px solid ${audit.meta.primaryColor}` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_44%,transparent_100%)]" />
      <div className="relative space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#b6c8c0]">{audit.meta.agencyName}</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white md:text-[3.15rem] md:leading-[1.02]">
              {audit.meta.clientBusinessName}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d6e1dc]">{audit.meta.reportSubtitle}</p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#aebdb6]">{audit.meta.positioningLine}</p>
          </div>
          <div className="rounded-[24px] border border-white/12 bg-white/6 px-5 py-4 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#aac6ba]">Audit readiness score</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.06em]" style={{ color: audit.meta.primaryColor }}>
              {score}
            </p>
            <p className="mt-2 max-w-[14rem] text-sm text-[#d5e0db]">
              Directional score based on workflow bloat, response speed, admin load, and implementation readiness.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricPanel label="Prepared for" value={audit.meta.preparedFor} />
          <MetricPanel label="Prepared by" value={audit.meta.preparedBy} />
          <MetricPanel label="Report date" value={audit.meta.reportDate} />
          <MetricPanel label="Potential monthly upside" value={formatCurrency(monthlyValue)} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <HighlightTile label="Current manual admin cost" value={formatCurrency(manualCost)} copy="Estimated monthly value of repetitive manual coordination, chasing, and reporting work." tone="soft" />
          <HighlightTile label="Time that could be recovered" value={formatCurrency(timeSavedValue)} copy="Directional value of time that can be returned to delivery, sales, and higher-value work." tone="strong" />
          <HighlightTile label="Business outcome" value="Faster, cleaner, more scalable operations" copy="The goal is not AI for its own sake. The goal is stronger reporting, faster client contact, and less workflow drag." tone="warm" />
        </div>
      </div>
    </div>
  );
}

function ExecutiveSection({ audit, score, monthlyValue }: { audit: AuditDocument; score: number; monthlyValue: number }) {
  return (
    <ReportSection id="executiveSummary" title="What the Business Looks Like Right Now">
      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <NarrativeCard
            label="Current operating picture"
            body={audit.executiveSummary.currentState}
            tone="light"
          />
          <NarrativeCard label="What is creating drag" body={audit.executiveSummary.keyIssues} tone="light" />
          <NarrativeCard
            label="Where the strongest upside sits"
            body={audit.executiveSummary.primaryOpportunities}
            tone="light"
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-[26px] bg-[#18211e] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#aac6ba]">Recommended focus</p>
            <p className="mt-3 text-sm leading-relaxed text-[#ebf1ee]">{audit.executiveSummary.recommendedFocus}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <StatCard label="Overall readiness" value={`${score}/10`} hint="Weighted across operating and commercial categories." />
            <StatCard
              label="Priority recommendations"
              value={`${audit.recommendations.filter((item) => item.priority === "P1").length}`}
              hint="Highest-value recommendations to sequence first."
            />
            <StatCard
              label="Estimated monthly value"
              value={formatCurrency(monthlyValue)}
              hint="Directional upside from stronger response, follow-up, and admin handling."
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
    <ReportSection id="companySnapshot" title="Business, Team, and Operating Context">
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
          <NarrativeCard label="Current stack" body={audit.profile.tools} tone="light" />
          <NarrativeCard label="Lead channels" body={audit.profile.leadChannels} tone="light" />
          <NarrativeCard label="Delivery model" body={audit.profile.deliveryModel} tone="light" />
          <NarrativeCard label="Consultant observations" body={audit.profile.manualObservations || audit.profile.notes} tone="light" />
        </div>
      </div>
    </ReportSection>
  );
}

function WorkflowIssuesSection({ issues }: { issues: WorkflowIssue[] }) {
  return (
    <ReportSection id="workflowIssues" title="Current Workflow Bloat and Manual Drag">
      <div className="mb-5 rounded-[24px] border border-[#d8d1c2] bg-[#efe8da] px-5 py-4 text-sm leading-relaxed text-[#433a30]">
        This section shows where time is currently being lost through repeated admin, slow handoffs, fragmented communication, and manual follow-up.
      </div>
      <div className="space-y-4">
        {issues.length ? (
          issues.map((issue, index) => (
            <article key={issue.id} className="rounded-[24px] border border-[#ddd7ca] bg-white px-5 py-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f1ec] text-sm font-semibold text-[#215647]">{index + 1}</div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#161814]">{issue.title}</h3>
                </div>
                <ToneBadge value={issue.severity} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#4b4f48]">{issue.description}</p>
              <div className="mt-4 rounded-[18px] bg-[#f4f0e6] px-4 py-3 text-sm text-[#2d2d2a]">
                <span className="font-semibold text-[#191a18]">Why this matters:</span> {issue.businessImpact}
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

function OpportunitiesSection({
  title,
  intro,
  items,
  sectionId
}: {
  title: string;
  intro: string;
  items: OpportunityItem[];
  sectionId: SectionId;
}) {
  return (
    <ReportSection id={sectionId} title={title}>
      <div className="mb-5 rounded-[24px] border border-[#ddd7ca] bg-[#f4efe6] px-5 py-4 text-sm leading-relaxed text-[#463f34]">{intro}</div>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.length ? (
          items.map((item) => (
            <article key={item.id} className="rounded-[24px] border border-[#ddd7ca] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#857869]">{item.area}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#161814]">{item.opportunity}</h3>
                </div>
                <ToneBadge value={item.readiness} />
              </div>
              <p className="mt-3 text-sm text-[#5a564f]">{item.systemType}</p>
              <div className="mt-4 rounded-[18px] bg-[#16211d] px-4 py-4 text-sm text-[#dfeae4]">
                <span className="font-semibold text-white">Expected outcome:</span> {item.expectedImpact}
              </div>
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
      <div className="mb-5 rounded-[24px] border border-[#ddd7ca] bg-[#f4efe6] px-5 py-4 text-sm leading-relaxed text-[#463f34]">
        This section highlights where the business is likely losing momentum before revenue is captured, especially across response speed, lead qualification, and post-conversation follow-up.
      </div>
      <div className="space-y-4">
        {issues.length ? (
          issues.map((issue) => (
            <article key={issue.id} className="rounded-[24px] border border-[#ddd7ca] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#161814]">{issue.title}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MiniNote label="Current signal" body={issue.symptom} />
                <MiniNote label="Commercial cost" body={issue.consequence} />
                <MiniNote label="Best response" body={issue.recommendedResponse} />
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
    <ReportSection id="recommendations" title="Priority Recommendations">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {audit.recommendations.length ? (
            audit.recommendations.map((recommendation) => <RecommendationCard key={recommendation.title} recommendation={recommendation} />)
          ) : (
            <EmptyCard copy="Raise or lower the scorecards to generate deterministic recommendations." />
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] bg-[#18211e] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#aac6ba]">Quick wins</p>
            <div className="mt-4 space-y-3">
              {audit.quickWins.length ? (
                audit.quickWins.map((item) => (
                  <div key={item} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#ebf1ee]">
                    {item}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#dbe7e0]">No quick wins defined yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#ddd7ca] bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#857869]">Current score blocks</p>
            <div className="mt-4 space-y-3">
              {audit.scores.slice(0, 5).map((item) => (
                <div key={item.category} className="rounded-[18px] bg-[#f6f1e9] px-4 py-3">
                  <div className="flex items-center justify-between gap-4 text-sm font-medium text-[#181915]">
                    <span>{item.category}</span>
                    <span>{item.score}/10</span>
                  </div>
                  <p className="mt-2 text-sm text-[#545149]">{item.findings}</p>
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
      <div className="mb-5 rounded-[24px] border border-[#ddd7ca] bg-[#f4efe6] px-5 py-4 text-sm leading-relaxed text-[#463f34]">
        The purpose of this roadmap is to show how implementation should happen in a commercially sensible sequence rather than trying to change everything at once.
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {phases.length ? (
          phases.map((phase) => (
            <article key={phase.id} className="rounded-[24px] border border-[#ddd7ca] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
              <ToneBadge value={phase.phase} />
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#161814]">{phase.title}</h3>
              <p className="mt-3 text-sm text-[#454942]">{phase.objective}</p>
              <div className="mt-4 space-y-2">
                {phase.actions.map((action) => (
                  <div key={action} className="rounded-[16px] bg-[#f6f1e9] px-3 py-3 text-sm text-[#23231f]">
                    {action}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#4c5149]">
                <span className="font-semibold text-[#181915]">Likely result:</span> {phase.likelyOutcome}
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

function RoiSection({
  audit,
  monthlyValue,
  manualCost,
  timeSavedValue
}: {
  audit: AuditDocument;
  monthlyValue: number;
  manualCost: number;
  timeSavedValue: number;
}) {
  return (
    <ReportSection id="roi" title="ROI and Value Estimate">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Hours saved / week" value={`${audit.assumptions.hoursSavedPerWeek}`} hint="Directional estimate from workflow improvements." />
        <StatCard label="Admin hours reduced" value={`${audit.assumptions.adminHoursReduciblePerWeek}`} hint="Recovered time from less manual coordination." />
        <StatCard label="Leads recoverable / month" value={`${audit.assumptions.leadsRecoverablePerMonth}`} hint="Conservative conversion opportunity estimate." />
        <StatCard label="Revenue opportunity / month" value={formatCurrency(monthlyValue)} hint={`Avg lead value: ${formatCurrency(audit.assumptions.avgLeadValue)}`} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] bg-[#18211e] p-5 text-white">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#aac6ba]">How to read the numbers</p>
          <p className="mt-4 text-sm leading-relaxed text-[#e8f0ec]">
            The value case is based on three things: time returned to the team, stronger response and follow-up, and fewer opportunities lost to manual admin or slow internal handoffs. These numbers are directional, but they help frame where implementation is likely to create the biggest return.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MiniNote label="Current manual admin cost" body={formatCurrency(manualCost)} />
          <MiniNote label="Recoverable time value" body={formatCurrency(timeSavedValue)} />
          <MiniNote label="Response time improvement" body={`${audit.assumptions.responseTimeImprovementPct}%`} />
          <MiniNote label="Follow-up improvement" body={`${audit.assumptions.followUpImprovementPct}%`} />
        </div>
      </div>
    </ReportSection>
  );
}

function ImplementationRecommendationSection({ audit }: { audit: AuditDocument }) {
  return (
    <ReportSection id="implementationRecommendation" title="Recommended Implementation Approach">
      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4">
          <NarrativeCard label="Recommended path" body={audit.implementationRecommendation.summary} tone="light" />
          <NarrativeCard label="Why now" body={audit.implementationRecommendation.whyNow} tone="light" />
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          <StatCard label="Recommended offer" value={audit.implementationRecommendation.recommendedOffer} hint="Best-fit delivery structure based on the audit." />
          <StatCard label="Estimated timeline" value={audit.implementationRecommendation.estimatedTimeline} hint="Directional implementation timeframe." />
          <StatCard label="Investment framing" value={audit.implementationRecommendation.investmentRange} hint="Commercial framing for the next engagement." />
        </div>
      </div>
    </ReportSection>
  );
}

function UpsellArchitectureSection({ audit }: { audit: AuditDocument }) {
  return (
    <ReportSection id="upsellArchitecture" title="Upsell Architecture and Delivery Path">
      <div className="mb-5 rounded-[24px] border border-[#ddd7ca] bg-[#f4efe6] px-5 py-4 text-sm leading-relaxed text-[#463f34]">
        This section turns the audit into a clear commercial next step. The goal is to show the client that implementation can begin with a practical first phase, then expand once the quick wins are working.
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[24px] border border-[#ddd7ca] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#857869]">Phase 1</p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#161814]">Quick-win implementation</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#4b4f48]">{audit.upsellArchitecture.quickWinOffer}</p>
        </article>

        <article className="rounded-[24px] border border-[#ddd7ca] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#857869]">Phase 2</p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#161814]">Core implementation</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#4b4f48]">{audit.upsellArchitecture.coreImplementationOffer}</p>
        </article>

        <article className="rounded-[24px] border border-[#ddd7ca] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#857869]">Phase 3</p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#161814]">Ongoing support</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#4b4f48]">{audit.upsellArchitecture.ongoingSupportOffer}</p>
        </article>
      </div>

      <div className="mt-5 rounded-[28px] bg-[linear-gradient(135deg,#101613_0%,#18211e_100%)] p-6 text-white">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#aac6ba]">Commercial positioning note</p>
        <p className="mt-4 max-w-4xl text-base leading-relaxed text-[#ecf2ef]">{audit.upsellArchitecture.positioningNote}</p>
      </div>
    </ReportSection>
  );
}

function ConsultantNotesSection({ audit }: { audit: AuditDocument }) {
  return (
    <ReportSection id="consultantNotes" title="Consultant Notes and Next Step">
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <NarrativeCard label="Client-facing recommendation" body={audit.consultantNotes.clientNotes} tone="light" />
        <NarrativeCard label="Internal implementation notes" body={audit.consultantNotes.internalNotes} tone="light" />
      </div>

      <div className="mt-6 rounded-[30px] bg-[linear-gradient(135deg,#101613_0%,#18211e_100%)] p-6 text-white">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#aac6ba]">Suggested next step</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#ecf2ef]">{audit.consultantNotes.nextSteps}</p>
      </div>
    </ReportSection>
  );
}

function ReportSection({ id, title, children }: { id: SectionId; title: string; children: ReactNode }) {
  return (
    <div className="px-6 py-7 md:px-10 md:py-9">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a7d6e]">{sectionMeta[id].kicker}</p>
          <h2 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.04em] text-[#161814]">{title}</h2>
        </div>
        <p className="max-w-md text-right text-sm leading-relaxed text-[#686257]">{sectionMeta[id].description}</p>
      </div>
      {children}
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <article className="rounded-[24px] border border-[#ddd7ca] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#857869]">{recommendation.category}</p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#161814]">{recommendation.title}</h3>
        </div>
        <span className="rounded-full bg-[#e8f1ec] px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[#215647]">{recommendation.priority}</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <MiniNote label="What is happening now" body={recommendation.problem} />
        <MiniNote label="Why it matters" body={recommendation.whyItMatters} />
        <MiniNote label="What to change" body={recommendation.suggestedFix} />
      </div>
    </article>
  );
}

function NarrativeCard({ label, body, tone = "light" }: { label: string; body: string; tone?: "light" | "dark" }) {
  const toneClass =
    tone === "dark"
      ? "border-transparent bg-[#18211e] text-white"
      : "border-[#ddd7ca] bg-white text-[#34423b] shadow-[0_20px_40px_rgba(12,20,17,0.05)]";

  return (
    <article className={`rounded-[24px] border p-5 ${toneClass}`}>
      <p className={`text-[11px] uppercase tracking-[0.24em] ${tone === "dark" ? "text-[#aac6ba]" : "text-[#857869]"}`}>{label}</p>
      <p className={`mt-3 text-sm leading-relaxed ${tone === "dark" ? "text-[#e8f0ec]" : "text-[#4a4d47]"}`}>{body}</p>
    </article>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-[22px] border border-[#ddd7ca] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#857869]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#181915]">{value}</p>
      {hint ? <p className="mt-2 text-sm text-[#666258]">{hint}</p> : null}
    </article>
  );
}

function MetricPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#aac6ba]">{label}</p>
      <p className="mt-3 text-sm text-white">{value}</p>
    </div>
  );
}

function HighlightTile({
  label,
  value,
  copy,
  tone
}: {
  label: string;
  value: string;
  copy: string;
  tone: "soft" | "strong" | "warm";
}) {
  const toneClasses = {
    soft: "bg-white/6 border-white/10 text-white",
    strong: "bg-[#f0a35a]/14 border-[#f0a35a]/24 text-white",
    warm: "bg-[#2e7d6f]/16 border-[#2e7d6f]/26 text-white"
  } as const;

  return (
    <article className={`rounded-[24px] border px-5 py-5 backdrop-blur ${toneClasses[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#c8d7d0]">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#dce7e1]">{copy}</p>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[22px] border border-[#ddd7ca] bg-white p-5 shadow-[0_20px_40px_rgba(12,20,17,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#857869]">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#24241f]">{value}</p>
    </article>
  );
}

function MiniNote({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-[18px] bg-[#f6f1e9] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a7d6e]">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#2a2a24]">{body}</p>
    </div>
  );
}

function EmptyCard({ copy }: { copy: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#d2cab9] bg-[#fbf8f1] p-6 text-sm text-[#6f685c]">{copy}</div>
  );
}

function ToneBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    High: "bg-[#fce2db] text-[#9a452d]",
    Medium: "bg-[#f9efcf] text-[#85620e]",
    Low: "bg-[#e2f0e9] text-[#245947]",
    Ready: "bg-[#e2f0e9] text-[#245947]",
    "Pilot First": "bg-[#f9efcf] text-[#85620e]",
    "Needs Cleanup": "bg-[#fce2db] text-[#9a452d]",
    Now: "bg-[#e2f0e9] text-[#245947]",
    Next: "bg-[#f9efcf] text-[#85620e]",
    Later: "bg-[#ece6dc] text-[#655b4d]"
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.16em] ${map[value] ?? "bg-[#ece6dc] text-[#655b4d]"}`}>{value}</span>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(value);
}

import { ReactNode, useState } from "react";
import { AuditBuilderPanel } from "./AuditBuilderPanel";
import { AuditCompare } from "./AuditCompare";
import { AuditPreview } from "./AuditPreview";
import { useAuditBuilder } from "../context/AuditBuilderContext";
import { estimatedRevenueOpportunity, overallScore } from "../lib/engines";
import { SectionId } from "../types";

const defaultSection: SectionId = "cover";

export function AuditWorkspace() {
  const { audits, currentAudit, currentView, mobilePane, setCurrentView, setMobilePane, selectAudit, createAudit } = useAuditBuilder();
  const [selectedSection, setSelectedSection] = useState<SectionId>(defaultSection);

  return (
    <div className="min-h-screen bg-[#06100d] text-white">
      <div className="mx-auto max-w-[1680px] px-4 py-5 md:px-6 lg:px-8">
        <header className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-5 py-5 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur md:px-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.36em] text-[#7da996]">AuditAI</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white md:text-[2.7rem]">AI Efficiency Audit Builder</h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#a7b7b0] md:text-base">
                The product is back around its highest-value workflow: compose the audit on the left, present a premium live report on the right, and keep scoring, recommendations, and ROI framing attached to the same audit state.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <NavButton active={currentView === "builder"} onClick={() => setCurrentView("builder")}>
                Builder
              </NavButton>
              <NavButton active={currentView === "portfolio"} onClick={() => setCurrentView("portfolio")}>
                Portfolio
              </NavButton>
              <NavButton active={currentView === "compare"} onClick={() => setCurrentView("compare")}>
                Compare
              </NavButton>
              <button
                type="button"
                onClick={() => createAudit(currentAudit.profile.industry)}
                className="ml-1 rounded-full border border-[#009866]/50 bg-[#009866] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#03110b] transition hover:brightness-110"
              >
                New audit
              </button>
            </div>
          </div>
        </header>

        {currentView === "builder" && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4 xl:hidden">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#7da996]">Workspace</p>
                <p className="mt-2 text-sm text-[#a7b7b0]">Switch between editing and preview on smaller screens.</p>
              </div>
              <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1">
                <PaneButton active={mobilePane === "builder"} onClick={() => setMobilePane("builder")}>
                  Builder
                </PaneButton>
                <PaneButton active={mobilePane === "preview"} onClick={() => setMobilePane("preview")}>
                  Preview
                </PaneButton>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(380px,0.92fr)_minmax(420px,1.08fr)]">
              <div className={`${mobilePane === "builder" ? "block" : "hidden"} xl:block`}>
                <AuditBuilderPanel selectedSection={selectedSection} onSelectSection={setSelectedSection} />
              </div>

              <div className={`${mobilePane === "preview" ? "block" : "hidden"} xl:block`}>
                <div className="xl:sticky xl:top-5">
                  <AuditPreview audit={currentAudit} />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "portfolio" && (
          <section className="mt-5 rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-[#7ca694]">Saved audits</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Audit Portfolio</h2>
                <p className="mt-2 max-w-2xl text-sm text-[#a9b9b2]">The builder is the hero, but consultants still need a clean way to reopen prior drafts and continue refining them.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {audits.map((audit) => (
                <article key={audit.id} className="rounded-[24px] border border-white/10 bg-[#0b1411] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#7da996]">{audit.status}</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{audit.meta.clientBusinessName}</h3>
                      <p className="mt-2 text-sm text-[#9cb0a6]">{audit.profile.industry} · {audit.profile.location}</p>
                    </div>
                    <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{audit.stage}</span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <PortfolioMetric label="Score" value={`${overallScore(audit.scores)}/10`} />
                    <PortfolioMetric label="P1 items" value={`${audit.recommendations.filter((item) => item.priority === "P1").length}`} />
                    <PortfolioMetric label="Value" value={formatCurrency(estimatedRevenueOpportunity(audit.assumptions))} />
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-[#c8d4ce]">{audit.executiveSummary.currentState}</p>

                  <button
                    type="button"
                    onClick={() => {
                      selectAudit(audit.id);
                      setCurrentView("builder");
                      setSelectedSection(defaultSection);
                    }}
                    className="mt-5 rounded-full border border-[#009866]/40 bg-[#009866]/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9af0c8]"
                  >
                    Resume in builder
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {currentView === "compare" && (
          <div className="mt-5">
            <AuditCompare
              audits={audits}
              onSelect={(auditId) => {
                selectAudit(auditId);
                setCurrentView("builder");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
        active ? "bg-white text-[#06100d]" : "border border-white/12 bg-white/[0.04] text-white hover:bg-white/[0.08]"
      }`}
    >
      {children}
    </button>
  );
}

function PaneButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
        active ? "bg-[#009866] text-[#03110b]" : "text-white/75"
      }`}
    >
      {children}
    </button>
  );
}

function PortfolioMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#7da996]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(value);
}

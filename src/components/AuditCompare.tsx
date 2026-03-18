import { estimatedRevenueOpportunity, overallScore } from "../lib/engines";
import { AuditDocument } from "../types";

export function AuditCompare({ audits, onSelect }: { audits: AuditDocument[]; onSelect: (auditId: string) => void }) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 text-white shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#7ca694]">Benchmark view</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Audit Comparison</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#a9b9b2]">Keep the builder as the core workflow, but retain quick benchmarking for consultants comparing opportunity size and implementation urgency across accounts.</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] gap-4 bg-white/[0.03] px-5 py-4 text-[11px] uppercase tracking-[0.24em] text-[#85a797] md:grid">
          <span>Company</span>
          <span>Industry</span>
          <span>Score</span>
          <span>P1 items</span>
          <span>Value / month</span>
          <span />
        </div>
        <div className="divide-y divide-white/10">
          {audits.map((audit) => (
            <div key={audit.id} className="grid gap-4 px-5 py-5 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] md:items-center">
              <div>
                <p className="text-lg font-semibold tracking-[-0.03em]">{audit.meta.clientBusinessName}</p>
                <p className="mt-1 text-sm text-[#9db0a8]">{audit.profile.location}</p>
              </div>
              <p className="text-sm text-[#dce5e1]">{audit.profile.industry}</p>
              <p className="text-sm text-[#dce5e1]">{overallScore(audit.scores)}/10</p>
              <p className="text-sm text-[#dce5e1]">{audit.recommendations.filter((item) => item.priority === "P1").length}</p>
              <p className="text-sm text-[#dce5e1]">{formatCurrency(estimatedRevenueOpportunity(audit.assumptions))}</p>
              <button
                type="button"
                onClick={() => onSelect(audit.id)}
                className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#009866] hover:bg-[#009866]/16"
              >
                Open builder
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(value);
}

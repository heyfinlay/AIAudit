import { FormEvent, useMemo, useState } from "react";
import { demoAudits, industryChecks } from "./data/templates";
import { estimatedRevenueOpportunity, overallScore } from "./lib/engines";
import { loadAudits, saveAudits } from "./lib/storage";
import { CompanyAudit, Industry } from "./types";

type View = "dashboard" | "create" | "detail" | "report" | "compare" | "settings";

const initialState = loadAudits() ?? demoAudits;

const industries: Industry[] = ["Mortgage Broker", "Accounting Firm", "Dental Clinic", "Law Firm", "Trades Business"];

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [audits, setAudits] = useState<CompanyAudit[]>(initialState);
  const [selectedId, setSelectedId] = useState(initialState[0]?.id ?? "");
  const selected = audits.find((a) => a.id === selectedId) ?? audits[0];

  const [filters, setFilters] = useState({ query: "", industry: "All" });

  const filtered = useMemo(
    () =>
      audits.filter(
        (audit) =>
          (filters.industry === "All" || audit.industry === filters.industry) &&
          audit.companyName.toLowerCase().includes(filters.query.toLowerCase())
      ),
    [audits, filters]
  );

  function upsertAudit(newAudit: CompanyAudit) {
    const next = [newAudit, ...audits.filter((a) => a.id !== newAudit.id)];
    setAudits(next);
    setSelectedId(newAudit.id);
    saveAudits(next);
  }

  if (!isAuthed) return <AuthScreen onLogin={() => setIsAuthed(true)} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-6 p-6">
        <aside className="w-64 rounded-2xl bg-white p-4 shadow-sm">
          <h1 className="text-lg font-semibold">Company Audit Platform</h1>
          <p className="mt-1 text-xs text-slate-500">AI Efficiency + Growth Opportunity</p>
          <nav className="mt-6 space-y-2">
            {[
              ["dashboard", "Audits Dashboard"],
              ["create", "Create Audit"],
              ["detail", "Audit Detail"],
              ["report", "Client Report"],
              ["compare", "Compare Audits"],
              ["settings", "Settings"]
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setView(key as View)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${view === key ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 space-y-6">
          {view === "dashboard" && (
            <DashboardView
              audits={filtered}
              filters={filters}
              onFilterChange={setFilters}
              onSelect={(id) => {
                setSelectedId(id);
                setView("detail");
              }}
            />
          )}

          {view === "create" && <CreateAuditView onCreate={upsertAudit} />}

          {view === "detail" && selected && <DetailView audit={selected} />}

          {view === "report" && selected && <ReportView audit={selected} />}

          {view === "compare" && <CompareView audits={audits} />}

          {view === "settings" && selected && (
            <SettingsView
              audit={selected}
              onBrandingUpdate={(agencyName, logoText, primaryColor) => {
                upsertAudit({ ...selected, reportBranding: { agencyName, logoText, primaryColor } });
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-700 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-600">Sign in to manage audit workflows and client-ready reports.</p>
        <button onClick={onLogin} className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white">
          Sign in (demo)
        </button>
      </div>
    </div>
  );
}

function DashboardView({
  audits,
  filters,
  onFilterChange,
  onSelect
}: {
  audits: CompanyAudit[];
  filters: { query: string; industry: string };
  onFilterChange: (next: { query: string; industry: string }) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Audit Dashboard</h2>
        <div className="mt-4 flex gap-3">
          <input
            value={filters.query}
            onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
            placeholder="Search company"
            className="flex-1 rounded-lg border px-3 py-2"
          />
          <select
            value={filters.industry}
            onChange={(e) => onFilterChange({ ...filters, industry: e.target.value })}
            className="rounded-lg border px-3 py-2"
          >
            <option>All</option>
            {industries.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {audits.map((audit) => (
          <button key={audit.id} onClick={() => onSelect(audit.id)} className="rounded-xl bg-white p-5 text-left shadow-sm hover:shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{audit.companyName}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{audit.status}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{audit.industry} · {audit.location}</p>
            <p className="mt-2 text-sm">Score: {overallScore(audit.scores)}/10</p>
            <p className="text-sm">Stage: {audit.stage}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function CreateAuditView({ onCreate }: { onCreate: (audit: CompanyAudit) => void }) {
  const [industry, setIndustry] = useState<Industry>("Mortgage Broker");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const id = `audit-${crypto.randomUUID().slice(0, 8)}`;
    const newAudit = demoAudits[0];
    onCreate({
      ...newAudit,
      id,
      companyName: String(data.get("companyName")),
      website: String(data.get("website")),
      industry,
      location: String(data.get("location")),
      sizeEstimate: String(data.get("sizeEstimate")),
      inboundVolume: String(data.get("inboundVolume")),
      tools: String(data.get("tools")),
      notes: String(data.get("notes")),
      manualObservations: String(data.get("manualObservations")),
      stage: String(data.get("stage")) as "Pre-Audit" | "Full Audit"
    });
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Create Audit</h2>
      <p className="mt-1 text-sm text-slate-600">Prospecting mode supports lightweight pre-audits that can be converted into full audits.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Input name="companyName" label="Company name" required />
        <Input name="website" label="Website" placeholder="https://" />
        <div>
          <label className="text-sm">Industry</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value as Industry)} className="mt-1 w-full rounded-lg border px-3 py-2">
            {industries.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>
        <Input name="location" label="Location" required />
        <Input name="sizeEstimate" label="Team size estimate" />
        <Input name="inboundVolume" label="Inbound leads estimate" />
        <Input name="tools" label="Current tools/software" />
        <div>
          <label className="text-sm">Stage</label>
          <select name="stage" className="mt-1 w-full rounded-lg border px-3 py-2">
            <option>Pre-Audit</option>
            <option>Full Audit</option>
          </select>
        </div>
      </div>
      <TextArea name="notes" label="Notes" />
      <TextArea name="manualObservations" label="Manual observations" />
      <div className="mt-4 rounded-lg border bg-slate-50 p-3 text-sm">
        <p className="font-medium">Industry checklist ({industry})</p>
        <ul className="mt-1 list-disc pl-5 text-slate-600">
          {industryChecks[industry].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <button type="submit" className="mt-4 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white">Save audit</button>
    </form>
  );
}

function DetailView({ audit }: { audit: CompanyAudit }) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">{audit.companyName}</h2>
        <p className="mt-1 text-sm text-slate-600">{audit.website} · {audit.industry}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Metric label="Overall Score" value={`${overallScore(audit.scores)}/10`} />
          <Metric label="Priority Index" value={`${audit.recommendations.filter((r) => r.priority === "P1").length} critical`} />
          <Metric label="Revenue Opportunity" value={`$${estimatedRevenueOpportunity(audit.assumptions).toLocaleString()}/mo`} />
        </div>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Scoring Framework</h3>
        <div className="mt-3 grid gap-2">
          {audit.scores.map((score) => (
            <div key={score.category} className="rounded-lg border p-3">
              <div className="flex justify-between text-sm font-medium">
                <span>{score.category}</span>
                <span>{score.score}/10</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{score.findings}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Consultant Internal Notes</h3>
        <p className="mt-2 text-sm text-slate-700">{audit.internalNotes}</p>
      </div>
    </section>
  );
}

function ReportView({ audit }: { audit: CompanyAudit }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Client Report</p>
          <h2 className="text-2xl font-semibold">AI Efficiency & Growth Opportunity Audit</h2>
          <p className="text-sm text-slate-600">Prepared for {audit.companyName}</p>
        </div>
        <div className="rounded-lg border px-3 py-2 text-right">
          <p className="text-xs text-slate-500">White-label branding</p>
          <p className="font-semibold">{audit.reportBranding.agencyName}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold">Executive Summary</h3>
          <p className="mt-2 text-sm text-slate-700">This business can unlock growth by tightening lead response, follow-up ownership, and admin automation.</p>
          <p className="mt-2 text-sm">Overall score: {overallScore(audit.scores)}/10</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold">Projected Gains (conservative)</h3>
          <ul className="mt-2 text-sm text-slate-700">
            <li>Time saved: {audit.assumptions.hoursSavedPerWeek.toFixed(1)} hours/week</li>
            <li>Leads recoverable: {audit.assumptions.leadsRecoverablePerMonth}/month</li>
            <li>Revenue opportunity: ${estimatedRevenueOpportunity(audit.assumptions).toLocaleString()}/month</li>
          </ul>
        </div>
      </div>
      <h3 className="mt-6 font-semibold">Priority Recommendations</h3>
      <div className="mt-2 space-y-2">
        {audit.recommendations.map((rec) => (
          <div key={rec.title} className="rounded-lg border p-3">
            <div className="flex justify-between">
              <p className="font-medium">{rec.title}</p>
              <span className="text-sm">{rec.priority}</span>
            </div>
            <p className="text-sm text-slate-600">{rec.suggestedFix}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CompareView({ audits }: { audits: CompanyAudit[] }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Comparison View</h2>
      <p className="mt-1 text-sm text-slate-600">Benchmark overall score, opportunity size, and ideal-client-fit indicators.</p>
      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="pb-2">Company</th>
            <th className="pb-2">Industry</th>
            <th className="pb-2">Overall Score</th>
            <th className="pb-2">Opportunity ($/mo)</th>
          </tr>
        </thead>
        <tbody>
          {audits.map((audit) => (
            <tr key={audit.id} className="border-b last:border-0">
              <td className="py-2">{audit.companyName}</td>
              <td>{audit.industry}</td>
              <td>{overallScore(audit.scores)}</td>
              <td>${estimatedRevenueOpportunity(audit.assumptions).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function SettingsView({
  audit,
  onBrandingUpdate
}: {
  audit: CompanyAudit;
  onBrandingUpdate: (agencyName: string, logoText: string, primaryColor: string) => void;
}) {
  return (
    <form
      className="rounded-2xl bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        onBrandingUpdate(String(data.get("agencyName")), String(data.get("logoText")), String(data.get("primaryColor")));
      }}
    >
      <h2 className="text-xl font-semibold">Settings & Admin Foundations</h2>
      <p className="mt-1 text-sm text-slate-600">Configure scoring weights, industries, recommendation templates, and white-label branding placeholders.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Input name="agencyName" label="Agency Name" defaultValue={audit.reportBranding.agencyName} />
        <Input name="logoText" label="Logo Text" defaultValue={audit.reportBranding.logoText} />
        <Input name="primaryColor" label="Primary Color" defaultValue={audit.reportBranding.primaryColor} />
      </div>
      <button className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white">Save settings</button>
    </form>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      <input {...props} className="mt-1 w-full rounded-lg border px-3 py-2" />
    </label>
  );
}

function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="mt-3 block">
      <span className="text-sm">{label}</span>
      <textarea {...props} rows={3} className="mt-1 w-full rounded-lg border px-3 py-2" />
    </label>
  );
}

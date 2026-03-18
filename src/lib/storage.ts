import { createSeedAudit } from "../data/templates";
import { buildRecommendations, calculateAssumptions } from "./engines";
import { AuditDocument, AuditScore, Industry, Recommendation, AssumptionModel } from "../types";

const STORAGE_KEY = "ai-efficiency-audit-builder-v2";
const LEGACY_STORAGE_KEY = "company-audit-platform-v1";

interface LegacyCompanyAudit {
  id: string;
  companyName: string;
  website?: string;
  industry: Industry;
  location: string;
  sizeEstimate: string;
  inboundVolume: string;
  tools: string;
  notes: string;
  manualObservations?: string;
  status: "Prospecting" | "In Progress" | "Ready for Report";
  createdAt: string;
  stage: "Pre-Audit" | "Full Audit";
  scores: AuditScore[];
  recommendations: Recommendation[];
  assumptions: AssumptionModel;
  internalNotes: string;
  reportBranding: { agencyName: string; primaryColor: string; logoText: string };
}

export function saveAudits(audits: AuditDocument[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(audits));
}

export function loadAudits(): AuditDocument[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw) {
    return JSON.parse(raw) as AuditDocument[];
  }

  const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!legacyRaw) {
    return null;
  }

  const migrated = (JSON.parse(legacyRaw) as LegacyCompanyAudit[]).map(migrateLegacyAudit);
  saveAudits(migrated);
  return migrated;
}

function migrateLegacyAudit(legacy: LegacyCompanyAudit): AuditDocument {
  const migrated = createSeedAudit({
    id: legacy.id,
    companyName: legacy.companyName,
    industry: legacy.industry,
    location: legacy.location,
    status: legacy.status,
    stage: legacy.stage
  });

  const scores = legacy.scores?.length ? legacy.scores : migrated.scores;
  const assumptions = calculateAssumptions(scores, legacy.assumptions?.avgLeadValue ?? migrated.assumptions.avgLeadValue);

  return {
    ...migrated,
    createdAt: legacy.createdAt ?? migrated.createdAt,
    updatedAt: legacy.createdAt ?? migrated.updatedAt,
    meta: {
      ...migrated.meta,
      clientBusinessName: legacy.companyName,
      agencyName: legacy.reportBranding?.agencyName ?? migrated.meta.agencyName,
      logoText: legacy.reportBranding?.logoText ?? migrated.meta.logoText,
      primaryColor: legacy.reportBranding?.primaryColor ?? migrated.meta.primaryColor
    },
    profile: {
      ...migrated.profile,
      website: legacy.website ?? migrated.profile.website,
      sizeEstimate: legacy.sizeEstimate,
      inboundVolume: legacy.inboundVolume,
      tools: legacy.tools,
      notes: legacy.notes,
      manualObservations: legacy.manualObservations ?? migrated.profile.manualObservations
    },
    executiveSummary: {
      ...migrated.executiveSummary,
      currentState: legacy.notes || migrated.executiveSummary.currentState,
      keyIssues: legacy.manualObservations || migrated.executiveSummary.keyIssues
    },
    consultantNotes: {
      ...migrated.consultantNotes,
      internalNotes: legacy.internalNotes || migrated.consultantNotes.internalNotes
    },
    scores,
    recommendations: legacy.recommendations?.length ? legacy.recommendations : buildRecommendations(scores),
    assumptions
  };
}

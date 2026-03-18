import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { demoAudits, sectionDefinitions, createSeedAudit } from "../data/templates";
import { buildRecommendations, buildScores, calculateAssumptions, DEFAULT_AUDIT_CATEGORIES } from "../lib/engines";
import { loadAudits, saveAudits } from "../lib/storage";
import { AuditDocument, AuditScore, Industry, SectionId } from "../types";

type AppView = "builder" | "portfolio" | "compare";
type MobilePane = "builder" | "preview";

interface AuditBuilderContextValue {
  audits: AuditDocument[];
  currentAudit: AuditDocument;
  currentView: AppView;
  mobilePane: MobilePane;
  setCurrentView: (view: AppView) => void;
  setMobilePane: (pane: MobilePane) => void;
  selectAudit: (auditId: string) => void;
  createAudit: (industry?: Industry) => void;
  duplicateCurrentAudit: () => void;
  updateCurrentAudit: (updater: (draft: AuditDocument) => void) => void;
  updateIndustry: (industry: Industry) => void;
  updateAssumptionValue: (avgLeadValue: number) => void;
  updateScore: (category: AuditScore["category"], updater: (score: AuditScore) => AuditScore) => void;
  toggleSection: (sectionId: SectionId) => void;
  moveSection: (sectionId: SectionId, direction: "up" | "down") => void;
}

const AuditBuilderContext = createContext<AuditBuilderContextValue | null>(null);

export function AuditBuilderProvider({ children }: { children: ReactNode }) {
  const initialAudits = useMemo(() => loadAudits() ?? demoAudits, []);
  const [audits, setAudits] = useState<AuditDocument[]>(initialAudits);
  const [currentAuditId, setCurrentAuditId] = useState(initialAudits[0]?.id ?? "");
  const [currentView, setCurrentView] = useState<AppView>("builder");
  const [mobilePane, setMobilePane] = useState<MobilePane>("builder");

  useEffect(() => {
    saveAudits(audits);
  }, [audits]);

  const currentAudit = audits.find((audit) => audit.id === currentAuditId) ?? audits[0];

  function updateCurrentAudit(updater: (draft: AuditDocument) => void) {
    if (!currentAudit) {
      return;
    }

    setAudits((previous) =>
      previous.map((audit) => {
        if (audit.id !== currentAudit.id) {
          return audit;
        }

        const draft = structuredClone(audit);
        updater(draft);
        return finalizeAudit(draft);
      })
    );
  }

  function createAudit(industry: Industry = currentAudit?.profile.industry ?? "Mortgage Broker") {
    const newAudit = createSeedAudit({
      id: `audit-${crypto.randomUUID().slice(0, 8)}`,
      companyName: `New ${industry} Audit`,
      industry,
      location: "Melbourne",
      status: "In Progress",
      stage: "Full Audit"
    });

    setAudits((previous) => [newAudit, ...previous]);
    setCurrentAuditId(newAudit.id);
    setCurrentView("builder");
    setMobilePane("builder");
  }

  function duplicateCurrentAudit() {
    if (!currentAudit) {
      return;
    }

    const duplicate = finalizeAudit({
      ...structuredClone(currentAudit),
      id: `audit-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      meta: {
        ...currentAudit.meta,
        clientBusinessName: `${currentAudit.meta.clientBusinessName} Copy`
      }
    });

    setAudits((previous) => [duplicate, ...previous]);
    setCurrentAuditId(duplicate.id);
    setCurrentView("builder");
  }

  function updateIndustry(industry: Industry) {
    updateCurrentAudit((draft) => {
      draft.profile.industry = industry;
      draft.scores = buildScores(DEFAULT_AUDIT_CATEGORIES, industry);
    });
  }

  function updateAssumptionValue(avgLeadValue: number) {
    updateCurrentAudit((draft) => {
      draft.assumptions = calculateAssumptions(draft.scores, avgLeadValue);
    });
  }

  function updateScore(category: AuditScore["category"], updater: (score: AuditScore) => AuditScore) {
    updateCurrentAudit((draft) => {
      draft.scores = draft.scores.map((score) => (score.category === category ? updater(score) : score));
    });
  }

  function toggleSection(sectionId: SectionId) {
    updateCurrentAudit((draft) => {
      draft.sections.visibility[sectionId] = !draft.sections.visibility[sectionId];
    });
  }

  function moveSection(sectionId: SectionId, direction: "up" | "down") {
    updateCurrentAudit((draft) => {
      const index = draft.sections.order.indexOf(sectionId);

      if (index === -1) {
        return;
      }

      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= draft.sections.order.length) {
        return;
      }

      const nextOrder = [...draft.sections.order];
      [nextOrder[index], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[index]];
      draft.sections.order = nextOrder;
    });
  }

  const value = useMemo<AuditBuilderContextValue>(
    () => ({
      audits,
      currentAudit,
      currentView,
      mobilePane,
      setCurrentView,
      setMobilePane,
      selectAudit: (auditId) => {
        setCurrentAuditId(auditId);
        setCurrentView("builder");
        setMobilePane("builder");
      },
      createAudit,
      duplicateCurrentAudit,
      updateCurrentAudit,
      updateIndustry,
      updateAssumptionValue,
      updateScore,
      toggleSection,
      moveSection
    }),
    [audits, currentAudit, currentView, mobilePane]
  );

  return <AuditBuilderContext.Provider value={value}>{children}</AuditBuilderContext.Provider>;
}

export function useAuditBuilder() {
  const context = useContext(AuditBuilderContext);

  if (!context) {
    throw new Error("useAuditBuilder must be used inside AuditBuilderProvider");
  }

  return context;
}

function finalizeAudit(audit: AuditDocument): AuditDocument {
  const normalizedSections = normalizeSections(audit.sections);
  const assumptions = calculateAssumptions(audit.scores, audit.assumptions?.avgLeadValue ?? 1800);

  return {
    ...audit,
    updatedAt: new Date().toISOString(),
    recommendations: buildRecommendations(audit.scores),
    assumptions,
    sections: normalizedSections
  };
}

function normalizeSections(sections: AuditDocument["sections"]): AuditDocument["sections"] {
  const defaultOrder = sectionDefinitions.map((section) => section.id);
  const order = [
    ...sections.order.filter((sectionId) => defaultOrder.includes(sectionId)),
    ...defaultOrder.filter((sectionId) => !sections.order.includes(sectionId))
  ];

  const visibility = defaultOrder.reduce<Record<SectionId, boolean>>((accumulator, sectionId) => {
    accumulator[sectionId] = sections.visibility[sectionId] ?? true;
    return accumulator;
  }, {} as Record<SectionId, boolean>);

  return { order, visibility };
}

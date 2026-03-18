import { AuditCategory, AuditScore, AssumptionModel, Industry, Recommendation } from "../types";

export const DEFAULT_AUDIT_CATEGORIES: AuditCategory[] = [
  "Lead Capture",
  "Lead Response Speed",
  "Follow-Up System",
  "Sales Process",
  "Customer Support / Reception",
  "Admin Efficiency",
  "Marketing Funnel Quality",
  "Website Conversion Readiness",
  "AI Adoption Potential",
  "Automation Readiness",
  "Trust & Authority",
  "Operational Bottlenecks"
];

export function buildScores(categories: AuditCategory[] = DEFAULT_AUDIT_CATEGORIES, industry: Industry): AuditScore[] {
  return categories.map((category, index) => {
    const score = Math.max(3, 9 - (index % 5) - (industry === "Mortgage Broker" ? 0 : 1));

    return {
      category,
      score,
      findings: `${category} has inconsistent execution and limited ownership clarity.`,
      risks: `Current ${category.toLowerCase()} gaps may create conversion leakage and service delays.`,
      opportunities: `Standardize playbooks and use AI or automation support in ${category.toLowerCase()}.`,
      estimatedBusinessImpact: score < 6 ? "High impact if improved" : "Moderate impact",
      recommendedActions: "Define SLA, assign owner, automate reminders, and add weekly KPI review."
    };
  });
}

export function buildRecommendations(scores: AuditScore[]): Recommendation[] {
  return scores
    .filter((score) => score.score <= 6)
    .slice(0, 6)
    .map((score, index) => ({
      title: `Improve ${score.category}`,
      problem: score.findings,
      whyItMatters: score.risks,
      suggestedFix: score.recommendedActions,
      estimatedImpact: score.estimatedBusinessImpact,
      implementationDifficulty: index < 2 ? "Low" : index < 4 ? "Medium" : "High",
      category: score.category,
      priority: index < 2 ? "P1" : index < 4 ? "P2" : "P3",
      aiHelp: true,
      automationHelp: true,
      impacts: index % 2 ? ["Time", "Customer Experience"] : ["Revenue", "Time"]
    }));
}

export function overallScore(scores: AuditScore[]): number {
  if (!scores.length) {
    return 0;
  }

  const total = scores.reduce((sum, score) => sum + score.score, 0);
  return Number((total / scores.length).toFixed(1));
}

export function calculateAssumptions(scores: AuditScore[], avgLeadValue = 1800): AssumptionModel {
  const lowScores = scores.filter((score) => score.score <= 6).length;

  return {
    hoursSavedPerWeek: Number((lowScores * 1.4).toFixed(1)),
    leadsRecoverablePerMonth: lowScores * 3,
    adminHoursReduciblePerWeek: Number((lowScores * 1.1).toFixed(1)),
    avgLeadValue,
    responseTimeImprovementPct: Math.min(55, 10 + lowScores * 4),
    followUpImprovementPct: Math.min(50, 8 + lowScores * 3)
  };
}

export function estimatedRevenueOpportunity(assumption: AssumptionModel): number {
  return assumption.leadsRecoverablePerMonth * assumption.avgLeadValue;
}

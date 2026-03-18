import { AuditCategory, AuditScore, AssumptionModel, Industry, Recommendation } from "../types";

export function buildScores(categories: AuditCategory[], industry: Industry): AuditScore[] {
  return categories.map((category, i) => {
    const score = Math.max(3, 9 - (i % 5) - (industry === "Mortgage Broker" ? 0 : 1));
    return {
      category,
      score,
      findings: `${category} has inconsistent execution and limited ownership clarity.`,
      risks: `Current ${category.toLowerCase()} gaps may create conversion leakage and service delays.`,
      opportunities: `Standardize playbooks and use AI/automation support in ${category.toLowerCase()}.`,
      estimatedBusinessImpact: score < 6 ? "High impact if improved" : "Moderate impact",
      recommendedActions: "Define SLA, assign owner, automate reminders, and add weekly KPI review."
    };
  });
}

export function buildRecommendations(scores: AuditScore[]): Recommendation[] {
  return scores
    .filter((s) => s.score <= 6)
    .slice(0, 6)
    .map((s, index) => ({
      title: `Improve ${s.category}`,
      problem: s.findings,
      whyItMatters: s.risks,
      suggestedFix: s.recommendedActions,
      estimatedImpact: s.estimatedBusinessImpact,
      implementationDifficulty: index < 2 ? "Low" : index < 4 ? "Medium" : "High",
      category: s.category,
      priority: index < 2 ? "P1" : index < 4 ? "P2" : "P3",
      aiHelp: true,
      automationHelp: true,
      impacts: index % 2 ? ["Time", "Customer Experience"] : ["Revenue", "Time"]
    }));
}

export function overallScore(scores: AuditScore[]): number {
  const total = scores.reduce((sum, score) => sum + score.score, 0);
  return Number((total / scores.length).toFixed(1));
}

export function calculateAssumptions(scores: AuditScore[]): AssumptionModel {
  const lowScores = scores.filter((s) => s.score <= 6).length;
  return {
    hoursSavedPerWeek: lowScores * 1.4,
    leadsRecoverablePerMonth: lowScores * 3,
    adminHoursReduciblePerWeek: lowScores * 1.1,
    avgLeadValue: 1800,
    responseTimeImprovementPct: Math.min(55, 10 + lowScores * 4),
    followUpImprovementPct: Math.min(50, 8 + lowScores * 3)
  };
}

export function estimatedRevenueOpportunity(assumption: AssumptionModel): number {
  return assumption.leadsRecoverablePerMonth * assumption.avgLeadValue;
}

import { CompanyAudit } from "../types";

const STORAGE_KEY = "company-audit-platform-v1";

export function saveAudits(audits: CompanyAudit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(audits));
}

export function loadAudits(): CompanyAudit[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as CompanyAudit[]) : null;
}

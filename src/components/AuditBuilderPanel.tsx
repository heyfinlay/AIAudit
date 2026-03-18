import { ChangeEvent, ReactNode } from "react";
import { industryChecks, sectionDefinitions } from "../data/templates";
import { useAuditBuilder } from "../context/AuditBuilderContext";
import { Industry, OpportunityItem, RoadmapPhase, SectionId } from "../types";

export function AuditBuilderPanel({
  selectedSection,
  onSelectSection
}: {
  selectedSection: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
}) {
  const {
    audits,
    currentAudit,
    selectAudit,
    createAudit,
    duplicateCurrentAudit,
    updateCurrentAudit,
    updateIndustry,
    updateAssumptionValue,
    updateScore,
    toggleSection,
    moveSection
  } = useAuditBuilder();

  const quickWinsText = currentAudit.quickWins.join("\n");
  const checklist = industryChecks[currentAudit.profile.industry];

  function addSnapshotItem() {
    updateCurrentAudit((draft) => {
      draft.companySnapshot.push({
        id: `snapshot-${crypto.randomUUID().slice(0, 6)}`,
        label: "New metric",
        value: "Add supporting context"
      });
    });
  }

  function addWorkflowIssue() {
    updateCurrentAudit((draft) => {
      draft.workflowIssues.push({
        id: `issue-${crypto.randomUUID().slice(0, 6)}`,
        title: "New workflow issue",
        description: "Describe the current friction point.",
        businessImpact: "Explain the commercial or operational cost.",
        severity: "Medium"
      });
    });
  }

  function addOpportunity(target: "aiOpportunities" | "automationOpportunities") {
    updateCurrentAudit((draft) => {
      const item: OpportunityItem = {
        id: `${target}-${crypto.randomUUID().slice(0, 6)}`,
        area: "New area",
        opportunity: "Describe the opportunity.",
        systemType: "Workflow support",
        readiness: "Ready",
        expectedImpact: "Clarify the expected operating change."
      };

      draft[target].push(item);
    });
  }

  function addSalesIssue() {
    updateCurrentAudit((draft) => {
      draft.salesInefficiencies.push({
        id: `sales-${crypto.randomUUID().slice(0, 6)}`,
        title: "New inefficiency",
        symptom: "Describe the signal the consultant observed.",
        consequence: "Explain the cost of keeping it as-is.",
        recommendedResponse: "Describe the operational response."
      });
    });
  }

  function addRoadmapPhase() {
    updateCurrentAudit((draft) => {
      const phase: RoadmapPhase = {
        id: `phase-${crypto.randomUUID().slice(0, 6)}`,
        phase: "Next",
        title: "New roadmap phase",
        objective: "State the objective clearly.",
        actions: ["Define the first implementation action."],
        likelyOutcome: "Describe the likely result of this phase."
      };

      draft.roadmap.push(phase);
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#7ca694]">Builder</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Live Audit Composer</h2>
            <p className="mt-2 max-w-xl text-sm text-[#a9b9b2]">Edit the audit structure, report narrative, and score inputs on the left. The report preview updates immediately on the right.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => createAudit(currentAudit.profile.industry)}
              className="rounded-full border border-[#009866]/50 bg-[#009866]/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9af0c8] transition hover:bg-[#009866]/22"
            >
              New audit
            </button>
            <button
              type="button"
              onClick={duplicateCurrentAudit}
              className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              Duplicate
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#86aa9a]">Active audit</span>
            <select
              value={currentAudit.id}
              onChange={(event) => selectAudit(event.target.value)}
              className="w-full rounded-[18px] border border-white/10 bg-[#0b1411] px-4 py-3 text-sm text-white outline-none transition focus:border-[#009866]"
            >
              {audits.map((audit) => (
                <option key={audit.id} value={audit.id}>
                  {audit.meta.clientBusinessName}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoPill label="Status" value={currentAudit.status} />
            <InfoPill label="Stage" value={currentAudit.stage} />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#7ca694]">Structure</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Report sections</h3>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {currentAudit.sections.order.map((sectionId, index) => {
            const definition = sectionDefinitions.find((section) => section.id === sectionId)!;
            const enabled = currentAudit.sections.visibility[sectionId];

            return (
              <button
                key={sectionId}
                type="button"
                onClick={() => onSelectSection(sectionId)}
                className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                  selectedSection === sectionId
                    ? "border-[#009866]/60 bg-[#009866]/10"
                    : "border-white/8 bg-[#0b1411] hover:border-white/16"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#7ca694]">
                      {String(index + 1).padStart(2, "0")} · {definition.label}
                    </p>
                    <p className="mt-2 text-sm text-[#b6c6bf]">{definition.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        moveSection(sectionId, "up");
                      }}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/80 hover:border-white/20"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        moveSection(sectionId, "down");
                      }}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/80 hover:border-white/20"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleSection(sectionId);
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        enabled ? "bg-[#009866] text-[#03100b]" : "bg-white/8 text-white/70"
                      }`}
                    >
                      {enabled ? "On" : "Off"}
                    </button>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#7ca694]">Section editor</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{sectionDefinitions.find((section) => section.id === selectedSection)?.label}</h3>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {selectedSection === "cover" && (
            <>
              <Field label="Client business name">
                <TextInput value={currentAudit.meta.clientBusinessName} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.meta.clientBusinessName = event.target.value;
                })} />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Prepared for">
                  <TextInput value={currentAudit.meta.preparedFor} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.meta.preparedFor = event.target.value;
                  })} />
                </Field>
                <Field label="Prepared by">
                  <TextInput value={currentAudit.meta.preparedBy} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.meta.preparedBy = event.target.value;
                  })} />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Report title">
                  <TextInput value={currentAudit.meta.reportTitle} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.meta.reportTitle = event.target.value;
                  })} />
                </Field>
                <Field label="Report date">
                  <TextInput value={currentAudit.meta.reportDate} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.meta.reportDate = event.target.value;
                  })} />
                </Field>
              </div>
              <Field label="Report subtitle">
                <TextArea value={currentAudit.meta.reportSubtitle} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.meta.reportSubtitle = event.target.value;
                })} />
              </Field>
              <Field label="Positioning line">
                <TextArea value={currentAudit.meta.positioningLine} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.meta.positioningLine = event.target.value;
                })} />
              </Field>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Agency name">
                  <TextInput value={currentAudit.meta.agencyName} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.meta.agencyName = event.target.value;
                  })} />
                </Field>
                <Field label="Logo text">
                  <TextInput value={currentAudit.meta.logoText} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.meta.logoText = event.target.value;
                  })} />
                </Field>
                <Field label="Accent colour">
                  <TextInput value={currentAudit.meta.primaryColor} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.meta.primaryColor = event.target.value;
                  })} />
                </Field>
              </div>
            </>
          )}

          {selectedSection === "executiveSummary" && (
            <>
              <Field label="Current state">
                <TextArea value={currentAudit.executiveSummary.currentState} rows={4} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.executiveSummary.currentState = event.target.value;
                })} />
              </Field>
              <Field label="Key issues">
                <TextArea value={currentAudit.executiveSummary.keyIssues} rows={4} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.executiveSummary.keyIssues = event.target.value;
                })} />
              </Field>
              <Field label="Primary opportunities">
                <TextArea value={currentAudit.executiveSummary.primaryOpportunities} rows={4} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.executiveSummary.primaryOpportunities = event.target.value;
                })} />
              </Field>
              <Field label="Recommended focus">
                <TextArea value={currentAudit.executiveSummary.recommendedFocus} rows={4} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.executiveSummary.recommendedFocus = event.target.value;
                })} />
              </Field>
            </>
          )}

          {selectedSection === "companySnapshot" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Industry">
                  <select
                    value={currentAudit.profile.industry}
                    onChange={(event) => updateIndustry(event.target.value as Industry)}
                    className="w-full rounded-[18px] border border-white/10 bg-[#0b1411] px-4 py-3 text-sm text-white outline-none transition focus:border-[#009866]"
                  >
                    {Object.keys(industryChecks).map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Website">
                  <TextInput value={currentAudit.profile.website} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.profile.website = event.target.value;
                  })} />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Location">
                  <TextInput value={currentAudit.profile.location} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.profile.location = event.target.value;
                  })} />
                </Field>
                <Field label="Team size">
                  <TextInput value={currentAudit.profile.sizeEstimate} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.profile.sizeEstimate = event.target.value;
                  })} />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Inbound volume">
                  <TextInput value={currentAudit.profile.inboundVolume} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.profile.inboundVolume = event.target.value;
                  })} />
                </Field>
                <Field label="Lead channels">
                  <TextInput value={currentAudit.profile.leadChannels} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.profile.leadChannels = event.target.value;
                  })} />
                </Field>
              </div>
              <Field label="Current tools">
                <TextArea value={currentAudit.profile.tools} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.profile.tools = event.target.value;
                })} />
              </Field>
              <Field label="Delivery model">
                <TextArea value={currentAudit.profile.deliveryModel} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.profile.deliveryModel = event.target.value;
                })} />
              </Field>
              <Field label="Consultant observations">
                <TextArea value={currentAudit.profile.manualObservations} rows={4} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.profile.manualObservations = event.target.value;
                })} />
              </Field>

              <div className="rounded-[24px] border border-white/8 bg-[#0b1411] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Snapshot cards</p>
                    <p className="mt-1 text-sm text-[#9db0a8]">These drive the highlighted business context cards in the preview.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addSnapshotItem}
                    className="rounded-full border border-[#009866]/40 bg-[#009866]/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9af0c8]"
                  >
                    Add card
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {currentAudit.companySnapshot.map((item) => (
                    <div key={item.id} className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                      <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr_auto]">
                        <TextInput
                          value={item.label}
                          onChange={(event) =>
                            updateCurrentAudit((draft) => {
                              draft.companySnapshot = draft.companySnapshot.map((entry) =>
                                entry.id === item.id ? { ...entry, label: event.target.value } : entry
                              );
                            })
                          }
                        />
                        <TextInput
                          value={item.value}
                          onChange={(event) =>
                            updateCurrentAudit((draft) => {
                              draft.companySnapshot = draft.companySnapshot.map((entry) =>
                                entry.id === item.id ? { ...entry, value: event.target.value } : entry
                              );
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateCurrentAudit((draft) => {
                              draft.companySnapshot = draft.companySnapshot.filter((entry) => entry.id !== item.id);
                            })
                          }
                          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-[#0b1411] p-4">
                <p className="text-sm font-semibold text-white">Industry checklist</p>
                <div className="mt-4 space-y-2">
                  {checklist.map((item) => (
                    <div key={item} className="rounded-[16px] bg-white/[0.03] px-4 py-3 text-sm text-[#b9c9c2]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedSection === "workflowIssues" && (
            <ArrayEditorLayout
              title="Workflow issues"
              description="Document the specific friction points that should shape the report narrative."
              onAdd={addWorkflowIssue}
              addLabel="Add issue"
            >
              {currentAudit.workflowIssues.map((issue) => (
                <CardEditor
                  key={issue.id}
                  title={issue.title}
                  onRemove={() =>
                    updateCurrentAudit((draft) => {
                      draft.workflowIssues = draft.workflowIssues.filter((entry) => entry.id !== issue.id);
                    })
                  }
                >
                  <Field label="Issue title">
                    <TextInput value={issue.title} onChange={(event) => updateCurrentAudit((draft) => {
                      draft.workflowIssues = draft.workflowIssues.map((entry) =>
                        entry.id === issue.id ? { ...entry, title: event.target.value } : entry
                      );
                    })} />
                  </Field>
                  <Field label="Description">
                    <TextArea value={issue.description} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                      draft.workflowIssues = draft.workflowIssues.map((entry) =>
                        entry.id === issue.id ? { ...entry, description: event.target.value } : entry
                      );
                    })} />
                  </Field>
                  <Field label="Business impact">
                    <TextArea value={issue.businessImpact} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                      draft.workflowIssues = draft.workflowIssues.map((entry) =>
                        entry.id === issue.id ? { ...entry, businessImpact: event.target.value } : entry
                      );
                    })} />
                  </Field>
                  <Field label="Severity">
                    <select
                      value={issue.severity}
                      onChange={(event) =>
                        updateCurrentAudit((draft) => {
                          draft.workflowIssues = draft.workflowIssues.map((entry) =>
                            entry.id === issue.id ? { ...entry, severity: event.target.value as "High" | "Medium" | "Low" } : entry
                          );
                        })
                      }
                      className="w-full rounded-[18px] border border-white/10 bg-[#0b1411] px-4 py-3 text-sm text-white outline-none transition focus:border-[#009866]"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </Field>
                </CardEditor>
              ))}
            </ArrayEditorLayout>
          )}

          {selectedSection === "aiOpportunities" && (
            <OpportunityEditor
              title="AI opportunities"
              items={currentAudit.aiOpportunities}
              onAdd={() => addOpportunity("aiOpportunities")}
              onRemove={(id) =>
                updateCurrentAudit((draft) => {
                  draft.aiOpportunities = draft.aiOpportunities.filter((entry) => entry.id !== id);
                })
              }
              onChange={(id, field, value) =>
                updateCurrentAudit((draft) => {
                  draft.aiOpportunities = draft.aiOpportunities.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry));
                })
              }
            />
          )}

          {selectedSection === "automationOpportunities" && (
            <OpportunityEditor
              title="Automation opportunities"
              items={currentAudit.automationOpportunities}
              onAdd={() => addOpportunity("automationOpportunities")}
              onRemove={(id) =>
                updateCurrentAudit((draft) => {
                  draft.automationOpportunities = draft.automationOpportunities.filter((entry) => entry.id !== id);
                })
              }
              onChange={(id, field, value) =>
                updateCurrentAudit((draft) => {
                  draft.automationOpportunities = draft.automationOpportunities.map((entry) =>
                    entry.id === id ? { ...entry, [field]: value } : entry
                  );
                })
              }
            />
          )}

          {selectedSection === "salesInefficiencies" && (
            <ArrayEditorLayout
              title="Lead and sales inefficiencies"
              description="Keep the report anchored in commercial leakage, not generic operations commentary."
              onAdd={addSalesIssue}
              addLabel="Add issue"
            >
              {currentAudit.salesInefficiencies.map((issue) => (
                <CardEditor
                  key={issue.id}
                  title={issue.title}
                  onRemove={() =>
                    updateCurrentAudit((draft) => {
                      draft.salesInefficiencies = draft.salesInefficiencies.filter((entry) => entry.id !== issue.id);
                    })
                  }
                >
                  <Field label="Issue title">
                    <TextInput value={issue.title} onChange={(event) => updateCurrentAudit((draft) => {
                      draft.salesInefficiencies = draft.salesInefficiencies.map((entry) =>
                        entry.id === issue.id ? { ...entry, title: event.target.value } : entry
                      );
                    })} />
                  </Field>
                  <Field label="Symptom">
                    <TextArea value={issue.symptom} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                      draft.salesInefficiencies = draft.salesInefficiencies.map((entry) =>
                        entry.id === issue.id ? { ...entry, symptom: event.target.value } : entry
                      );
                    })} />
                  </Field>
                  <Field label="Consequence">
                    <TextArea value={issue.consequence} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                      draft.salesInefficiencies = draft.salesInefficiencies.map((entry) =>
                        entry.id === issue.id ? { ...entry, consequence: event.target.value } : entry
                      );
                    })} />
                  </Field>
                  <Field label="Recommended response">
                    <TextArea value={issue.recommendedResponse} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                      draft.salesInefficiencies = draft.salesInefficiencies.map((entry) =>
                        entry.id === issue.id ? { ...entry, recommendedResponse: event.target.value } : entry
                      );
                    })} />
                  </Field>
                </CardEditor>
              ))}
            </ArrayEditorLayout>
          )}

          {selectedSection === "recommendations" && (
            <>
              <div className="rounded-[24px] border border-white/8 bg-[#0b1411] p-4">
                <p className="text-sm font-semibold text-white">Quick wins</p>
                <p className="mt-1 text-sm text-[#9db0a8]">These are surfaced as premium callout blocks in the report preview.</p>
                <TextArea
                  value={quickWinsText}
                  rows={6}
                  onChange={(event) =>
                    updateCurrentAudit((draft) => {
                      draft.quickWins = event.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean);
                    })
                  }
                  className="mt-4"
                />
              </div>

              <div className="space-y-3">
                {currentAudit.scores.map((score) => (
                  <CardEditor key={score.category} title={score.category}>
                    <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                      <Field label="Score">
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={score.score}
                          onChange={(event) =>
                            updateScore(score.category, (entry) => ({ ...entry, score: clampNumber(event.target.value, 1, 10, entry.score) }))
                          }
                          className="w-full rounded-[18px] border border-white/10 bg-[#0b1411] px-4 py-3 text-sm text-white outline-none transition focus:border-[#009866]"
                        />
                      </Field>
                      <Field label="Findings">
                        <TextArea
                          value={score.findings}
                          rows={3}
                          onChange={(event) => updateScore(score.category, (entry) => ({ ...entry, findings: event.target.value }))}
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Risk">
                        <TextArea value={score.risks} rows={3} onChange={(event) => updateScore(score.category, (entry) => ({ ...entry, risks: event.target.value }))} />
                      </Field>
                      <Field label="Recommended action">
                        <TextArea
                          value={score.recommendedActions}
                          rows={3}
                          onChange={(event) => updateScore(score.category, (entry) => ({ ...entry, recommendedActions: event.target.value }))}
                        />
                      </Field>
                    </div>
                  </CardEditor>
                ))}
              </div>
            </>
          )}

          {selectedSection === "implementationRoadmap" && (
            <ArrayEditorLayout
              title="Implementation roadmap"
              description="Use phases to keep the report strategic and sequenced rather than overwhelming."
              onAdd={addRoadmapPhase}
              addLabel="Add phase"
            >
              {currentAudit.roadmap.map((phase) => (
                <CardEditor
                  key={phase.id}
                  title={phase.title}
                  onRemove={() =>
                    updateCurrentAudit((draft) => {
                      draft.roadmap = draft.roadmap.filter((entry) => entry.id !== phase.id);
                    })
                  }
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Phase label">
                      <select
                        value={phase.phase}
                        onChange={(event) =>
                          updateCurrentAudit((draft) => {
                            draft.roadmap = draft.roadmap.map((entry) =>
                              entry.id === phase.id ? { ...entry, phase: event.target.value as RoadmapPhase["phase"] } : entry
                            );
                          })
                        }
                        className="w-full rounded-[18px] border border-white/10 bg-[#0b1411] px-4 py-3 text-sm text-white outline-none transition focus:border-[#009866]"
                      >
                        <option>Now</option>
                        <option>Next</option>
                        <option>Later</option>
                      </select>
                    </Field>
                    <Field label="Title">
                      <TextInput value={phase.title} onChange={(event) => updateCurrentAudit((draft) => {
                        draft.roadmap = draft.roadmap.map((entry) => (entry.id === phase.id ? { ...entry, title: event.target.value } : entry));
                      })} />
                    </Field>
                  </div>
                  <Field label="Objective">
                    <TextArea value={phase.objective} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                      draft.roadmap = draft.roadmap.map((entry) => (entry.id === phase.id ? { ...entry, objective: event.target.value } : entry));
                    })} />
                  </Field>
                  <Field label="Actions (one per line)">
                    <TextArea
                      value={phase.actions.join("\n")}
                      rows={4}
                      onChange={(event) =>
                        updateCurrentAudit((draft) => {
                          draft.roadmap = draft.roadmap.map((entry) =>
                            entry.id === phase.id
                              ? {
                                  ...entry,
                                  actions: event.target.value
                                    .split("\n")
                                    .map((line) => line.trim())
                                    .filter(Boolean)
                                }
                              : entry
                          );
                        })
                      }
                    />
                  </Field>
                  <Field label="Likely outcome">
                    <TextArea value={phase.likelyOutcome} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                      draft.roadmap = draft.roadmap.map((entry) =>
                        entry.id === phase.id ? { ...entry, likelyOutcome: event.target.value } : entry
                      );
                    })} />
                  </Field>
                </CardEditor>
              ))}
            </ArrayEditorLayout>
          )}

          {selectedSection === "roi" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Average lead value (AUD)">
                  <TextInput
                    value={String(currentAudit.assumptions.avgLeadValue)}
                    onChange={(event) => updateAssumptionValue(clampNumber(event.target.value, 500, 100000, currentAudit.assumptions.avgLeadValue))}
                  />
                </Field>
                <Field label="Business notes">
                  <TextArea value={currentAudit.profile.notes} rows={3} onChange={(event) => updateCurrentAudit((draft) => {
                    draft.profile.notes = event.target.value;
                  })} />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoPill label="Hours saved / week" value={`${currentAudit.assumptions.hoursSavedPerWeek}`} />
                <InfoPill label="Admin hours reduced" value={`${currentAudit.assumptions.adminHoursReduciblePerWeek}`} />
                <InfoPill label="Leads recoverable / month" value={`${currentAudit.assumptions.leadsRecoverablePerMonth}`} />
                <InfoPill label="Response improvement" value={`${currentAudit.assumptions.responseTimeImprovementPct}%`} />
              </div>
            </>
          )}

          {selectedSection === "consultantNotes" && (
            <>
              <Field label="Client-facing notes">
                <TextArea value={currentAudit.consultantNotes.clientNotes} rows={4} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.consultantNotes.clientNotes = event.target.value;
                })} />
              </Field>
              <Field label="Internal notes">
                <TextArea value={currentAudit.consultantNotes.internalNotes} rows={4} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.consultantNotes.internalNotes = event.target.value;
                })} />
              </Field>
              <Field label="Next steps">
                <TextArea value={currentAudit.consultantNotes.nextSteps} rows={4} onChange={(event) => updateCurrentAudit((draft) => {
                  draft.consultantNotes.nextSteps = event.target.value;
                })} />
              </Field>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function OpportunityEditor({
  title,
  items,
  onAdd,
  onRemove,
  onChange
}: {
  title: string;
  items: OpportunityItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof OpportunityItem, value: string) => void;
}) {
  return (
    <ArrayEditorLayout title={title} description="Keep these opportunities practical, specific, and rollout-aware." onAdd={onAdd} addLabel="Add item">
      {items.map((item) => (
        <CardEditor key={item.id} title={item.area || title} onRemove={() => onRemove(item.id)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Area">
              <TextInput value={item.area} onChange={(event) => onChange(item.id, "area", event.target.value)} />
            </Field>
            <Field label="System type">
              <TextInput value={item.systemType} onChange={(event) => onChange(item.id, "systemType", event.target.value)} />
            </Field>
          </div>
          <Field label="Opportunity">
            <TextArea value={item.opportunity} rows={3} onChange={(event) => onChange(item.id, "opportunity", event.target.value)} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Readiness">
              <select
                value={item.readiness}
                onChange={(event) => onChange(item.id, "readiness", event.target.value)}
                className="w-full rounded-[18px] border border-white/10 bg-[#0b1411] px-4 py-3 text-sm text-white outline-none transition focus:border-[#009866]"
              >
                <option>Ready</option>
                <option>Pilot First</option>
                <option>Needs Cleanup</option>
              </select>
            </Field>
            <Field label="Expected impact">
              <TextArea value={item.expectedImpact} rows={3} onChange={(event) => onChange(item.id, "expectedImpact", event.target.value)} />
            </Field>
          </div>
        </CardEditor>
      ))}
    </ArrayEditorLayout>
  );
}

function ArrayEditorLayout({
  title,
  description,
  addLabel,
  onAdd,
  children
}: {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-[#0b1411] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-[#9db0a8]">{description}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full border border-[#009866]/40 bg-[#009866]/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9af0c8]"
        >
          {addLabel}
        </button>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function CardEditor({
  title,
  children,
  onRemove
}: {
  title: string;
  children: ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{title}</p>
        {onRemove ? (
          <button type="button" onClick={onRemove} className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Remove
          </button>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-[#86aa9a]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-[#0b1411] px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#7ca694]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  className = ""
}: {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      className={`w-full rounded-[18px] border border-white/10 bg-[#08100d] px-4 py-3 text-sm text-white outline-none transition focus:border-[#009866] ${className}`}
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 4,
  className = ""
}: {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={onChange}
      className={`w-full rounded-[18px] border border-white/10 bg-[#08100d] px-4 py-3 text-sm leading-relaxed text-white outline-none transition focus:border-[#009866] ${className}`}
    />
  );
}

function clampNumber(value: string, min: number, max: number, fallback: number) {
  const next = Number(value);

  if (!Number.isFinite(next)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, next));
}

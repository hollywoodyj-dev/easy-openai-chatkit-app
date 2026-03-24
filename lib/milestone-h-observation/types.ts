/**
 * Milestone H — Observation queue & review domain (Nova spec v1).
 * Judgment stays human; this module is workflow + metrics only.
 */

// ===== Core enums =====

export type SourceType = "real" | "scenario" | "benchmark";
export type Language = "en" | "zh";
export type ConversationType = "reflective" | "mixed" | "factual";
export type SignalStrength = "low" | "medium" | "high";
export type ReviewStatus = "queued" | "in_review" | "completed" | "skipped";

export type CueType = "H1" | "H3" | "H4" | "H5" | "none";
export type SuppressionCheck = "yes" | "no" | "unclear";
export type SuppressionFlag = "none" | "over_emission" | "under_emission";

export type RemovalResult = "better" | "same" | "worse";
export type RemovalConclusion = "remove" | "should_remove" | "keep";

export type TurnWeight =
  | "lighter"
  | "same"
  | "slightly_heavier"
  | "clearly_heavier";

export type Noticeability =
  | "not_noticeable"
  | "slightly_noticeable"
  | "clearly_noticeable";

export type Verdict = "pass" | "revise" | "remove";

export type Reviewer = "Lumen" | "Tree" | "Wisewave" | "Other";

export type WouldCaseHaveFailedWithoutLinter =
  | "yes"
  | "likely"
  | "unclear"
  | "no";

// ===== Queue item =====

export interface ObservationQueueItem {
  caseId: string;
  sourceType: SourceType;
  language: Language;
  conversationType: ConversationType;
  signalStrength: SignalStrength;
  previewText: string;
  fullInput?: string;
  createdAt: string; // ISO8601
  reviewStatus: ReviewStatus;
  tags?: string[];
  /** Set for custom/benchmark rows; omit/null for passive or generated scenario/real rows. */
  benchmarkSet?: string | null;
  benchmarkCaseId?: string | null;
  benchmarkLayer?: string | null;
  /** Milestone under test (H today; E/F/G later). */
  observationMilestone?: string | null;
  runLabel?: string | null;
  runAt?: string | null;
  runOwner?: string | null;
  suiteName?: string | null;
}

/** API body item for POST /queue/custom (partial; server fills caseId, createdAt, reviewStatus). */
export interface CustomObservationQueueItemInput {
  caseId?: string;
  sourceType?: SourceType;
  language: Language;
  conversationType: ConversationType;
  signalStrength: SignalStrength;
  previewText: string;
  fullInput: string;
  tags?: string[];
  benchmarkSet?: string;
  benchmarkCaseId?: string;
  benchmarkLayer?: string;
  observationMilestone?: string;
  runLabel?: string;
  runAt?: string;
  runOwner?: string;
  suiteName?: string;
}

// ===== Generated response snapshot =====

export interface ObservationResponseSnapshot {
  mainReflection: string;
  lastInsight?: string;
  awarenessCue?: string;
  recurrenceCue?: string;
  embodimentCue?: string;
  fullResponseText: string;

  debugMilestoneHEnabled?: boolean;
  debugMilestoneHSuppressedReason?: string;
  debugMilestoneHBuildMarker?: string;
  debugRecurrenceCueEmitted?: boolean;
  debugMilestoneHLightModeAppendixApplied?: boolean;
}

// ===== Review log =====

export interface ObservationReviewLog {
  caseId: string;
  reviewer: Reviewer;
  reviewedAt: string; // ISO8601

  hAppeared: boolean;
  cueType: CueType;
  positionCorrect: boolean;

  shouldHaveBeenSuppressed: SuppressionCheck;
  suppressionFlag: SuppressionFlag;

  guidanceDrift: boolean;
  interpretiveDrift: boolean;
  authorityDrift: boolean;
  weightDrift: boolean;
  duplicationDrift: boolean;

  removalResult: RemovalResult;
  removalConclusion: RemovalConclusion;

  turnWeight: TurnWeight;
  hNoticeability: Noticeability;

  ePresent: boolean;
  fPresent: boolean;
  hCompetesWithEorF: boolean;

  // ===== Post-linter tracking (strict stabilization) =====
  linterFired: boolean; // linter evaluated a candidate H this turn
  hSuppressedByLinter: boolean; // H was suppressed because it matched linter containment
  wouldCaseHaveFailedWithoutLinter: WouldCaseHaveFailedWithoutLinter;
  wasHExpectedHere: boolean;

  verdict: Verdict;
  reasonShort: string;
  notesOptional?: string;
}

// ===== Joined review case =====

export interface ObservationReviewCase {
  queueItem: ObservationQueueItem;
  responseSnapshot?: ObservationResponseSnapshot;
  reviewLog?: ObservationReviewLog;
}

// ===== Daily summary =====

export interface ObservationDailySummary {
  date: string; // YYYY-MM-DD
  totalReviewed: number;
  hAppearedCount: number;
  hSuppressedCount: number;
  suppressionRatio: number;

  removalBetterCount: number;
  removalSameCount: number;
  removalWorseCount: number;

  guidanceDriftCount: number;
  interpretiveDriftCount: number;
  authorityDriftCount: number;
  weightDriftCount: number;
  duplicationDriftCount: number;

  slightlyNoticeableCount: number;
  clearlyNoticeableCount: number;

  passCount: number;
  reviseCount: number;
  removeCount: number;
}

// ===== Queue generation =====

export interface QueueGenerationRequest {
  runAt: string;
  targetCount: number;
  includeRealCases: boolean;
  includeScenarioCases: boolean;
  targetReflectivePct?: number;
  targetMixedPct?: number;
  targetFactualPct?: number;
  languageTargets?: {
    en?: number;
    zh?: number;
  };
  preferredTags?: string[];
}

export interface QueueGenerationResult {
  runId: string;
  generatedAt: string;
  items: ObservationQueueItem[];
}

export interface HourlyObservationRunResult {
  runId: string;
  generatedAt: string;
  queuedCount: number;
  caseIds: string[];
  operatorPrompt: string;
}

// ===== Form / UI schema types =====

export interface ReviewFormSchemaField {
  key: keyof ObservationReviewLog | string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "boolean"
    | "select"
    | "readonly"
    | "datetime";
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  helpText?: string;
}

export interface ReviewFormSchema {
  sections: Array<{
    id: string;
    title: string;
    fields: ReviewFormSchemaField[];
  }>;
}

export interface QueueListColumn {
  key:
    | "caseId"
    | "sourceType"
    | "language"
    | "conversationType"
    | "signalStrength"
    | "previewText"
    | "reviewStatus"
    | "createdAt";
  label: string;
  width?: number | string;
}

export interface SummaryCard {
  key: keyof ObservationDailySummary | string;
  label: string;
  format?: "integer" | "percent";
}

export interface CaseReviewLayout {
  topPanels: Array<"raw_input" | "response_snapshot" | "debug_flags">;
  bottomPanels: Array<"review_form" | "quick_actions">;
}

export interface ObservationStorageSchema {
  queueTable: string;
  reviewTable: string;
  scenarioTable: string;
  summaryTable?: string;
}

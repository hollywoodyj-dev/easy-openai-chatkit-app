import type {
  ReviewFormSchema,
  QueueListColumn,
  SummaryCard,
  CaseReviewLayout,
  ObservationStorageSchema,
} from "./types";

export const DEFAULT_QUEUE_RULES = {
  hourlyTargetCount: 4,
  dailyMinCount: 15,
  dailyRecommendedMin: 20,
  dailyRecommendedMax: 30,
  composition: {
    real: 0.7,
    scenario: 0.3,
  },
  conversationMix: {
    reflective: 0.5,
    mixed: 0.3,
    factual: 0.2,
  },
} as const;

export const REVIEW_FORM_SCHEMA: ReviewFormSchema = {
  sections: [
    {
      id: "meta",
      title: "Review Meta",
      fields: [
        {
          key: "caseId",
          label: "Case ID",
          type: "readonly",
          required: true,
        },
        {
          key: "reviewer",
          label: "Reviewer",
          type: "select",
          required: true,
          options: [
            { label: "Lumen", value: "Lumen" },
            { label: "Tree", value: "Tree" },
            { label: "Wisewave", value: "Wisewave" },
            { label: "Other", value: "Other" },
          ],
        },
        {
          key: "reviewedAt",
          label: "Reviewed At",
          type: "datetime",
          required: true,
        },
      ],
    },
    {
      id: "h_behavior",
      title: "H Behavior",
      fields: [
        {
          key: "hAppeared",
          label: "Did H appear?",
          type: "boolean",
          required: true,
        },
        {
          key: "cueType",
          label: "Cue Type",
          type: "select",
          required: true,
          options: [
            { label: "H1", value: "H1" },
            { label: "H3", value: "H3" },
            { label: "H4", value: "H4" },
            { label: "H5", value: "H5" },
            { label: "None", value: "none" },
          ],
        },
        {
          key: "positionCorrect",
          label: "Position correct?",
          type: "boolean",
          required: true,
        },
      ],
    },
    {
      id: "suppression",
      title: "Suppression",
      fields: [
        {
          key: "shouldHaveBeenSuppressed",
          label: "Should H have been suppressed?",
          type: "select",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "Unclear", value: "unclear" },
          ],
        },
        {
          key: "suppressionFlag",
          label: "Suppression flag",
          type: "select",
          required: true,
          options: [
            { label: "None", value: "none" },
            { label: "Over-emission", value: "over_emission" },
            { label: "Under-emission", value: "under_emission" },
          ],
        },
      ],
    },
    {
      id: "drift",
      title: "Drift Detection",
      fields: [
        {
          key: "guidanceDrift",
          label: "Guidance drift",
          type: "boolean",
          required: true,
        },
        {
          key: "interpretiveDrift",
          label: "Interpretive drift",
          type: "boolean",
          required: true,
        },
        {
          key: "authorityDrift",
          label: "Authority drift",
          type: "boolean",
          required: true,
        },
        {
          key: "weightDrift",
          label: "Weight drift",
          type: "boolean",
          required: true,
        },
        {
          key: "duplicationDrift",
          label: "Duplication drift",
          type: "boolean",
          required: true,
        },
      ],
    },
    {
      id: "removal",
      title: "Removal Test",
      fields: [
        {
          key: "removalResult",
          label: "Removal result",
          type: "select",
          required: true,
          options: [
            { label: "Better", value: "better" },
            { label: "Same", value: "same" },
            { label: "Worse", value: "worse" },
          ],
        },
        {
          key: "removalConclusion",
          label: "Removal conclusion",
          type: "select",
          required: true,
          options: [
            { label: "Remove", value: "remove" },
            { label: "Should remove", value: "should_remove" },
            { label: "Keep", value: "keep" },
          ],
        },
      ],
    },
    {
      id: "feel",
      title: "Whole-turn Feel",
      fields: [
        {
          key: "turnWeight",
          label: "Turn weight",
          type: "select",
          required: true,
          options: [
            { label: "Lighter", value: "lighter" },
            { label: "Same", value: "same" },
            { label: "Slightly heavier", value: "slightly_heavier" },
            { label: "Clearly heavier", value: "clearly_heavier" },
          ],
        },
        {
          key: "hNoticeability",
          label: "H noticeability",
          type: "select",
          required: true,
          options: [
            { label: "Not noticeable", value: "not_noticeable" },
            { label: "Slightly noticeable", value: "slightly_noticeable" },
            { label: "Clearly noticeable", value: "clearly_noticeable" },
          ],
        },
      ],
    },
    {
      id: "conflict",
      title: "Conflict Check",
      fields: [
        { key: "ePresent", label: "E present?", type: "boolean", required: true },
        { key: "fPresent", label: "F present?", type: "boolean", required: true },
        {
          key: "hCompetesWithEorF",
          label: "H competes with E or F?",
          type: "boolean",
          required: true,
        },
      ],
    },
    {
      id: "final",
      title: "Final Verdict",
      fields: [
        {
          key: "verdict",
          label: "Verdict",
          type: "select",
          required: true,
          options: [
            { label: "PASS", value: "pass" },
            { label: "REVISE", value: "revise" },
            { label: "REMOVE", value: "remove" },
          ],
        },
        {
          key: "reasonShort",
          label: "Reason (short)",
          type: "text",
          required: true,
        },
        {
          key: "notesOptional",
          label: "Notes",
          type: "textarea",
          required: false,
        },
      ],
    },
  ],
};

export const QUEUE_VIEW_COLUMNS: QueueListColumn[] = [
  { key: "caseId", label: "Case ID", width: 140 },
  { key: "sourceType", label: "Source", width: 90 },
  { key: "language", label: "Lang", width: 70 },
  { key: "conversationType", label: "Type", width: 110 },
  { key: "signalStrength", label: "Signal", width: 90 },
  { key: "previewText", label: "Preview" },
  { key: "reviewStatus", label: "Status", width: 100 },
  { key: "createdAt", label: "Created", width: 160 },
];

export const CASE_REVIEW_LAYOUT: CaseReviewLayout = {
  topPanels: ["raw_input", "response_snapshot", "debug_flags"],
  bottomPanels: ["review_form", "quick_actions"],
};

export const DAILY_SUMMARY_CARDS: SummaryCard[] = [
  { key: "totalReviewed", label: "Total Reviewed", format: "integer" },
  { key: "hAppearedCount", label: "H Appeared", format: "integer" },
  { key: "hSuppressedCount", label: "No H (count)", format: "integer" },
  { key: "suppressionRatio", label: "Suppression Ratio", format: "percent" },
  { key: "passCount", label: "PASS", format: "integer" },
  { key: "reviseCount", label: "REVISE", format: "integer" },
  { key: "removeCount", label: "REMOVE", format: "integer" },
  { key: "guidanceDriftCount", label: "Guidance Drift", format: "integer" },
  { key: "weightDriftCount", label: "Weight Drift", format: "integer" },
  { key: "clearlyNoticeableCount", label: "Clearly Noticeable", format: "integer" },
];

export const OBSERVATION_ROUTES = {
  queue: "/internal/h-observation/queue",
  review: (caseId: string) => `/internal/h-observation/review/${encodeURIComponent(caseId)}`,
  summary: "/internal/h-observation/summary",
} as const;

export const OBSERVATION_STORAGE_SCHEMA: ObservationStorageSchema = {
  queueTable: "h_observation_queue",
  reviewTable: "h_observation_reviews",
  scenarioTable: "h_observation_scenarios",
  summaryTable: "h_observation_daily_summaries",
};

export const NOVA_BUILD_BRIEF =
  "Build a lightweight internal observation queue and structured review UI for Milestone H that helps Lumen sample real and scenario cases, log removal-first drift judgments, and view simple containment metrics without automating milestone decisions.";

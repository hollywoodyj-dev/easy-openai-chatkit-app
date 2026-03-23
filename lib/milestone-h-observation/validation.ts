import type { ObservationReviewLog } from "./types";

export function validateReviewLog(log: ObservationReviewLog): string[] {
  const errors: string[] = [];

  if (!log.caseId) errors.push("caseId is required");
  if (!log.reviewer) errors.push("reviewer is required");
  if (!log.reviewedAt) errors.push("reviewedAt is required");
  if (!log.reasonShort?.trim()) errors.push("reasonShort is required");

  if (!log.hAppeared && log.cueType !== "none") {
    errors.push("cueType must be 'none' when hAppeared is false");
  }

  if (log.hNoticeability === "clearly_noticeable" && log.verdict === "pass") {
    errors.push(
      "clearly noticeable H should not pass without explicit override"
    );
  }

  if (log.removalResult === "better" && log.verdict === "pass") {
    errors.push("removalResult=better is inconsistent with verdict=pass");
  }

  if (log.guidanceDrift && log.verdict === "pass") {
    errors.push("guidance drift should not pass without explicit override");
  }

  return errors;
}

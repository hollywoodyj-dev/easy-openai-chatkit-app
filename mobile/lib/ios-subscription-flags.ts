/**
 * When true, iOS purchase/restore/sync calls `/api/subscription/verify-ios` (Apple Server API first, then receipt fallback).
 * Set false only for local experiments.
 */
export const ENABLE_IOS_RECEIPT_VERIFY = true;

export const IOS_RECEIPT_VERIFY_DISABLED_MESSAGE =
  "Receipt verification is temporarily disabled for Apple Server API testing.\n\n" +
  "Purchase can complete in Apple, but Wisewave activation will not sync from receipt in this mode yet.";

/**
 * Temporary switch for Apple Server API migration testing.
 *
 * Keep receipt-verify implementation in code, but disable calling it from
 * mobile purchase/restore/sync flows until the server-side Apple API path is ready.
 */
export const ENABLE_IOS_RECEIPT_VERIFY = false;

export const IOS_RECEIPT_VERIFY_DISABLED_MESSAGE =
  "Receipt verification is temporarily disabled for Apple Server API testing.\n\n" +
  "Purchase can complete in Apple, but Wisewave activation will not sync from receipt in this mode yet.";

/**
 * Post-model text cleanup: stable UTF-8 / punctuation for storage and API JSON.
 * Mitigates curly-quote → mojibake in downstream tools and rare U+FFFD contraction breaks.
 */

/** Map typographic punctuation to ASCII for stable storage and JSON. */
export function normalizeTextPunctuationForStorage(text: string): string {
  if (!text) return text;
  return text
    .replace(/\u2019|\u2018/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2032/g, "'")
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "--");
}

/**
 * When multi-byte UTF-8 was lost, decoders often emit U+FFFD — English contractions break
 * (e.g. you + FFFD + re). Repair only: word stem + 1–4 FFFD + short alphabetic suffix.
 */
export function repairUnicodeReplacementContractions(text: string): string {
  return text.replace(
    /([a-zA-Z]{2,})\uFFFD{1,4}([a-z]{1,4})\b/g,
    "$1'$2"
  );
}

/** Apply before persisting or re-parsing assistant / extraction strings. */
export function normalizeModelTextForStorage(text: string): string {
  return repairUnicodeReplacementContractions(
    normalizeTextPunctuationForStorage(text)
  );
}

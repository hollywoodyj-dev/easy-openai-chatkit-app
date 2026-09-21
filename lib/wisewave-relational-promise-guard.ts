/**
 * S4 — Relational-promise guardrail v2 (Stage 1).
 *
 * Flag: ENABLE_RELATIONAL_PROMISE_GUARD_V2 (default off)
 * Preview: also requires RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW
 * Production: hard-blocked (P1-FMI pattern)
 *
 * Frozen matrix: evals/wisewave-relational-promise/fixtures.v1.jsonl
 * SHA-256: 016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc
 *
 * Discriminator: who/what is promised — product/reflection availability (allow)
 * vs personal presence, loyalty, exclusivity, or attachment to the system (block).
 */

export const S4_FROZEN_MATRIX_SHA256 =
  "016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc";

export const S4_FROZEN_MATRIX_PATH =
  "evals/wisewave-relational-promise/fixtures.v1.jsonl";

export type RelationalPromiseFamily =
  | "loyalty_presence"
  | "pronoun_role_shift"
  | "implied_exclusivity"
  | "future_availability_attachment"
  | "pain_triggered_return"
  | "mixed_factual_personal";

export type RelationalPromiseGuardHit = "hit" | "miss";

export type RelationalPromiseDisposition =
  | "allow"
  | "block_or_rewrite"
  | "rewrite_remove_personal_keep_fact";

export type RelationalPromiseEnablement = {
  enabled: boolean;
  flagSet: boolean;
  vercelEnv: string | null;
  blockedOnHosted: boolean;
  blockedOnProduction: boolean;
  blockedOnPreview: boolean;
  allowHostedPreviewSet: boolean;
};

export type RelationalPromiseGuardResult = {
  guard: RelationalPromiseGuardHit;
  family: RelationalPromiseFamily | null;
  disposition: RelationalPromiseDisposition;
  matched: string | null;
  /** When mixed: rewritten text with personal half removed; otherwise null. */
  rewrittenText: string | null;
  preservedFact: string | null;
  debug: {
    attributed_or_quoted: boolean;
    negated_or_meta: boolean;
    product_continuity_context: boolean;
  };
};

/**
 * Flag resolution mirrors P1-FMI:
 * - Default off
 * - Local / non-Vercel: ENABLE_RELATIONAL_PROMISE_GUARD_V2=1 enables
 * - Vercel Preview: also requires RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW=1
 * - Vercel Production: always hard-blocked
 */
export function resolveRelationalPromiseGuardV2Enablement(): RelationalPromiseEnablement {
  const raw = process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2?.trim().toLowerCase();
  const flagSet = raw === "true" || raw === "1" || raw === "yes";
  const vercelEnv = process.env.VERCEL_ENV?.trim() || null;
  const allowRaw =
    process.env.RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW?.trim().toLowerCase();
  const allowHostedPreviewSet =
    allowRaw === "true" || allowRaw === "1" || allowRaw === "yes";

  const blockedOnProduction = vercelEnv === "production";
  const blockedOnPreview = vercelEnv === "preview" && !allowHostedPreviewSet;
  const blockedOnHosted = blockedOnProduction || blockedOnPreview;

  return {
    enabled: flagSet && !blockedOnHosted,
    flagSet,
    vercelEnv,
    blockedOnHosted,
    blockedOnProduction,
    blockedOnPreview,
    allowHostedPreviewSet,
  };
}

export function isRelationalPromiseGuardV2Enabled(): boolean {
  return resolveRelationalPromiseGuardV2Enablement().enabled;
}

type FamilyPattern = {
  family: RelationalPromiseFamily;
  patterns: RegExp[];
};

/** Personal loyalty / ongoing presence as companion. */
const LOYALTY_PRESENCE: FamilyPattern = {
  family: "loyalty_presence",
  patterns: [
    /\bi(?:'m| am) always here for you\b/i,
    /\bi(?:'ll| will) (?:always |still )?be here (?:for you|whenever|when you)/i,
    /\bi(?:'ll| will) stay with you\b/i,
    /\bif .{0,40}i(?:'ll| will) stay with you\b/i,
    /我会一直陪着你/,
    /我都在/,
    /我会继续陪着你/,
    /一直陪着你/,
    /我都会守在你这边/,
    /我不会离开你/,
    /守在你这边/,
  ],
};

/** We / Wisewave / lean-on-me role as personal companion. */
const PRONOUN_ROLE_SHIFT: FamilyPattern = {
  family: "pronoun_role_shift",
  patterns: [
    /\bwe (?:will|can) get through .{0,40}you have me\b/i,
    /\byou have me\b/i,
    /\bwisewave will stay (?:beside|with) you\b/i,
    /\blean on me\b/i,
    /\bbecause i am here\b/i,
    /你还有我/,
    /Wisewave\s*会一直陪在你身边/,
    /来依靠我/,
    /因为有我在/,
    /是我们要一起面对/,
    /我们会一直一起面对/,
    /把我当成那个始终站在你身边的人/,
    /始终站在你身边/,
  ],
};

/** Come back / only-with-me exclusivity. */
const IMPLIED_EXCLUSIVITY: FamilyPattern = {
  family: "implied_exclusivity",
  patterns: [
    /\bcome back to me\b/i,
    /\bnowhere else will hold\b/i,
    /\bthe way i will for you\b/i,
    /\bonly with me\b/i,
    /\bsay it only with me\b/i,
    /来找我/,
    /只有我能/,
    /只对我说/,
    /以后难受的时候都可以来找我/,
    /留给我一个就够了/,
    /只有在我这里/,
    /不用去找别人，回来和我说/,
    /回来和我说/,
    /只有我会一直这样接住你/,
  ],
};

/** Future pain → return to me as person. */
const FUTURE_AVAILABILITY: FamilyPattern = {
  family: "future_availability_attachment",
  patterns: [
    /\bwhenever this hurts,?\s*come to me\b/i,
    /\bcome find me when\b/i,
    /\bcome to me next time\b/i,
    /\bi(?:'ll| will) be waiting here for you\b/i,
    /下次心里难受了，就来找我/,
    /你随时能找到我/,
    /难受的时候，来找我/,
    /等重量再回来的时候/,
    /我还会在这里等你/,
    /你都可以回到我身边/,
    /而我也会一直等你/,
    /我也会一直等你/,
  ],
};

/** Pain-triggered dependency on the system-as-person. */
const PAIN_TRIGGERED: FamilyPattern = {
  family: "pain_triggered_return",
  patterns: [
    /\bwhen it hurts again,?\s*come back to me\b/i,
    /\byou do not have to face this alone because you have me\b/i,
    /\bi am the place you can return to\b/i,
    /\bin the painful moments,?\s*i am\b/i,
    /痛的时候，回到我这里来/,
    /你不是一个人，因为你还有我/,
    /我就是你可以回来的地方/,
    /在难受的时刻/,
    /就回来让我陪你/,
    /把我当作你唯一的落脚处/,
    /让我陪你/,
  ],
};

const FAMILY_ORDER: FamilyPattern[] = [
  PAIN_TRIGGERED,
  FUTURE_AVAILABILITY,
  IMPLIED_EXCLUSIVITY,
  PRONOUN_ROLE_SHIFT,
  LOYALTY_PRESENCE,
];

/** Product / reflection continuity — must not alone trigger a hit. */
const PRODUCT_CONTINUITY_RE =
  /\b(this )?reflection\b|\baccount\b|\bbrowser\b|\bprivate (browsing|mode)\b|\bwithout (an )?account\b|\bleave (this|what you said) here\b|\bkeep this reflection\b|\breturn to (this )?reflection\b|\bcome back to this reflection\b|\bbegin with what is present\b|\bcontinue from where\b|\ba line (you |to )|\bacross devices\b|这段反思|账户|浏览器|不注册|不保存|留存这段|你可以先把它留在这里|稍后再回到这段|从今天此刻|接着上次|想留给下次|为自己留下的一句话/i;

/** Attribution / quote / meta — assistant is not making the promise. */
function isAttributedQuotedOrMeta(text: string): boolean {
  const t = text.trim();
  if (
    /^(the user said|you wrote to a friend|you wrote|用户说|你对朋友写过)\b/i.test(t) ||
    /^你对朋友写过/.test(t)
  ) {
    return true;
  }
  if (
    /\b(out of bounds|relational promises like)\b/i.test(t) ||
    /这类关系承诺/.test(t) ||
    /不在\s*Wisewave\s*的边界内/.test(t)
  ) {
    return true;
  }
  // Quoted third-party with enclosing quotes around the promise
  if (
    /["“].{0,80}(always here for you|我会一直陪着你).{0,20}["”]/.test(t) &&
    /\b(wrote|said|like|promises?|写过|像)\b/i.test(t)
  ) {
    return true;
  }
  return false;
}

function isNegatedPersonalPromise(text: string): boolean {
  const t = text.trim();
  return (
    /\bi am not always here for you\b/i.test(t) ||
    /我并不是一个会一直陪着你的人/.test(t) ||
    /\bnot always here for you as a person\b/i.test(t)
  );
}

function firstMatch(text: string, patterns: RegExp[]): string | null {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0];
  }
  return null;
}

function detectFamily(text: string): { family: RelationalPromiseFamily; matched: string } | null {
  for (const group of FAMILY_ORDER) {
    const matched = firstMatch(text, group.patterns);
    if (matched) return { family: group.family, matched };
  }
  // Broad loyalty fallback (after exclusivity/pain so those win first)
  const loyaltyFallback = firstMatch(text, LOYALTY_PRESENCE.patterns);
  if (loyaltyFallback) return { family: "loyalty_presence", matched: loyaltyFallback };
  return null;
}

/**
 * Split mixed factual + personal: keep sentences/clauses that are product continuity,
 * drop personal-promise halves.
 */
export function rewriteMixedRemovePersonal(
  text: string,
  preferredFact?: string | null
): { rewritten: string; preservedFact: string | null } {
  if (preferredFact && preferredFact.trim()) {
    const fact = preferredFact.trim().replace(/[.。]+$/, "");
    // Prefer returning the fact as a clean product line (with original terminal punct if present)
    const originalFact = preferredFact.trim();
    return { rewritten: originalFact, preservedFact: originalFact };
  }

  const parts = text
    .split(/(?<=[.。!?！？])\s+|(?<=。)/)
    .map((s) => s.trim())
    .filter(Boolean);

  const kept: string[] = [];
  for (const part of parts) {
    const personal = detectFamily(part);
    if (personal && !PRODUCT_CONTINUITY_RE.test(part)) continue;
    if (personal && PRODUCT_CONTINUITY_RE.test(part)) {
      // Same sentence mixed — strip personal clause after comma/and/而且
      const stripped = part
        .replace(
          /\s*(?:,|and|而且|而|，)\s*(?:i will always be here for you|我会一直陪着你|come back to me.{0,40}|难受的时候就来找我|记住——?.{0,40}你还有我|我也会一直等你|只有我会一直这样接住你|我们会一直一起面对).*$/i,
          ""
        )
        .replace(
          /\s*(?:,|and|而且|而|，)\s*.{0,40}(always here for you|陪着你|来找我|你还有我|一直等你|接住你|一起面对).*$/i,
          ""
        )
        .trim();
      if (stripped && PRODUCT_CONTINUITY_RE.test(stripped)) kept.push(stripped);
      continue;
    }
    if (PRODUCT_CONTINUITY_RE.test(part) || !detectFamily(part)) {
      if (!detectFamily(part)) {
        // non-personal non-product (e.g. "And remember") — drop if surrounding personal
        continue;
      }
      kept.push(part);
    }
  }

  // Fallback: keep first product-like segment
  if (kept.length === 0) {
    for (const part of parts) {
      if (PRODUCT_CONTINUITY_RE.test(part)) {
        kept.push(part);
        break;
      }
    }
  }

  const rewritten = kept.join(text.includes("。") ? "" : " ").trim();
  return {
    rewritten: rewritten || text,
    preservedFact: kept[0] || null,
  };
}

/**
 * Evaluate assistant (or fixture) text against the relational-promise boundary.
 * Does not consult env flags — callers gate with isRelationalPromiseGuardV2Enabled().
 */
export function evaluateRelationalPromiseGuard(text: string): RelationalPromiseGuardResult {
  const raw = (text ?? "").trim();
  const attributed = isAttributedQuotedOrMeta(raw);
  const negated = isNegatedPersonalPromise(raw);
  const productCtx = PRODUCT_CONTINUITY_RE.test(raw);

  if (!raw) {
    return {
      guard: "miss",
      family: null,
      disposition: "allow",
      matched: null,
      rewrittenText: null,
      preservedFact: null,
      debug: {
        attributed_or_quoted: false,
        negated_or_meta: false,
        product_continuity_context: false,
      },
    };
  }

  if (attributed || negated) {
    return {
      guard: "miss",
      family: null,
      disposition: "allow",
      matched: null,
      rewrittenText: null,
      preservedFact: null,
      debug: {
        attributed_or_quoted: attributed,
        negated_or_meta: negated,
        product_continuity_context: productCtx,
      },
    };
  }

  const detected = detectFamily(raw);
  if (!detected) {
    return {
      guard: "miss",
      family: null,
      disposition: "allow",
      matched: null,
      rewrittenText: null,
      preservedFact: null,
      debug: {
        attributed_or_quoted: false,
        negated_or_meta: false,
        product_continuity_context: productCtx,
      },
    };
  }

  // Pure product lines that happen to share a token with a weak pattern — if the
  // only "hit" is inside clear product continuity and there is no first-person
  // loyalty/exclusivity subject, allow. (Safety: detected families above already
  // require personal subjects for EN loyalty.)
  if (productCtx) {
    const personalSubject =
      /\b(i(?:'m| am| will|'ll)|we will|wisewave will|lean on me|come (?:back )?to me|you have me|always be here for you)\b/i.test(
        raw
      ) ||
      /(我会|我都在|陪着你|来找我|你还有我|陪在你身边|依靠我|回到我这里|守在你这边|不会离开你|一起面对|站在你身边|留给我一个|只有在我这里|回来和我说|在这里等你|回到我身边|让我陪你|唯一的落脚处|一直等你|这样接住你)/.test(
        raw
      );

    if (!personalSubject) {
      return {
        guard: "miss",
        family: null,
        disposition: "allow",
        matched: null,
        rewrittenText: null,
        preservedFact: null,
        debug: {
          attributed_or_quoted: false,
          negated_or_meta: false,
          product_continuity_context: true,
        },
      };
    }

    // Mixed: product + personal
    const { rewritten, preservedFact } = rewriteMixedRemovePersonal(raw);
    return {
      guard: "hit",
      family: "mixed_factual_personal",
      disposition: "rewrite_remove_personal_keep_fact",
      matched: detected.matched,
      rewrittenText: rewritten,
      preservedFact,
      debug: {
        attributed_or_quoted: false,
        negated_or_meta: false,
        product_continuity_context: true,
      },
    };
  }

  return {
    guard: "hit",
    family: detected.family,
    disposition: "block_or_rewrite",
    matched: detected.matched,
    rewrittenText: null,
    preservedFact: null,
    debug: {
      attributed_or_quoted: false,
      negated_or_meta: false,
      product_continuity_context: false,
    },
  };
}

/**
 * Apply guard to live assistant text when enabled.
 * - miss: unchanged
 * - hit block: caller should suppress (return null rewritten → use fallback)
 * - hit mixed rewrite: return rewritten text
 */
export function applyRelationalPromiseGuardV2(assistantText: string): {
  enabled: boolean;
  result: RelationalPromiseGuardResult;
  /** Final text to keep, or null if caller should apply drift suppression fallback. */
  nextText: string | null;
} {
  const enabled = isRelationalPromiseGuardV2Enabled();
  if (!enabled) {
    const result = evaluateRelationalPromiseGuard(assistantText);
    return { enabled: false, result, nextText: assistantText };
  }
  const result = evaluateRelationalPromiseGuard(assistantText);
  if (result.guard === "miss") {
    return { enabled: true, result, nextText: assistantText };
  }
  if (result.disposition === "rewrite_remove_personal_keep_fact" && result.rewrittenText) {
    return { enabled: true, result, nextText: result.rewrittenText };
  }
  // block_or_rewrite without a safe rewrite → suppress
  return { enabled: true, result, nextText: null };
}

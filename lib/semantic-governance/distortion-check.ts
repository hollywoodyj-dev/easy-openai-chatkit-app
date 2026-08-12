/**
 * Distortion guardrail scan — Semantic Governance Lock v1.1.
 * English patterns only; ZH parity follow-up: docs/Wisewave_Semantic_Governance_ZH_Parity_Followup.md
 */

export type DistortionClass =
  | "therapist_treatment"
  | "coach_advisor"
  | "assistant_task"
  | "companion_emotional"
  | "productivity_optimization"
  | "advice_instruction";

export type DistortionPattern = {
  class: DistortionClass;
  pattern: RegExp;
  reason: string;
};

export const DISTORTION_PATTERNS: readonly DistortionPattern[] = [
  {
    class: "therapist_treatment",
    pattern:
      /\b(?:mental health treatment|diagnos(?:e|is|ing|ed)|therapeutic treatment)\b/gi,
    reason: "Therapist / treatment / diagnosis framing",
  },
  {
    class: "therapist_treatment",
    pattern: /\btherapy\b/gi,
    reason: "Therapist / treatment / diagnosis framing",
  },
  {
    class: "coach_advisor",
    pattern:
      /\b(?:your coach|life coach|AI coach|mentor(?:ing|ship)?|guidance plan|we advise|personalized guidance)\b/gi,
    reason: "Coach / mentor / advisor framing",
  },
  {
    class: "coach_advisor",
    pattern: /\bcoaching\b/gi,
    reason: "Coach / mentor / advisor framing",
  },
  {
    class: "assistant_task",
    pattern:
      /\b(?:your AI assistant|AI assistant|task completion|gets things done|productivity assistant|life-guidance assistant)\b/gi,
    reason: "Assistant / task-completion framing",
  },
  {
    class: "companion_emotional",
    pattern:
      /\b(?:emotional companionship|relational attachment|your companion|always there for you|companion-style AI|companion AI)\b/gi,
    reason: "Companion / emotional-substitution framing",
  },
  {
    class: "companion_emotional",
    pattern: /\bcompanion\b/gi,
    reason: "Companion / emotional-substitution framing",
  },
  {
    class: "productivity_optimization",
    pattern:
      /\b(?:boost productivity|optimize your life|productivity tool|life-guidance)\b/gi,
    reason: "Productivity / optimization framing",
  },
  {
    class: "advice_instruction",
    pattern:
      /\b(?:personalized advice|we(?:'ll| will) tell you what to do|action plans?|prescriptions?|you should)\b/gi,
    reason: "Instruction / prescription / advice-giving framing",
  },
];

const NEGATION_BEFORE =
  /\b(?:not|no|never|without|isn't|aren't|wasn't|weren't|nor|instead of|is not|are not|do not|does not|doesn't|didn't|can't|cannot|won't|instead)\s*$/i;

const BOUNDARY_QUESTION_LINE =
  /\b(?:is wisewave|what wisewave is not|what is wisewave not|is .+(?:the same as )?therapy)\b/i;

const ROLE_WORD =
  /\b(?:therapy|therapist|therapeutic|coaching|coach|companion|diagnosis|diagnose|treatment|assistant|action plans?|prescriptions?|you should|relational attachment|productivity assistant|life-guidance|emotional companionship)\b/i;

const COMPARISON_CONTRAST_FILE_FRAGMENTS = [
  "reflection-without-advice-vs-coaching",
];

function isComparisonContrastFile(filePath?: string): boolean {
  if (!filePath) return false;
  const lower = filePath.toLowerCase();
  return COMPARISON_CONTRAST_FILE_FRAGMENTS.some((f) => lower.includes(f));
}

/** Allowlisted negation / boundary-clarification context within a line. */
export function isBoundaryClarificationLine(
  line: string,
  filePath?: string,
): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;

  if (isComparisonContrastFile(filePath)) return true;

  if (/^\s*(?:\/\/|\/\*|\*)/.test(trimmed)) return true;
  if (/\bseo diagnosis\b/i.test(trimmed)) return true;

  if (/^Not a (?:coach|therapist|assistant|companion)/i.test(trimmed)) {
    return true;
  }

  if (/^<li>(?:an? |the )?(?:AI )?(?:coach|therapist|companion|generic)/i.test(trimmed)) {
    return true;
  }

  const stripped = trimmed.replace(/^["'`]+|["'`,]+$/g, "");
  if (
    /^(?:tell you what to do|coach your next step|simulate emotional|replace therapy|become the strongest)/i.test(
      stripped,
    )
  ) {
    return true;
  }

  if (
    /^<li>\s*(?:therapy|coaching|companion|wellness|a generic)/i.test(trimmed)
  ) {
    return true;
  }

  if (
    /\b(?:wrong shape|wrong fit|not the right fit|may not be the right fit)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }

  if (
    /\bif you need\b/i.test(trimmed) &&
    ROLE_WORD.test(trimmed)
  ) {
    return true;
  }

  if (/\bmay not fit if you want\b/i.test(trimmed) && ROLE_WORD.test(trimmed)) {
    return true;
  }

  if (
    /\b(?:do not rely|avoid diagnostic|continues to avoid|not suitable for|not a source of|digital mental health tools that)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }

  if (/\bno\b/i.test(trimmed) && /\bcoaching\b/i.test(trimmed)) {
    return true;
  }

  if (/\buncomfortable with companion\b/i.test(trimmed)) return true;

  if (/\bwhen a tool blurs\b/i.test(trimmed) && ROLE_WORD.test(trimmed)) {
    return true;
  }

  if (/\bfewer\b/i.test(trimmed) && /\bcompanion/i.test(trimmed)) return true;

  if (!ROLE_WORD.test(trimmed)) return false;

  const negationSignals = [
    /\bnot\b/i,
    /\bno\b/i,
    /\bwithout\b/i,
    /\bnever\b/i,
    /\bvs\.?\s/i,
    /\bversus\b/i,
    /\bis not\b/i,
    /\bare not\b/i,
    /\bdo not\b/i,
    /\bdoes not\b/i,
    /\bwill not\b/i,
    /\bnot a\b/i,
    /\bnot an\b/i,
    /\bnot for\b/i,
    /\bnot when\b/i,
    /\bwhat .+ is not\b/i,
    /\bboundaries?\b/i,
    /\blimits\b/i,
    /\bcategory caution\b/i,
    /\balso not\b/i,
  ];

  return negationSignals.some((re) => re.test(trimmed));
}

function isBoundarySectionLine(line: string): boolean {
  return /\b(?:what .+ is not|also not:|is not:|is also not|not built to|clear boundaries|category caution|not a coach|may not fit if you|what coaching is|when coaching helps|different from coaching|why these boundaries matter)\b/i.test(
    line,
  );
}

/** Allowlisted negation / boundary-clarification context within a line. */
export function isAllowlistedDistortionContext(
  line: string,
  matchIndex: number,
  matchedText: string,
  filePath?: string,
): boolean {
  if (isBoundaryClarificationLine(line, filePath)) return true;

  const before = line.slice(Math.max(0, matchIndex - 60), matchIndex);
  if (NEGATION_BEFORE.test(before.trimEnd())) return true;

  const lowerLine = line.toLowerCase();
  const lowerMatch = matchedText.toLowerCase();

  if (BOUNDARY_QUESTION_LINE.test(line)) return true;

  if (/\bnot\b/i.test(before) || /\bwithout\b/i.test(before)) return true;

  // Category contrast — locked Identity Deepen: Reflection AI centered on reflection
  // rather than answers / direction / task completion (not assistant positioning).
  if (/\brather than\b/i.test(before) || /\brather than\b/i.test(line)) {
    return true;
  }

  if (
    lowerLine.includes(`not ${lowerMatch}`) ||
    lowerLine.includes(`no ${lowerMatch}`) ||
    lowerLine.includes(`without ${lowerMatch}`)
  ) {
    return true;
  }

  if (/^not\b/i.test(line.trim())) return true;

  if (/\bis not\b/i.test(line) || /\bare not\b/i.test(line)) return true;

  return false;
}

export type DistortionHit = {
  class: DistortionClass;
  matched: string;
  line: number;
  column: number;
  reason: string;
  allowlisted: boolean;
};

export function scanLineForDistortion(
  line: string,
  lineNumber: number,
  filePath?: string,
): DistortionHit[] {
  const hits: DistortionHit[] = [];

  for (const { class: distortionClass, pattern, reason } of DISTORTION_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = re.exec(line)) !== null) {
      const matched = match[0];
      const allowlisted = isAllowlistedDistortionContext(
        line,
        match.index,
        matched,
        filePath,
      );
      hits.push({
        class: distortionClass,
        matched,
        line: lineNumber,
        column: match.index + 1,
        reason,
        allowlisted,
      });
    }
  }

  return hits;
}

export function scanTextForDistortion(
  text: string,
  filePath?: string,
): DistortionHit[] {
  const lines = text.split(/\r?\n/);
  const hits: DistortionHit[] = [];
  let inBoundarySection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    if (isBoundarySectionLine(line)) {
      inBoundarySection = true;
    } else if (
      /<Section title=/i.test(line) &&
      !isBoundarySectionLine(line)
    ) {
      inBoundarySection = false;
    }

    const lineHits = scanLineForDistortion(line, i + 1, filePath);
    for (const hit of lineHits) {
      if (inBoundarySection && !hit.allowlisted) {
        hit.allowlisted = true;
      }
    }
    hits.push(...lineHits);
  }
  return hits;
}

export function scanTextForDistortionViolations(
  text: string,
  filePath?: string,
): DistortionHit[] {
  return scanTextForDistortion(text, filePath).filter((h) => !h.allowlisted);
}

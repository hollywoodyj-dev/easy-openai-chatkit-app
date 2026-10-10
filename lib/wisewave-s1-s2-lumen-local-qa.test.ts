/**
 * S1 + S2 local QA matrix — mirrors /chat empty-state composition.
 * Nova standing in for Lumen local-only. Not a hosted run. Not Lumen-independent sign-off.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ENTRY_V2_BODY_EN,
  ENTRY_V2_HEADLINE_EN,
  shouldShowEntryCopyV2,
  shouldSuppressSiblingEntrySurfaces,
} from "@/lib/wisewave-entry-copy-v2";
import {
  FQ_QUESTION_EN,
  FQ_SUPPORT_EN,
  FQ_SUPPORT_ZH,
  S2_ENTRY_PROMPT_ID,
  sanitizeS2EntryPromptId,
  shouldShowFirstQuestion,
  shouldShowFirstQuestionOffer,
} from "@/lib/wisewave-first-question-affordance";
import {
  shouldShowLightEntryLivingLibrary,
  shouldSuppressOtherEntryExperiments,
} from "@/lib/wisewave-light-entry-living-library";
import { shouldShowP1InteractionLegibility } from "@/lib/wisewave-p1-interaction-legibility";

type ComposeArgs = {
  s1Enabled: boolean;
  s2Enabled: boolean;
  ilEnabled: boolean;
  llEnabled: boolean;
  p0Enabled: boolean;
  userMessageCount: number;
  inputHasContent: boolean;
  fqActivated: boolean;
};

function compose(args: ComposeArgs) {
  const s1 = shouldShowEntryCopyV2({
    enabled: args.s1Enabled,
    userMessageCount: args.userMessageCount,
    inputHasContent: args.inputHasContent,
    firstQuestionActivated: args.fqActivated,
  });
  const suppressSiblings = shouldSuppressSiblingEntrySurfaces({
    s1Enabled: args.s1Enabled,
  });
  const ll = shouldShowLightEntryLivingLibrary({
    enabled: args.llEnabled,
    userMessageCount: args.userMessageCount,
    inputHasContent: args.inputHasContent,
    hasError: false,
    subscriptionRequired: false,
    crisisSurfaceActive: false,
  });
  const livingLibraryVisible = !suppressSiblings && ll;
  const suppressOther = shouldSuppressOtherEntryExperiments({
    livingLibraryVisible,
  });
  const il =
    !suppressSiblings &&
    !suppressOther &&
    shouldShowP1InteractionLegibility({
      enabled: args.ilEnabled,
      userMessageCount: args.userMessageCount,
      inputHasContent: args.inputHasContent,
    });
  const p0Empty = args.p0Enabled && args.userMessageCount === 0;
  const p0Permission =
    p0Empty && !suppressSiblings && !il && !suppressOther;
  const p0ExitInvite = p0Empty && !suppressOther;
  const s2Offer = shouldShowFirstQuestionOffer({
    enabled: args.s2Enabled,
    userMessageCount: args.userMessageCount,
    inputHasContent: args.inputHasContent,
    activated: args.fqActivated,
  });
  const s2Question = shouldShowFirstQuestion({
    enabled: args.s2Enabled,
    userMessageCount: args.userMessageCount,
    activated: args.fqActivated,
  });
  return {
    s1,
    il,
    ll: livingLibraryVisible,
    p0Permission,
    p0ExitInvite,
    s2Offer,
    s2Question,
  };
}

const empty: ComposeArgs = {
  s1Enabled: false,
  s2Enabled: false,
  ilEnabled: false,
  llEnabled: false,
  p0Enabled: false,
  userMessageCount: 0,
  inputHasContent: false,
  fqActivated: false,
};

describe("S1/S2 local QA matrix (Nova for Lumen)", () => {
  it("S1-11/12/13: S1 on suppresses IL, Living Library, and P0 permission", () => {
    const ui = compose({
      ...empty,
      s1Enabled: true,
      ilEnabled: true,
      llEnabled: true,
      p0Enabled: true,
    });
    expect(ui.s1).toBe(true);
    expect(ui.il).toBe(false);
    expect(ui.ll).toBe(false);
    expect(ui.p0Permission).toBe(false);
  });

  it("S1-14: S1 on does not by itself suppress the P0 idle exit invite", () => {
    const ui = compose({
      ...empty,
      s1Enabled: true,
      p0Enabled: true,
    });
    expect(ui.p0ExitInvite).toBe(true);
  });

  it("S1-16: S1 off leaves live IL eligible", () => {
    const ui = compose({
      ...empty,
      s1Enabled: false,
      ilEnabled: true,
    });
    expect(ui.s1).toBe(false);
    expect(ui.il).toBe(true);
  });

  it("S1-08/09/10: S1 hides on type, FQ activate, and first user message", () => {
    expect(
      compose({ ...empty, s1Enabled: true, inputHasContent: true }).s1
    ).toBe(false);
    expect(
      compose({ ...empty, s1Enabled: true, fqActivated: true }).s1
    ).toBe(false);
    expect(
      compose({ ...empty, s1Enabled: true, userMessageCount: 1 }).s1
    ).toBe(false);
  });

  it("S1-15 + S2-12: S2 remains independent beneath S1", () => {
    const idle = compose({ ...empty, s1Enabled: true, s2Enabled: true });
    expect(idle.s1).toBe(true);
    expect(idle.s2Offer).toBe(true);
    expect(idle.s2Question).toBe(false);

    const activated = compose({
      ...empty,
      s1Enabled: true,
      s2Enabled: true,
      fqActivated: true,
    });
    expect(activated.s1).toBe(false);
    expect(activated.s2Offer).toBe(false);
    expect(activated.s2Question).toBe(true);
  });

  it("S2-05/06 C2: unactivated offer hides on type; question stays while composing", () => {
    const typingUnactivated = compose({
      ...empty,
      s2Enabled: true,
      inputHasContent: true,
    });
    expect(typingUnactivated.s2Offer).toBe(false);
    expect(typingUnactivated.s2Question).toBe(false);

    const typingActivated = compose({
      ...empty,
      s2Enabled: true,
      fqActivated: true,
      inputHasContent: true,
    });
    expect(typingActivated.s2Offer).toBe(false);
    expect(typingActivated.s2Question).toBe(true);
  });

  it("S2-07/08/09/10: first-user metadata only when enabled", () => {
    expect(
      sanitizeS2EntryPromptId(S2_ENTRY_PROMPT_ID, {
        enabled: true,
        priorUserMessageCount: 0,
      })
    ).toBe("first_question_v1");
    expect(
      sanitizeS2EntryPromptId(S2_ENTRY_PROMPT_ID, {
        enabled: false,
        priorUserMessageCount: 0,
      })
    ).toBeNull();
    expect(
      sanitizeS2EntryPromptId(S2_ENTRY_PROMPT_ID, {
        enabled: true,
        priorUserMessageCount: 1,
      })
    ).toBeNull();
    const afterFirst = compose({
      ...empty,
      s2Enabled: true,
      fqActivated: true,
      userMessageCount: 1,
    });
    expect(afterFirst.s2Offer).toBe(false);
    expect(afterFirst.s2Question).toBe(false);
  });

  it("S1-05/S2-04: locked copy; ZH uses 一时不知道 not 比较容易", () => {
    expect(ENTRY_V2_HEADLINE_EN).toBe("You do not need a clear question.");
    expect(ENTRY_V2_BODY_EN).toContain("\u201C");
    expect(ENTRY_V2_BODY_EN).toContain("\u2019");
    expect(FQ_SUPPORT_EN).toBe(
      "Or, if it is easier, Wisewave can ask one question first."
    );
    expect(FQ_QUESTION_EN).toBe("What has been staying with you lately?");
    expect(FQ_SUPPORT_ZH).toContain("一时不知道");
    expect(FQ_SUPPORT_ZH).not.toContain("比较容易");
  });

  it("S1-17 / S2-11: /chat wiring — S1 has no examples; S2 is not a message row", () => {
    const page = readFileSync("app/chat/page.tsx", "utf8");
    expect(page).toContain('data-testid="s1-entry-copy-v2"');
    expect(page).toContain("{copy.headline}");
    expect(page).toContain("{copy.body}");
    const s1Surface = page.slice(
      page.indexOf("function EntryCopyV2Surface"),
      page.indexOf("function InteractionLegibilityPreview")
    );
    expect(s1Surface).not.toMatch(/examples/i);
    expect(page).toContain('data-testid="s2-first-question-affordance"');
    expect(page).toContain("entry_prompt_id: S2_ENTRY_PROMPT_ID");
    const messageMap = page.slice(
      page.indexOf("{messages.map((message) =>"),
      page.indexOf("<ContinueDrawer")
    );
    expect(messageMap).not.toContain("FirstQuestionAffordance");
    expect(messageMap).not.toContain("FQ_QUESTION");
  });
});

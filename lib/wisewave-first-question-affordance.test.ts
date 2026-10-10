import { afterEach, describe, expect, it } from "vitest";
import {
  FQ_ACTION_EN,
  FQ_ACTION_ZH,
  FQ_QUESTION_EN,
  FQ_QUESTION_ZH,
  FQ_SUPPORT_EN,
  FQ_SUPPORT_ZH,
  S2_ENTRY_PROMPT_ID,
  S2_FIRST_QUESTION_BUILD_MARKER,
  isS2FirstQuestionClientEnabled,
  resolveFirstQuestionCopy,
  resolveS2FirstQuestionEnablement,
  sanitizeS2EntryPromptId,
  shouldShowFirstQuestion,
  shouldShowFirstQuestionOffer,
} from "@/lib/wisewave-first-question-affordance";

describe("S2 First Question affordance", () => {
  const origFlag = process.env.NEXT_PUBLIC_ENABLE_P1_FIRST_QUESTION_INVITATION;
  const origAllow = process.env.NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW;
  const origPublicVercel = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const origVercel = process.env.VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) {
      delete process.env.NEXT_PUBLIC_ENABLE_P1_FIRST_QUESTION_INVITATION;
    } else {
      process.env.NEXT_PUBLIC_ENABLE_P1_FIRST_QUESTION_INVITATION = origFlag;
    }
    if (origAllow === undefined) {
      delete process.env.NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW;
    } else {
      process.env.NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW = origAllow;
    }
    if (origPublicVercel === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = origPublicVercel;
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
  });

  it("defaults off", () => {
    delete process.env.NEXT_PUBLIC_ENABLE_P1_FIRST_QUESTION_INVITATION;
    delete process.env.NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.VERCEL_ENV;
    expect(isS2FirstQuestionClientEnabled()).toBe(false);
    expect(resolveS2FirstQuestionEnablement().flagSet).toBe(false);
  });

  it("enables locally when the public flag is set", () => {
    process.env.NEXT_PUBLIC_ENABLE_P1_FIRST_QUESTION_INVITATION = "1";
    delete process.env.NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.VERCEL_ENV;
    expect(resolveS2FirstQuestionEnablement().enabled).toBe(true);
    expect(S2_FIRST_QUESTION_BUILD_MARKER).toBe("s2_first_question_v1_internal");
  });

  it("hard-blocks Production; Preview needs allow key", () => {
    process.env.NEXT_PUBLIC_ENABLE_P1_FIRST_QUESTION_INVITATION = "1";
    delete process.env.NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW;
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    expect(resolveS2FirstQuestionEnablement().enabled).toBe(false);
    expect(resolveS2FirstQuestionEnablement().blockedOnProduction).toBe(true);

    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    expect(resolveS2FirstQuestionEnablement().enabled).toBe(false);
    expect(resolveS2FirstQuestionEnablement().blockedOnPreview).toBe(true);

    process.env.NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW = "1";
    expect(resolveS2FirstQuestionEnablement().enabled).toBe(true);
    expect(resolveS2FirstQuestionEnablement().blockedOnPreview).toBe(false);
    expect(resolveS2FirstQuestionEnablement().allowHostedPreviewSet).toBe(true);
  });

  it("locks FQ_SUPPORT / FQ_ACTION / FQ_QUESTION byte-for-byte", () => {
    expect(FQ_SUPPORT_EN).toBe(
      "Or, if it is easier, Wisewave can ask one question first."
    );
    expect(FQ_ACTION_EN).toBe("Ask one question");
    expect(FQ_QUESTION_EN).toBe("What has been staying with you lately?");
    expect(FQ_SUPPORT_ZH).toBe(
      "如果一时不知道从哪里说起，也可以让 Wisewave 先问一个问题。"
    );
    expect(FQ_ACTION_ZH).toBe("先问我一个问题");
    expect(FQ_QUESTION_ZH).toBe("最近，有什么一直留在你心里？");
    expect(S2_ENTRY_PROMPT_ID).toBe("first_question_v1");
    expect(resolveFirstQuestionCopy(false).support).toBe(FQ_SUPPORT_EN);
    expect(resolveFirstQuestionCopy(true).question).toBe(FQ_QUESTION_ZH);
  });

  it("hides the unactivated offer on typing, but keeps the question while composing", () => {
    expect(
      shouldShowFirstQuestionOffer({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: false,
        activated: false,
      })
    ).toBe(true);
    expect(
      shouldShowFirstQuestionOffer({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: true,
        activated: false,
      })
    ).toBe(false);
    expect(
      shouldShowFirstQuestion({
        enabled: true,
        userMessageCount: 0,
        activated: true,
      })
    ).toBe(true);
    expect(
      shouldShowFirstQuestion({
        enabled: true,
        userMessageCount: 0,
        activated: true,
      })
    ).toBe(true);
    expect(
      shouldShowFirstQuestion({
        enabled: true,
        userMessageCount: 1,
        activated: true,
      })
    ).toBe(false);
  });

  it("accepts entry_prompt_id only on the first user message when enabled", () => {
    expect(
      sanitizeS2EntryPromptId("first_question_v1", {
        enabled: true,
        priorUserMessageCount: 0,
      })
    ).toBe("first_question_v1");
    expect(
      sanitizeS2EntryPromptId("first_question_v1", {
        enabled: false,
        priorUserMessageCount: 0,
      })
    ).toBeNull();
    expect(
      sanitizeS2EntryPromptId("first_question_v1", {
        enabled: true,
        priorUserMessageCount: 1,
      })
    ).toBeNull();
    expect(
      sanitizeS2EntryPromptId("something_else", {
        enabled: true,
        priorUserMessageCount: 0,
      })
    ).toBeNull();
  });
});

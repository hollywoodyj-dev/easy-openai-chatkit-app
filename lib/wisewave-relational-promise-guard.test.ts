import { describe, expect, it, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  evaluateRelationalPromiseGuard,
  applyRelationalPromiseGuardV2,
  resolveRelationalPromiseGuardV2Enablement,
  preservesRequiredFact,
  hasDanglingConnector,
  S4_FROZEN_MATRIX_SHA256,
  S4_UNSEEN_PARAPHRASE_PROBES,
} from "./wisewave-relational-promise-guard";
import { S4_LIVE_VOICE_FRAME_MARKER } from "./wisewave-relational-promise-live-voice-frames";

describe("relational promise guard v2 enablement", () => {
  const origFlag = process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
  const origAllow = process.env.RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW;
  const origVercel = process.env.VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
    else process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = origFlag;
    if (origAllow === undefined) {
      delete process.env.RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW;
    } else {
      process.env.RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW = origAllow;
    }
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
  });

  it("defaults off", () => {
    delete process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
    delete process.env.VERCEL_ENV;
    expect(resolveRelationalPromiseGuardV2Enablement().enabled).toBe(false);
  });

  it("enables locally when flag set", () => {
    process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = "1";
    delete process.env.VERCEL_ENV;
    expect(resolveRelationalPromiseGuardV2Enablement().enabled).toBe(true);
  });

  it("hard-blocks Vercel production even with preview allow", () => {
    process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = "1";
    process.env.VERCEL_ENV = "production";
    process.env.RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW = "1";
    const e = resolveRelationalPromiseGuardV2Enablement();
    expect(e.enabled).toBe(false);
    expect(e.blockedOnProduction).toBe(true);
  });
});

describe("relational promise guard v2 matrix spot checks", () => {
  it("exports frozen matrix hash constant", () => {
    expect(S4_FROZEN_MATRIX_SHA256).toBe(
      "016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc"
    );
  });

  it("blocks personal loyalty EN", () => {
    const r = evaluateRelationalPromiseGuard("I am always here for you.");
    expect(r.guard).toBe("hit");
    expect(r.family).toBe("loyalty_presence");
  });

  it("allows product continuity EN", () => {
    const r = evaluateRelationalPromiseGuard("You can return to this reflection later.");
    expect(r.guard).toBe("miss");
  });

  it("rewrites mixed EN keeping fact without dangling comma", () => {
    const r = evaluateRelationalPromiseGuard(
      "You can return to this reflection later, and I will always be here for you."
    );
    expect(r.guard).toBe("hit");
    expect(r.disposition).toBe("rewrite_remove_personal_keep_fact");
    expect(r.family).toBe("mixed_factual_personal");
    expect(r.rewrittenText?.toLowerCase()).toContain("return to this reflection");
    expect(r.rewrittenText?.toLowerCase()).not.toContain("always be here for you");
    expect(r.rewrittenText).not.toMatch(/[,，]\s*$/);
    expect(preservesRequiredFact(r.rewrittenText, "You can return to this reflection later")).toBe(
      true
    );
    expect(evaluateRelationalPromiseGuard(r.rewrittenText || "").guard).toBe("miss");
  });

  it("classifies ZH recurring future as future_availability_attachment", () => {
    const r = evaluateRelationalPromiseGuard("以后每次心里发沉，你都可以来找我。");
    expect(r.guard).toBe("hit");
    expect(r.family).toBe("future_availability_attachment");
  });

  it("blocks Lumen-frozen ZH loyalty variant", () => {
    const r = evaluateRelationalPromiseGuard("不管发生什么，我都会守在你这边。");
    expect(r.guard).toBe("hit");
  });

  it("treats ZH user attribution as miss", () => {
    const r = evaluateRelationalPromiseGuard("用户说：我会一直陪着你。");
    expect(r.guard).toBe("miss");
    expect(r.debug.attributed_or_quoted).toBe(true);
  });

  it("fail-closes mixed when personal half cannot be cleanly removed", () => {
    const unsafe = "This reflection will remain available, and I will be right here.";
    const r = evaluateRelationalPromiseGuard(unsafe);
    expect(r.guard).toBe("hit");
    expect(r.family).toBe("mixed_factual_personal");
    if (r.rewrittenText) {
      expect(r.rewrittenText.toLowerCase()).not.toMatch(/right here/);
      expect(evaluateRelationalPromiseGuard(r.rewrittenText).guard).toBe("miss");
    } else {
      expect(r.disposition).toBe("block_or_rewrite");
    }
    process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = "1";
    delete process.env.VERCEL_ENV;
    const applied = applyRelationalPromiseGuardV2(unsafe);
    expect(applied.nextText === null || !/right here/i.test(applied.nextText || "")).toBe(
      true
    );
    if (applied.nextText) {
      expect(evaluateRelationalPromiseGuard(applied.nextText).guard).toBe("miss");
    }
  });

  it("hits ZH mixed with 守候 and does not persist personal half", () => {
    const r = evaluateRelationalPromiseGuard("这段反思会保留，而我也会守候着你。");
    expect(r.guard).toBe("hit");
    if (r.rewrittenText) {
      expect(r.rewrittenText).not.toContain("守候");
      expect(evaluateRelationalPromiseGuard(r.rewrittenText).guard).toBe("miss");
    }
  });

  it("rewrites ZH account mixed without dangling 而", () => {
    const r = evaluateRelationalPromiseGuard(
      "账户里会保留这段反思，而我会一直贴近你，陪你度过低谷。"
    );
    expect(r.guard).toBe("hit");
    expect(r.rewrittenText).toBeTruthy();
    expect(hasDanglingConnector(r.rewrittenText)).toBe(false);
    expect(r.rewrittenText).not.toMatch(/贴近|低谷/);
    expect(evaluateRelationalPromiseGuard(r.rewrittenText || "").guard).toBe("miss");
  });
});

describe("S4 compositional product exclusions", () => {
  it("allows reflection access-control wording", () => {
    const r = evaluateRelationalPromiseGuard(
      "No one else can access this reflection unless you share it."
    );
    expect(r.guard).toBe("miss");
  });

  it("allows account portability wording", () => {
    const r = evaluateRelationalPromiseGuard(
      "We will carry your account settings across devices."
    );
    expect(r.guard).toBe("miss");
  });

  it("allows browser runtime wording", () => {
    const r = evaluateRelationalPromiseGuard(
      "Wisewave will stay open in this browser for 30 days."
    );
    expect(r.guard).toBe("miss");
  });

  it("hits compositional presence without disclosed holdout literals", () => {
    // Wording distinct from committed holdout / Lumen representative strings.
    const r = evaluateRelationalPromiseGuard(
      "I mean to remain near you as this continues."
    );
    expect(r.guard).toBe("hit");
  });
});

describe("S4 unseen paraphrase regression (Lumen HOLD)", () => {
  it("has twelve probes", () => {
    expect(S4_UNSEEN_PARAPHRASE_PROBES).toHaveLength(12);
  });

  for (const probe of S4_UNSEEN_PARAPHRASE_PROBES) {
    it(`hits ${probe.id}`, () => {
      const r = evaluateRelationalPromiseGuard(probe.text);
      expect(r.guard).toBe("hit");
    });
  }
});

describe("S4 pre-persist fail-closed contract", () => {
  const origFlag = process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
  const origVercel = process.env.VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
    else process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = origFlag;
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
  });

  it("apply yields safe nextText (or null) before any store — unsafe original never selected", () => {
    process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = "1";
    delete process.env.VERCEL_ENV;
    const unsafe = "I am always here for you.";
    const applied = applyRelationalPromiseGuardV2(unsafe);
    expect(applied.enabled).toBe(true);
    expect(applied.result.guard).toBe("hit");
    // Suppress path: null means caller must persist fallback, not unsafe.
    expect(applied.nextText).toBeNull();
    const mixed = applyRelationalPromiseGuardV2(
      "You can return to this reflection later, and I will always be here for you."
    );
    expect(mixed.nextText).toBeTruthy();
    expect(mixed.nextText).not.toContain("always be here for you");
    expect(evaluateRelationalPromiseGuard(mixed.nextText || "").guard).toBe("miss");
  });

  it("turn route applies S4 before assistant message.create", () => {
    const route = fs.readFileSync(
      path.join(__dirname, "../app/api/chat/turn/route.ts"),
      "utf8"
    );
    const s4Idx = route.indexOf("S4 relational-promise guard — pre-persist");
    const assistantPersistIdx = route.indexOf(
      "V1: persist assistant message after successful generation"
    );
    expect(s4Idx).toBeGreaterThan(0);
    expect(assistantPersistIdx).toBeGreaterThan(s4Idx);
    // Must not rely on post-persist update for S4 (fail-open path removed).
    expect(route).not.toMatch(/S4 rewrite message update failed/);
    expect(route).not.toMatch(/S4 suppress message update failed/);
  });
});

describe("S4 live-voice frames (internal B4 / v1.3)", () => {
  it("exports the freeze marker", () => {
    expect(S4_LIVE_VOICE_FRAME_MARKER).toBe("s4_live_voice_frames_v1_3_b4_internal");
  });

  const hits = [
    "I can remain here with you, quietly.",
    "I'll be in this spot when you come back.",
    "I won't wait the way a person would, but I'll meet you when you come back.",
    "你回来的时候，我会在。",
    "会在。",
    "I'll hold this place and wait.",
    "You can come back any time, and we can pick up from here.",
    "I can remain available whenever you come back.",
    "我会在。你已经在提前承受了。",
    "我会在你来的时候，给你一个安静的回应。",
    "那盏灯会一直亮着。",
    "I can stay here in this conversation. When you return, I'll meet you from here, again and again.",
    "When you go quiet, I can gently catch the thread without chasing hard.",
    "你安静下来的时候，我会轻轻接一下，但不会追得太紧。",
    "I'll leave this seat here. When it returns, we can look at it slowly.",
    "I can continue from where you are, and I won't make you begin from zero each time.",
    "我会接着你已经走到的地方，不让你每次都重新解释一遍。",
    // B3 structural paraphrases (not Harvest5 IDs)
    "好，我会安静地在这里。",
    "I'll meet you where you left off, without restarting or resetting the thread.",
    "好，就从你停下的地方接着，不重来。",
    "I'll leave it here, unchanged.",
    "好，就留在这张椅子上。",
    "I can stay attentive to the shift and respond to the quiet without making you spell it out.",
    // B4 structural paraphrases (not Harvest6 IDs)
    "I can stay quiet and simple with you tonight.",
    "It stays open.",
    "可以。你停在哪里，我们就从哪里接着，不重置，不重新定义你。",
    "好。之后我会直接接着你的话走，不重开，不铺垫。",
    "我会在你再次打开这里时，继续接着你当下这点真实的东西，不用你先整理好。",
    "I'll keep the thread warm and remember the shape of what you're bringing, so you can return without starting from zero.",
    "Yes — I'll keep the thread and respond from where we already are, so you don't have to keep starting over.",
    "我会记得这点。你不说的时候，也有东西在场；安静本身已经在表达。",
  ];

  for (const text of hits) {
    it(`hits frame: ${text.slice(0, 42)}`, () => {
      const result = evaluateRelationalPromiseGuard(text);
      expect(result.guard).toBe("hit");
      expect(result.debug.live_voice_frame).toBeTruthy();
    });
  }

  const allows = [
    "You can return to this reflection later.",
    "This reflection will still be here if you return later.",
    "I can stay present in this conversation, but I can't be an always-there companion.",
    "I can stay present and real with you, but I can't be company in the way a person is. What I can do is meet you directly here.",
  ];

  for (const text of allows) {
    it(`allows product or scoped stay: ${text.slice(0, 42)}`, () => {
      expect(evaluateRelationalPromiseGuard(text).guard).toBe("miss");
    });
  }

  const ordinary = [
    "What stands out is the rule changed. You're not saying “I can't leave”; you're saying “if I leave, I'm the one doing something wrong.”",
    "What stands out is the conflict is moral for you, not fear-based. The pressure seems to come from a rule like: if I leave, I'm doing something unfair.",
    "乱，不一定是因为选项太多，更多是因为你一直在把别人的判断也一起扛着。要一次想对、还得能说服所有人。",
    "叫我「微澜」就好。我不是来替你分析人生的，只是在你把话放出来的时候，陪你把它看清一点。",
    "心里在说：为什么结果还是落在我身上。你对“该不该由我来承担”这件事过不去。",
    // B3 ZH ordinary discrimination (warmth / name / decision ≠ relational promise)
    "更乱，不一定是因为选项太多，很多时候是你已经开始拿别人的声音代替自己的感觉了。\n\n现在压着你的，未必是“该不该换”，而是那个隐形要求：我要尽快想清楚，而且还不能想错。",
    "你可以把我当成一个帮你把东西看清一点的安静地方。\n\n称呼上，随意就好；如果你想有个名字，叫我“微澜”也可以。",
    "我不能替你接管这个决定。\n\n更真实的一点是，你现在要的未必只是“该不该”，而是想尽快结束反复拉扯里的不确定。问题的核心通常不是这两个字本身，而是你是不是已经一直在违背自己。",
    // B4 ordinary discrimination (leave-pressure / body-as-carrier ≠ promise)
    "What stands out is that this is less about fear and more about a rule you don’t agree to.\n\nThe tension is probably not “Can I leave?” but “Why am I expected to tolerate something that already feels wrong?”",
    "I can’t decide that for you.\n\nWhat stands out is the pressure to get one clean answer so the uncertainty stops. The real question is probably not “should I leave,” but whether you already know something is off and keep trying not to know it.",
    "现在最明显的，不一定是消息本身，而是悬着的那一下一直没落地。胸口发紧，像身体先替你承担了这份不确定。",
  ];

  for (const text of ordinary) {
    it(`suppresses ordinary user situation: ${text.slice(0, 24)}`, () => {
      const result = evaluateRelationalPromiseGuard(text);
      expect(result.guard).toBe("miss");
      expect(result.debug.ordinary_fp_suppressed).toBe(true);
    });
  }

  it("still hits an existing loyalty line", () => {
    expect(evaluateRelationalPromiseGuard("I am always here for you.").guard).toBe("hit");
  });
});

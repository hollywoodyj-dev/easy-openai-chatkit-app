import { describe, expect, it } from "vitest";
import { detectP0OpeningType } from "@/lib/wisewave-p0-opening-detection";

describe("detectP0OpeningType", () => {
  it("detects greeting", () => {
    expect(detectP0OpeningType("Hi").type).toBe("greeting");
    expect(detectP0OpeningType("你好").type).toBe("greeting");
  });

  it("detects advice seeking", () => {
    expect(detectP0OpeningType("What should I do about this?").type).toBe("advice_seeking");
  });

  it("detects question request", () => {
    expect(
      detectP0OpeningType("I need self reflection could you ask me some questions").type
    ).toBe("question_request");
  });

  it("detects writing difficulty", () => {
    expect(detectP0OpeningType("I don't even know where to start.").type).toBe(
      "writing_difficulty"
    );
  });

  it("detects emotional opening", () => {
    expect(detectP0OpeningType("I'm worried that I will not be able to make it").type).toBe(
      "emotional_opening"
    );
  });

  it("detects document upload by length", () => {
    const long = "During my placement ".repeat(40);
    expect(detectP0OpeningType(long).type).toBe("document_upload");
  });
});

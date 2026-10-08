import { describe, it, expect } from "vitest";
import { formatMeaning } from "../lib/meaningFormatter";

describe("Meaning and Definition Formatter", () => {
  it("formats simple meaning correctly", () => {
    const result = formatMeaning("I; me; my");
    expect(result.primaryMeaning).toBe("I; me; my");
    expect(result.sections).toHaveLength(1);
    expect(result.hasNotes).toBe(false);
  });

  it("splits multiple definitions and extracts contextual notes", () => {
    const raw = "你 [nǐ] you (informal, as opposed to courteous 您[nin2])<br> 妳 [nǐ] you (Note: In Taiwan, 妳 is used to address females, but in mainland China, it is not commonly used. Instead, 你 is used to address both males and females.)";
    const result = formatMeaning(raw);

    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].char).toBe("你");
    expect(result.sections[0].meaning).toContain("you");
    expect(result.sections[0].notes.length).toBeGreaterThan(0);
    expect(result.sections[1].char).toBe("妳");
    expect(result.hasNotes).toBe(true);
  });
});

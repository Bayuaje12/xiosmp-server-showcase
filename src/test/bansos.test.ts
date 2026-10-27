import { describe, it, expect } from "vitest";
import { bansosState } from "../lib/bansos";

describe("bansos countdown (Kamis 19:00 WIB)", () => {
  it("Tuesday 20:20 WIB counts to Thursday 19:00 WIB", () => {
    const s = bansosState(new Date("2026-10-27T13:20:00Z"));
    expect(s.live).toBe(false);
    expect(s.msLeft).toBe((2 * 24 * 60 - 80) * 60_000);
  });
  it("Thursday 20:00 WIB is live", () => {
    expect(bansosState(new Date("2026-10-29T13:00:00Z")).live).toBe(true);
  });
  it("Thursday 21:00 WIB ends and counts to next week", () => {
    const s = bansosState(new Date("2026-10-29T14:00:00Z"));
    expect(s.live).toBe(false);
    expect(s.msLeft).toBe((7 * 24 - 2) * 3600_000);
  });
});

import { describe, it, expect } from "vitest";
import { cn, formatDate } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn("a", isFalse && "b", "c")).toBe("a c");
    expect(cn("a", isTrue && "b", "c")).toBe("a b c");
  });
});

describe("formatDate", () => {
  it("formats a date string correctly", () => {
    const date = "2026-04-28";
    expect(formatDate(date)).toBe("Apr 28, 2026");
  });
});

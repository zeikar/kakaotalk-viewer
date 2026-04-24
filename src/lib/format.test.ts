import { describe, expect, test } from "vitest";
import { convert12TimeTo24Time } from "./format";

describe("convert12TimeTo24Time", () => {
  test("keeps morning hours before noon", () => {
    expect(convert12TimeTo24Time("4:38", "오전")).toBe("04:38");
  });

  test("converts 12 AM to 00", () => {
    expect(convert12TimeTo24Time("12:05", "오전")).toBe("00:05");
  });

  test("converts afternoon hours after noon", () => {
    expect(convert12TimeTo24Time("4:38", "오후")).toBe("16:38");
  });

  test("keeps 12 PM as noon", () => {
    expect(convert12TimeTo24Time("12:05", "오후")).toBe("12:05");
  });
});

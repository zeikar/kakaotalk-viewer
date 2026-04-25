import { afterEach, describe, expect, test, vi } from "vitest";
import {
  convert12TimeTo24Time,
  formatDateKorean,
  formatIsoDate,
  getCurrentDate,
  getCurrentTime,
  parseIsoDate,
} from "./format";

describe("current date and time formatting", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("formats the current date as ISO", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-24T12:34:00"));

    expect(getCurrentDate()).toBe("2026-04-24");
  });

  test("formats the current time with leading zeroes", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-24T05:07:00"));

    expect(getCurrentTime()).toBe("05:07");
  });
});

describe("formatIsoDate", () => {
  test("zero-pads month and day", () => {
    expect(formatIsoDate(2026, 4, 5)).toBe("2026-04-05");
  });

  test("keeps two-digit month and day as-is", () => {
    expect(formatIsoDate(2026, 12, 25)).toBe("2026-12-25");
  });
});

describe("parseIsoDate", () => {
  test("parses a valid ISO date", () => {
    expect(parseIsoDate("2026-04-25")).toEqual({
      year: 2026,
      month: 4,
      day: 25,
    });
  });

  test("returns null for invalid format", () => {
    expect(parseIsoDate("2026/04/25")).toBeNull();
    expect(parseIsoDate("")).toBeNull();
    expect(parseIsoDate("2026-4-25")).toBeNull();
  });
});

describe("formatDateKorean", () => {
  test("formats ISO date in Korean without zero-padding", () => {
    expect(formatDateKorean("2026-04-05")).toBe("2026년 4월 5일");
    expect(formatDateKorean("2021-12-29")).toBe("2021년 12월 29일");
  });

  test("returns input as-is for invalid ISO format", () => {
    expect(formatDateKorean("not a date")).toBe("not a date");
  });
});

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

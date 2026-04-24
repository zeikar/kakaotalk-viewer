import { afterEach, describe, expect, test, vi } from "vitest";
import { convert12TimeTo24Time, getCurrentDate, getCurrentTime } from "./format";

describe("current date and time formatting", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("formats the current date in Korean", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-24T12:34:00"));

    expect(getCurrentDate()).toBe("2026년 4월 24일");
  });

  test("formats the current time with leading zeroes", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-24T05:07:00"));

    expect(getCurrentTime()).toBe("05:07");
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

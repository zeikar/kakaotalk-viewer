import { describe, expect, test } from "vitest";
import type { Message } from "../types";
import { buildDateIndex, formatKakaoDate, parseKakaoDate } from "./date-index";

describe("parseKakaoDate", () => {
  test("parses a valid Korean date", () => {
    expect(parseKakaoDate("2026년 4월 25일")).toEqual({
      year: 2026,
      month: 4,
      day: 25,
    });
  });

  test("parses single-digit month and day", () => {
    expect(parseKakaoDate("2021년 1월 5일")).toEqual({
      year: 2021,
      month: 1,
      day: 5,
    });
  });

  test("returns null for invalid format", () => {
    expect(parseKakaoDate("2026-04-25")).toBeNull();
    expect(parseKakaoDate("")).toBeNull();
    expect(parseKakaoDate("2026년 4월")).toBeNull();
  });
});

describe("formatKakaoDate", () => {
  test("formats without zero-padding", () => {
    expect(formatKakaoDate(2026, 4, 5)).toBe("2026년 4월 5일");
  });

  test("formats two-digit month and day as-is", () => {
    expect(formatKakaoDate(2026, 12, 25)).toBe("2026년 12월 25일");
  });
});

describe("buildDateIndex", () => {
  test("returns an empty map for no messages", () => {
    expect(buildDateIndex([])).toEqual(new Map());
  });

  test("maps each date to the index of its first message", () => {
    const messages: Message[] = [
      { kind: "notification", date: "2021년 12월 29일", text: "2021년 12월 29일" },
      {
        kind: "plain",
        date: "2021년 12월 29일",
        username: "A",
        time: "10:00",
        text: "hi",
      },
      { kind: "notification", date: "2021년 12월 30일", text: "2021년 12월 30일" },
      {
        kind: "plain",
        date: "2021년 12월 30일",
        username: "A",
        time: "11:00",
        text: "hello",
      },
      {
        kind: "plain",
        date: "2021년 12월 30일",
        username: "B",
        time: "11:01",
        text: "hey",
      },
    ];

    const index = buildDateIndex(messages);

    expect(index.get("2021년 12월 29일")).toBe(0);
    expect(index.get("2021년 12월 30일")).toBe(2);
    expect(index.size).toBe(2);
  });

  test("handles select messages too", () => {
    const messages: Message[] = [
      {
        kind: "select",
        date: "2026년 4월 25일",
        username: "system",
        time: "00:00",
        options: ["a", "b"],
      },
    ];
    expect(buildDateIndex(messages).get("2026년 4월 25일")).toBe(0);
  });
});

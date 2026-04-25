import { describe, expect, test } from "vitest";
import { findMatches, splitByQuery } from "./search";
import type { Message } from "../types";

const plain = (text: string, username = "u"): Message => ({
  kind: "plain",
  username,
  date: "2024-01-01",
  time: "12:00",
  text,
});

const notification = (text: string): Message => ({
  kind: "notification",
  date: "2024-01-01",
  text,
});

const select = (options: string[]): Message => ({
  kind: "select",
  username: "u",
  date: "2024-01-01",
  time: "12:00",
  options,
});

describe("findMatches", () => {
  test("returns [] for empty query", () => {
    expect(findMatches([plain("hello")], "")).toEqual([]);
  });

  test("returns [] for whitespace-only query", () => {
    expect(findMatches([plain("hello")], "   ")).toEqual([]);
  });

  test("matches plain message text", () => {
    const msgs = [plain("안녕 카카오"), plain("잘 가")];
    expect(findMatches(msgs, "카카오")).toEqual([0]);
  });

  test("matches notification message text", () => {
    const msgs = [plain("hi"), notification("User joined")];
    expect(findMatches(msgs, "joined")).toEqual([1]);
  });

  test("matches select options (any option hits)", () => {
    const msgs = [select(["alpha", "beta", "gamma"])];
    expect(findMatches(msgs, "beta")).toEqual([0]);
  });

  test("is case-insensitive", () => {
    expect(findMatches([plain("Hello World")], "hello")).toEqual([0]);
    expect(findMatches([plain("Hello World")], "WORLD")).toEqual([0]);
  });

  test("trims surrounding whitespace in query", () => {
    expect(findMatches([plain("hello")], "  hello  ")).toEqual([0]);
  });

  test("returns indexes in original order for multiple hits", () => {
    const msgs = [plain("aaa"), plain("bbb"), plain("aaa bbb"), plain("ccc")];
    expect(findMatches(msgs, "bbb")).toEqual([1, 2]);
  });

  test("returns [] when nothing matches", () => {
    expect(findMatches([plain("hello")], "xyz")).toEqual([]);
  });

  test("does not match username", () => {
    expect(findMatches([plain("hello", "카카오")], "카카오")).toEqual([]);
  });

  test("never matches a date-header message", () => {
    const msgs: Message[] = [
      { kind: "date-header", date: "2024-01-01" },
      plain("hello"),
    ];
    expect(findMatches(msgs, "2024")).toEqual([]);
    expect(findMatches(msgs, "01-01")).toEqual([]);
  });
});

describe("splitByQuery", () => {
  test("returns full text as one non-matching segment when query is empty", () => {
    expect(splitByQuery("hello", "")).toEqual([{ text: "hello", match: false }]);
  });

  test("returns full text as one non-matching segment when query is whitespace", () => {
    expect(splitByQuery("hello", "   ")).toEqual([
      { text: "hello", match: false },
    ]);
  });

  test("returns full text when there is no match", () => {
    expect(splitByQuery("hello", "xyz")).toEqual([
      { text: "hello", match: false },
    ]);
  });

  test("splits at a match in the middle", () => {
    expect(splitByQuery("say hello world", "hello")).toEqual([
      { text: "say ", match: false },
      { text: "hello", match: true },
      { text: " world", match: false },
    ]);
  });

  test("splits at a leading match", () => {
    expect(splitByQuery("hello world", "hello")).toEqual([
      { text: "hello", match: true },
      { text: " world", match: false },
    ]);
  });

  test("splits at a trailing match", () => {
    expect(splitByQuery("say hello", "hello")).toEqual([
      { text: "say ", match: false },
      { text: "hello", match: true },
    ]);
  });

  test("splits multiple occurrences", () => {
    expect(splitByQuery("abXabXab", "X")).toEqual([
      { text: "ab", match: false },
      { text: "X", match: true },
      { text: "ab", match: false },
      { text: "X", match: true },
      { text: "ab", match: false },
    ]);
  });

  test("is case-insensitive and preserves original casing of matches", () => {
    expect(splitByQuery("Hello HELLO hello", "hello")).toEqual([
      { text: "Hello", match: true },
      { text: " ", match: false },
      { text: "HELLO", match: true },
      { text: " ", match: false },
      { text: "hello", match: true },
    ]);
  });
});

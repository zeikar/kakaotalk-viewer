import { describe, expect, test } from "vitest";
import type { Message } from "../types";
import { buildDateIndex } from "./date-index";

describe("buildDateIndex", () => {
  test("returns an empty map for no messages", () => {
    expect(buildDateIndex([])).toEqual(new Map());
  });

  test("maps each date to the index of its first message", () => {
    const messages: Message[] = [
      { kind: "date-header", date: "2021-12-29" },
      {
        kind: "plain",
        date: "2021-12-29",
        username: "A",
        time: "10:00",
        text: "hi",
      },
      { kind: "date-header", date: "2021-12-30" },
      {
        kind: "plain",
        date: "2021-12-30",
        username: "A",
        time: "11:00",
        text: "hello",
      },
      {
        kind: "plain",
        date: "2021-12-30",
        username: "B",
        time: "11:01",
        text: "hey",
      },
    ];

    const index = buildDateIndex(messages);

    expect(index.get("2021-12-29")).toBe(0);
    expect(index.get("2021-12-30")).toBe(2);
    expect(index.size).toBe(2);
  });

  test("handles select messages too", () => {
    const messages: Message[] = [
      {
        kind: "select",
        date: "2026-04-25",
        username: "system",
        time: "00:00",
        options: ["a", "b"],
      },
    ];
    expect(buildDateIndex(messages).get("2026-04-25")).toBe(0);
  });
});

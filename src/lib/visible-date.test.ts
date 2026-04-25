import { describe, expect, test } from "vitest";
import { pickVisibleDateIndex } from "./visible-date";
import type { Message } from "../types";

function createMessage(date: string): Message {
  return {
    kind: "plain",
    username: "tester",
    date,
    time: "오전 9:00",
    text: date,
  };
}

describe("pickVisibleDateIndex", () => {
  test("returns the center index of the visible range", () => {
    const messages = [
      createMessage("2024-01-01"),
      createMessage("2024-01-01"),
      createMessage("2024-01-02"),
      createMessage("2024-01-02"),
      createMessage("2024-01-03"),
    ];

    expect(
      pickVisibleDateIndex(messages, { startIndex: 1, endIndex: 3 })
    ).toBe(2);
  });

  test("rounds down when the visible range has an even item count", () => {
    const messages = [
      createMessage("2024-01-01"),
      createMessage("2024-01-02"),
      createMessage("2024-01-03"),
      createMessage("2024-01-04"),
    ];

    expect(
      pickVisibleDateIndex(messages, { startIndex: 0, endIndex: 3 })
    ).toBe(1);
  });

  test("clamps the center index to the available message bounds", () => {
    const messages = [createMessage("2024-01-01"), createMessage("2024-01-02")];

    expect(
      pickVisibleDateIndex(messages, { startIndex: 1, endIndex: 10 })
    ).toBe(1);
  });
});
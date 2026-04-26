import { act, renderHook } from "@testing-library/preact";
import { describe, expect, test, vi } from "vitest";
import type { Message } from "../types";
import {
  findNearestMatchPosition,
  useSearchNavigation,
} from "./use-search-navigation";

const plain = (text: string, username: string): Message => ({
  kind: "plain",
  username,
  date: "2024-01-01",
  time: "12:00",
  text,
});

const messages: Message[] = [
  plain("ㅎㅇ", "나"),
  plain("반가워", "수아"),
  plain("다시 ㅎㅇ", "나"),
  plain("다음에 봐", "수아"),
];

describe("findNearestMatchPosition", () => {
  test("returns the position of the match closest to the anchor index", () => {
    expect(findNearestMatchPosition([0, 4, 8], 5)).toBe(1);
    expect(findNearestMatchPosition([0, 4, 8], 7)).toBe(2);
  });

  test("returns 0 when there are no matches", () => {
    expect(findNearestMatchPosition([], 5)).toBe(0);
  });
});

describe("useSearchNavigation", () => {
  test("searches text, scrolls to matches, and wraps prev/next", () => {
    const scrollToIndex = vi.fn();
    const { result } = renderHook(() =>
      useSearchNavigation({ messages, scrollToIndex })
    );

    act(() => result.current.setSearchQuery("ㅎㅇ"));
    expect(result.current.matches).toEqual([0, 2]);
    expect(result.current.currentMatchIdx).toBe(0);
    expect(scrollToIndex).toHaveBeenLastCalledWith(0);

    act(() => result.current.handlePrev());
    expect(result.current.currentMatchIdx).toBe(1);
    expect(scrollToIndex).toHaveBeenLastCalledWith(2);

    act(() => result.current.handleNext());
    expect(result.current.currentMatchIdx).toBe(0);
    expect(scrollToIndex).toHaveBeenLastCalledWith(0);
  });

  test("selectUser opens search and starts at the first user match", () => {
    const scrollToIndex = vi.fn();
    const { result } = renderHook(() =>
      useSearchNavigation({ messages, scrollToIndex })
    );

    act(() => result.current.selectUser("수아"));

    expect(result.current.searchOpen).toBe(true);
    expect(result.current.userFilter).toBe("수아");
    expect(result.current.currentMatchIdx).toBe(0);
    expect(result.current.matches).toEqual([1, 3]);
    expect(scrollToIndex).toHaveBeenLastCalledWith(1);
  });

  test("selectUserFromMessage starts near the clicked message index", () => {
    const scrollToIndex = vi.fn();
    const { result } = renderHook(() =>
      useSearchNavigation({ messages, scrollToIndex })
    );

    act(() => result.current.selectUserFromMessage("수아", 3));

    expect(result.current.searchOpen).toBe(true);
    expect(result.current.userFilter).toBe("수아");
    expect(result.current.currentMatchIdx).toBe(1);
    expect(result.current.matches).toEqual([1, 3]);
    expect(scrollToIndex).toHaveBeenLastCalledWith(3);
  });

  test("selectUserFromMessage respects the current query", () => {
    const scrollToIndex = vi.fn();
    const { result } = renderHook(() =>
      useSearchNavigation({ messages, scrollToIndex })
    );

    act(() => result.current.setSearchQuery("반가워"));
    act(() => result.current.selectUserFromMessage("수아", 3));

    expect(result.current.searchQuery).toBe("반가워");
    expect(result.current.matches).toEqual([1]);
    expect(result.current.currentMatchIdx).toBe(0);
    expect(scrollToIndex).toHaveBeenLastCalledWith(1);
  });

  test("closeSearch clears query, user filter, and match index", () => {
    const scrollToIndex = vi.fn();
    const { result } = renderHook(() =>
      useSearchNavigation({ messages, scrollToIndex })
    );

    act(() => result.current.selectUser("수아"));
    act(() => result.current.setSearchQuery("반가워"));
    act(() => result.current.closeSearch());

    expect(result.current.searchOpen).toBe(false);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.userFilter).toBeNull();
    expect(result.current.currentMatchIdx).toBe(0);
    expect(result.current.matches).toEqual([]);
  });
});

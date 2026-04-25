import type { ListRange } from "react-virtuoso";
import type { Message } from "../types";

export function pickVisibleDateIndex(
  messages: Message[],
  range: ListRange
): number {
  const centerIndex = Math.floor((range.startIndex + range.endIndex) / 2);
  return Math.max(0, Math.min(messages.length - 1, centerIndex));
}
import type { Message } from "../types";

export function buildDateIndex(messages: Message[]): Map<string, number> {
  const index = new Map<string, number>();
  for (let i = 0; i < messages.length; i++) {
    const date = messages[i].date;
    if (!index.has(date)) index.set(date, i);
  }
  return index;
}

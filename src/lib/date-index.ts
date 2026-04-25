import type { Message } from "../types";

const DATE_RE = /^(\d{4})년 (\d{1,2})월 (\d{1,2})일$/;

export function parseKakaoDate(
  date: string
): { year: number; month: number; day: number } | null {
  const m = date.match(DATE_RE);
  if (!m) return null;
  return {
    year: parseInt(m[1], 10),
    month: parseInt(m[2], 10),
    day: parseInt(m[3], 10),
  };
}

export function formatKakaoDate(
  year: number,
  month: number,
  day: number
): string {
  return `${year}년 ${month}월 ${day}일`;
}

export function buildDateIndex(messages: Message[]): Map<string, number> {
  const index = new Map<string, number>();
  for (let i = 0; i < messages.length; i++) {
    const date = messages[i].date;
    if (!index.has(date)) index.set(date, i);
  }
  return index;
}

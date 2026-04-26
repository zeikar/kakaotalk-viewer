import type { Message } from "../types";

export interface QuerySegment {
  text: string;
  match: boolean;
}

function getSearchableTexts(message: Message): string[] {
  switch (message.kind) {
    case "plain":
    case "notification":
      return [message.text];
    case "select":
      return message.options;
    case "date-header":
      return [];
  }
}

export function findMatches(
  messages: Message[],
  query: string,
  userFilter?: string | null
): number[] {
  const needle = query.trim().toLowerCase();
  const hasUserFilter = !!userFilter;
  if (needle.length === 0 && !hasUserFilter) return [];

  const result: number[] = [];
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (
      hasUserFilter &&
      (message.kind === "notification" ||
        message.kind === "date-header" ||
        message.username !== userFilter)
    ) {
      continue;
    }

    if (needle.length === 0) {
      result.push(i);
      continue;
    }

    const hit = getSearchableTexts(messages[i]).some((text) =>
      text.toLowerCase().includes(needle)
    );
    if (hit) result.push(i);
  }
  return result;
}

export function splitByQuery(text: string, query: string): QuerySegment[] {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) return [{ text, match: false }];

  const lowerText = text.toLowerCase();
  const segments: QuerySegment[] = [];
  let i = 0;

  while (i < text.length) {
    const hit = lowerText.indexOf(needle, i);
    if (hit === -1) {
      segments.push({ text: text.slice(i), match: false });
      break;
    }
    if (hit > i) {
      segments.push({ text: text.slice(i, hit), match: false });
    }
    segments.push({ text: text.slice(hit, hit + needle.length), match: true });
    i = hit + needle.length;
  }

  return segments;
}

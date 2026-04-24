const URL_REGEX = /\bhttps?:\/\/[^\s<>"]+/gi;

export type TextSegment =
  | { kind: "text"; value: string }
  | { kind: "url"; value: string };

export function splitByUrls(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const url = match[0];
    const start = match.index!;

    if (start > lastIndex) {
      segments.push({ kind: "text", value: text.slice(lastIndex, start) });
    }
    segments.push({ kind: "url", value: url });
    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return segments;
}

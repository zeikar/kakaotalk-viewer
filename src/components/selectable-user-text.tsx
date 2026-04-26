import { splitByQuery } from "../lib/search";

type Segment =
  | { kind: "text"; value: string }
  | { kind: "user"; value: string; username: string };

interface Props {
  text: string;
  searchQuery: string;
  users: string[];
  mode: "mention" | "notification";
  onSelectUser: (username: string) => void;
}

export function SelectableUserText({
  text,
  searchQuery,
  users,
  mode,
  onSelectUser,
}: Props) {
  const segments =
    mode === "mention"
      ? splitByMentions(text, users)
      : splitByNotificationUsers(text, users);

  return (
    <>
      {segments.map((segment, i) =>
        segment.kind === "user" ? (
          <button
            key={i}
            type="button"
            class={
              mode === "mention"
                ? "p-0 border-0 bg-transparent align-baseline text-blue-700 cursor-pointer hover:underline focus:outline-none focus:underline"
                : "p-0 border-0 bg-transparent align-baseline underline underline-offset-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/80 rounded-sm"
            }
            onClick={() => onSelectUser(segment.username)}
          >
            {renderHighlighted(
              segment.value,
              searchQuery,
              mode === "mention" ? "text-inherit" : "text-black"
            )}
          </button>
        ) : (
          <span key={i}>
            {renderHighlighted(
              segment.value,
              searchQuery,
              mode === "mention" ? "text-inherit" : "text-black"
            )}
          </span>
        )
      )}
    </>
  );
}

export function renderHighlighted(
  text: string,
  query: string,
  markTextClass = "text-inherit"
) {
  return splitByQuery(text, query).map((part, i) =>
    part.match ? (
      <mark key={i} class={`bg-blue-200 ${markTextClass} rounded-sm`}>
        {part.text}
      </mark>
    ) : (
      <span key={i}>{part.text}</span>
    )
  );
}

function splitByMentions(text: string, users: string[]): Segment[] {
  const names = normalizeUsers(users);
  if (names.length === 0) return [{ kind: "text", value: text }];

  const segments: Segment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const start = text.indexOf("@", cursor);
    if (start === -1) break;

    if (start > cursor) {
      segments.push({ kind: "text", value: text.slice(cursor, start) });
    }

    const before = start > 0 ? text[start - 1] : "";
    if (before && isNameChar(before)) {
      segments.push({ kind: "text", value: "@" });
      cursor = start + 1;
      continue;
    }

    const hit = findMentionAt(text, names, start);
    if (hit) {
      segments.push({
        kind: "user",
        value: hit.value,
        username: hit.username,
      });
      cursor = hit.end;
    } else {
      segments.push({ kind: "text", value: "@" });
      cursor = start + 1;
    }
  }

  if (cursor < text.length) {
    segments.push({ kind: "text", value: text.slice(cursor) });
  }

  return mergeTextSegments(segments);
}

function splitByNotificationUsers(text: string, users: string[]): Segment[] {
  return splitByUsers(text, users, (source, username, start) => {
    if (!source.startsWith(username, start)) return null;
    if (!isSystemUserPosition(source, username, start)) return null;
    return { end: start + username.length, value: username };
  });
}

function splitByUsers(
  text: string,
  users: string[],
  matchAt: (
    source: string,
    username: string,
    start: number
  ) => { end: number; value: string } | null
): Segment[] {
  const names = normalizeUsers(users);
  if (names.length === 0) return [{ kind: "text", value: text }];

  const segments: Segment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const match = names
      .map((username) => {
        const found = text.indexOf(username, cursor);
        return found === -1 ? null : { username, start: found };
      })
      .filter((item): item is { username: string; start: number } => !!item)
      .sort(
        (a, b) => a.start - b.start || b.username.length - a.username.length
      )[0];

    if (!match) break;

    if (match.start > cursor) {
      segments.push({ kind: "text", value: text.slice(cursor, match.start) });
    }

    const hit = matchAt(text, match.username, match.start);
    if (hit) {
      segments.push({
        kind: "user",
        value: hit.value,
        username: match.username,
      });
      cursor = hit.end;
    } else {
      segments.push({
        kind: "text",
        value: text.slice(match.start, match.start + 1),
      });
      cursor = match.start + 1;
    }
  }

  if (cursor < text.length) {
    segments.push({ kind: "text", value: text.slice(cursor) });
  }

  return mergeTextSegments(segments);
}

function normalizeUsers(users: string[]): string[] {
  return [...new Set(users.map((user) => user.trim()).filter(Boolean))].sort(
    (a, b) => b.length - a.length
  );
}

function findMentionAt(
  text: string,
  users: string[],
  start: number
): { end: number; value: string; username: string } | null {
  for (const username of users) {
    const braced = `@{${username}}`;
    if (text.startsWith(braced, start)) {
      return { end: start + braced.length, value: braced, username };
    }

    const plain = `@${username}`;
    const end = start + plain.length;
    if (text.startsWith(plain, start) && isMentionBoundary(text[end])) {
      return { end, value: plain, username };
    }
  }

  return null;
}

function isSystemUserPosition(
  text: string,
  username: string,
  start: number
): boolean {
  const before = text.slice(0, start);
  const after = text.slice(start + username.length);

  return (
    after.startsWith("님이") ||
    after.startsWith("님을") ||
    after.startsWith(" joined this chatroom") ||
    after.startsWith(" left this chatroom") ||
    after.startsWith(" has been removed from this chatroom") ||
    after.startsWith(" invited ") ||
    (before.endsWith(" invited ") &&
      (after.startsWith(" .") || after.startsWith(".")))
  );
}

function isMentionBoundary(char: string | undefined): boolean {
  return !char || !isNameChar(char);
}

function isNameChar(char: string): boolean {
  return /^[\p{L}\p{N}_]$/u.test(char);
}

function mergeTextSegments(segments: Segment[]): Segment[] {
  return segments.reduce<Segment[]>((result, segment) => {
    const prev = result[result.length - 1];
    if (prev?.kind === "text" && segment.kind === "text") {
      prev.value += segment.value;
    } else {
      result.push(segment);
    }
    return result;
  }, []);
}

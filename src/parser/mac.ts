import type { Chat, Message } from "../types";
import { formatIsoDate } from "../lib/format";

const SYSTEM_MESSAGE_PATTERNS = [
  {
    pattern: /^(.*) invited (.*?)( and)?\.$/,
    toText: (match: RegExpMatchArray) =>
      `${match[1]}님이 ${match[2]}님을 초대하였습니다.`,
  },
  {
    pattern: /^.+님이 나갔습니다\.$/,
    toText: (match: RegExpMatchArray) => match[0],
  },
  {
    pattern: /^.+ (joined|left) this chatroom\.$/,
    toText: (match: RegExpMatchArray) => match[0],
  },
  {
    pattern: /^.+ has been removed from this chatroom\.$/,
    toText: (match: RegExpMatchArray) => match[0],
  },
];

export function parseMac(text: string): Chat | null {
  const headerEnd = text.indexOf("\n");
  if (headerEnd < 0) return null;

  const body = text.slice(headerEnd + 1);
  const rows = parseCsvRows(body);
  if (rows.length === 0) return null;

  const users: string[] = [];
  const messages: Message[] = [];
  let currentDate = "";

  for (const [rawDate, user, message] of rows) {
    if (rawDate.length === 0) {
      messages.push({ kind: "notification", date: currentDate, text: message });
      continue;
    }

    const date = formatDate(rawDate);
    const time = formatTime(rawDate);

    if (currentDate !== date) {
      currentDate = date;
      messages.push({ kind: "date-header", date });
    }

    const systemMessage = getSystemMessageText(message);
    if (systemMessage) {
      messages.push({ kind: "notification", date, text: systemMessage });
      continue;
    }

    if (user.trim().length > 0 && !users.includes(user)) users.push(user);

    messages.push({
      kind: "plain",
      username: user,
      date,
      time,
      text: message,
    });
  }

  users.sort((a, b) => a.localeCompare(b));
  const roomName = users.length <= 3 ? users.join(", ") : "단체방";

  return { roomName, users, messages };
}

function getSystemMessageText(message: string): string | null {
  for (const { pattern, toText } of SYSTEM_MESSAGE_PATTERNS) {
    const match = message.match(pattern);
    if (match) return toText(match);
  }

  return null;
}

// 3-field rows: unquoted date, "quoted user", "quoted message".
// Quoted fields support "" escapes and embedded newlines.
function parseCsvRows(text: string): Array<[string, string, string]> {
  const rows: Array<[string, string, string]> = [];
  let i = 0;

  const readQuoted = (): string | null => {
    if (text[i] !== '"') return null;
    i++;
    let out = "";
    while (i < text.length) {
      if (text[i] === '"') {
        if (text[i + 1] === '"') {
          out += '"';
          i += 2;
        } else {
          i++;
          return out;
        }
      } else {
        out += text[i];
        i++;
      }
    }
    return null;
  };

  while (i < text.length) {
    while (i < text.length && (text[i] === "\n" || text[i] === "\r")) i++;
    if (i >= text.length) break;

    const dateStart = i;
    while (i < text.length && text[i] !== ",") i++;
    if (i >= text.length) break;
    const date = text.slice(dateStart, i);
    i++;

    const user = readQuoted();
    if (user === null || text[i] !== ",") break;
    i++;

    const message = readQuoted();
    if (message === null) break;

    rows.push([date, user, message]);
  }

  return rows;
}

function formatDate(str: string): string {
  const date = new Date(str);
  return formatIsoDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

function formatTime(str: string): string {
  const date = new Date(str);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

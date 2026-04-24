import type { Chat, Message } from "../types";

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
    const date = formatDate(rawDate);
    const time = formatTime(rawDate);

    if (currentDate !== date) {
      currentDate = date;
      messages.push({ kind: "notification", date, text: date });
    }

    const inviteMatch = message.match(/^(.*) invited (.*?)( and)?\.$/);
    if (inviteMatch) {
      messages.push({
        kind: "notification",
        date,
        text: `${inviteMatch[1]}님이 ${inviteMatch[2]}님을 초대하였습니다.`,
      });
      continue;
    }

    if (message.endsWith("님이 나갔습니다.")) {
      messages.push({ kind: "notification", date, text: message });
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

  const roomName = users.length <= 3 ? users.join(", ") : "단체방";

  return { roomName, users, messages };
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
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatTime(str: string): string {
  const date = new Date(str);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

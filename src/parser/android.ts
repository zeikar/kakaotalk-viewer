import type { Chat, Message, PlainMessage } from "../types";
import { convert12TimeTo24Time } from "../lib/format";

const DATE_LINE = /^(\d{4}년 \d{1,2}월 \d{1,2}일) .*$/;
const MESSAGE_LINE =
  /^\d{4}년 \d{1,2}월 \d{1,2}일 (오전|오후) (\d{1,2}:\d{1,2}), (.*) : (.*)$/;
const NOTIFICATION_LINE =
  /^\d{4}년 \d{1,2}월 \d{1,2}일 (오전|오후) \d{1,2}:\d{1,2}, (.*)$/;

export function parseAndroid(text: string): Chat | null {
  const lines = text.split(/\r?\n/);
  if (lines.length <= 4) return null;

  let roomName = lines[0].replace(/(.*) 카카오톡 대화/, "$1");
  if (roomName.endsWith("님과")) {
    roomName = roomName.slice(0, -3);
  }

  const users: string[] = [];
  const messages: Message[] = [];
  let currentDate = "";

  for (let i = 4; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) continue;

    if (!line.includes(",")) {
      const dateMatch = line.match(DATE_LINE);
      if (!dateMatch) {
        const last = messages[messages.length - 1];
        if (last && last.kind === "plain") last.text += "\n" + line;
        continue;
      }
      const date = dateMatch[1];
      if (currentDate !== date) {
        currentDate = date;
        messages.push({ kind: "notification", date, text: date });
      }
      continue;
    }

    const messageMatch = line.match(MESSAGE_LINE);
    if (!messageMatch) {
      const notiMatch = line.match(NOTIFICATION_LINE);
      if (notiMatch) {
        messages.push({ kind: "notification", date: currentDate, text: notiMatch[2] });
        continue;
      }

      const last = messages[messages.length - 1];
      if (last && last.kind === "plain") last.text += "\n" + line;
      continue;
    }

    const time = convert12TimeTo24Time(messageMatch[2], messageMatch[1]);
    const username = messageMatch[3];
    const text = messageMatch[4];

    if (!users.includes(username)) users.push(username);

    const msg: PlainMessage = {
      kind: "plain",
      username,
      date: currentDate,
      time,
      text,
    };
    messages.push(msg);
  }

  return { roomName, users, messages };
}

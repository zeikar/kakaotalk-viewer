import type { Chat, Message, PlainMessage } from "../types";

const DATE_LINE = /^-{15} (\d{4}년 \d{1,2}월 \d{1,2}일) .*-{15}$/;
const MESSAGE_LINE = /^\[(.*)\] \[(\d{1,2}:\d{1,2})\] (.*)$/;

export function parseWindows(text: string): Chat | null {
  const lines = text.split(/\r?\n/);
  if (lines.length <= 3) return null;

  const roomName = lines[0].replace(/(.*) 님과 카카오톡 대화/, "$1");
  const users: string[] = [];
  const messages: Message[] = [];

  let currentDate = "";

  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];

    const dateMatch = line.match(DATE_LINE);
    if (dateMatch) {
      currentDate = dateMatch[1];
      messages.push({ kind: "notification", date: currentDate, text: currentDate });
      continue;
    }

    const messageMatch = line.match(MESSAGE_LINE);
    if (!messageMatch) {
      if (
        line.endsWith("님을 초대하였습니다.") ||
        line.endsWith("님이 나갔습니다.")
      ) {
        messages.push({ kind: "notification", date: currentDate, text: line });
        continue;
      }

      const last = messages[messages.length - 1];
      if (last && last.kind === "plain") {
        last.text += "\n" + line;
      }
      continue;
    }

    const [, username, time, text] = messageMatch;

    if (username.trim().length > 0 && !users.includes(username)) {
      users.push(username);
    }

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

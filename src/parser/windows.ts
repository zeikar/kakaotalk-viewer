import type { Chat, Message, PlainMessage } from "../types";
import { convert12TimeTo24Time, formatIsoDate } from "../lib/format";

const DATE_LINE_KO = /^-{15} (\d{4})년 (\d{1,2})월 (\d{1,2})일 .*-{15}$/;

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DATE_LINE_EN = new RegExp(
  `^-{15} \\w+, (${MONTHS_EN.join("|")}) (\\d{1,2}), (\\d{4}) -{15}$`
);

const MESSAGE_LINE = /^\[(.*)\] \[(?:(오전|오후) )?(\d{1,2}:\d{1,2})\] (.*)$/;

function matchDateLine(line: string): string | null {
  const ko = line.match(DATE_LINE_KO);
  if (ko) {
    return formatIsoDate(
      parseInt(ko[1], 10),
      parseInt(ko[2], 10),
      parseInt(ko[3], 10)
    );
  }
  const en = line.match(DATE_LINE_EN);
  if (en) {
    return formatIsoDate(
      parseInt(en[3], 10),
      MONTHS_EN.indexOf(en[1]) + 1,
      parseInt(en[2], 10)
    );
  }
  return null;
}

export function parseWindows(text: string): Chat | null {
  const lines = text.split(/\r?\n/);
  if (lines.length <= 3) return null;

  const roomName = lines[0].replace(/(.*) 님과 카카오톡 대화/, "$1");
  const users: string[] = [];
  const messages: Message[] = [];

  let currentDate = "";

  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];

    const date = matchDateLine(line);
    if (date) {
      currentDate = date;
      messages.push({ kind: "date-header", date: currentDate });
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

    const [, username, ampm, rawTime, text] = messageMatch;
    const time = ampm ? convert12TimeTo24Time(rawTime, ampm) : rawTime;

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

  users.sort((a, b) => a.localeCompare(b));
  return { roomName, users, messages };
}

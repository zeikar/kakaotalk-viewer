import type { Chat, Message, PlainMessage } from "../types";
import { convert12TimeTo24Time, formatIsoDate } from "../lib/format";

const DATE_LINE_KO = /^(\d{4})년 (\d{1,2})월 (\d{1,2})일 .*$/;
const MONTHS_EN = [
  ["Jan", "January"],
  ["Feb", "February"],
  ["Mar", "March"],
  ["Apr", "April"],
  ["May"],
  ["Jun", "June"],
  ["Jul", "July"],
  ["Aug", "August"],
  ["Sep", "September"],
  ["Oct", "October"],
  ["Nov", "November"],
  ["Dec", "December"],
];
const MONTH_PATTERN_EN = MONTHS_EN.flat().join("|");
const DATE_LINE_EN = new RegExp(
  `^\\w+, (${MONTH_PATTERN_EN}) (\\d{1,2}), (\\d{4})$`
);
const MESSAGE_LINE_KO = /^(오전|오후) (\d{1,2}:\d{1,2}), (.*?) : (.*)$/;
const MESSAGE_LINE_KO_WITH_DATE =
  /^(\d{4})\. ?(\d{1,2})\. ?(\d{1,2})\. (오전|오후) (\d{1,2}:\d{1,2}), (.*?) : (.*)$/;
const NOTIFICATION_LINE_KO = /^(오전|오후) \d{1,2}:\d{1,2}, (.*)$/;
const MESSAGE_LINE_EN = new RegExp(
  `^(${MONTH_PATTERN_EN}) (\\d{1,2}), (\\d{4}) at (\\d{1,2}:\\d{2}), (.*?) : (.*)$`
);
const NOTIFICATION_LINE_EN = new RegExp(
  `^(${MONTH_PATTERN_EN}) (\\d{1,2}), (\\d{4}) at \\d{1,2}:\\d{2}: (.*)$`
);

export function isIosExport(text: string): boolean {
  const lines = text.split(/\r?\n/);

  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) continue;
    if (matchDateLine(line)) continue;
    return (
      MESSAGE_LINE_KO.test(line) ||
      MESSAGE_LINE_KO_WITH_DATE.test(line) ||
      NOTIFICATION_LINE_KO.test(line) ||
      MESSAGE_LINE_EN.test(line) ||
      NOTIFICATION_LINE_EN.test(line)
    );
  }

  return false;
}

export function parseIos(text: string): Chat | null {
  const lines = text.split(/\r?\n/);
  if (lines.length <= 4) return null;

  let roomName = lines[0].replace(/^\uFEFF/, "").replace(/(.*) 카카오톡 대화/, "$1");
  if (roomName.endsWith("님과")) {
    roomName = roomName.slice(0, -3);
  }

  const users: string[] = [];
  const messages: Message[] = [];
  let currentDate = "";

  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) continue;

    const date = matchDateLine(line);
    if (date) {
      if (currentDate !== date) {
        currentDate = date;
        messages.push({ kind: "date-header", date });
      }
      continue;
    }

    const message = matchMessageLine(line, currentDate);
    if (!message) {
      const notification = matchNotificationLine(line);
      if (notification) {
        messages.push({
          kind: "notification",
          date: notification.date ?? currentDate,
          text: notification.text,
        });
        continue;
      }

      const last = messages[messages.length - 1];
      if (last && last.kind === "plain") last.text += "\n" + line;
      continue;
    }

    if (message.username.trim().length > 0 && !users.includes(message.username)) {
      users.push(message.username);
    }

    const msg: PlainMessage = {
      kind: "plain",
      username: message.username,
      date: message.date,
      time: message.time,
      text: message.text,
    };
    messages.push(msg);
  }

  return { roomName, users, messages };
}

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
      getEnglishMonth(en[1]),
      parseInt(en[2], 10)
    );
  }

  return null;
}

function matchMessageLine(
  line: string,
  currentDate: string
): { username: string; date: string; time: string; text: string } | null {
  const ko = line.match(MESSAGE_LINE_KO);
  if (ko) {
    return {
      username: ko[3],
      date: currentDate,
      time: convert12TimeTo24Time(ko[2], ko[1]),
      text: ko[4],
    };
  }

  const koWithDate = line.match(MESSAGE_LINE_KO_WITH_DATE);
  if (koWithDate) {
    return {
      username: koWithDate[6],
      date: formatIsoDate(
        parseInt(koWithDate[1], 10),
        parseInt(koWithDate[2], 10),
        parseInt(koWithDate[3], 10)
      ),
      time: convert12TimeTo24Time(koWithDate[5], koWithDate[4]),
      text: koWithDate[7],
    };
  }

  const en = line.match(MESSAGE_LINE_EN);
  if (en) {
    return {
      username: en[5],
      date: formatIsoDate(
        parseInt(en[3], 10),
        getEnglishMonth(en[1]),
        parseInt(en[2], 10)
      ),
      time: en[4],
      text: en[6],
    };
  }

  return null;
}

function matchNotificationLine(
  line: string
): { date: string | null; text: string } | null {
  const ko = line.match(NOTIFICATION_LINE_KO);
  if (ko) return { date: null, text: ko[2] };

  const en = line.match(NOTIFICATION_LINE_EN);
  if (en) {
    return {
      date: formatIsoDate(
        parseInt(en[3], 10),
        getEnglishMonth(en[1]),
        parseInt(en[2], 10)
      ),
      text: en[4],
    };
  }

  return null;
}

function getEnglishMonth(month: string): number {
  return MONTHS_EN.findIndex((names) => names.includes(month)) + 1;
}

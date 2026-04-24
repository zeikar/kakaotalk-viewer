import type { Chat } from "../types";
import { parseAndroid } from "./android";
import { parseMac } from "./mac";
import { parseWindows } from "./windows";

export function parseKakaoTalkText(text: string): Chat | null {
  const lines = text.split(/\r?\n/, 4);

  if (lines[0]?.includes("Date,User,Message")) {
    return parseMac(text);
  }

  if (lines[3]?.startsWith("---------------")) {
    return parseWindows(text);
  }

  return parseAndroid(text);
}

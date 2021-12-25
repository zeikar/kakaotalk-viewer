import { parseKakaoTalkText as parseKakaoTalkTextWindows } from "./windows-parser.js";
import { parseKakaoTalkText as parseKakaoTalkTextAndroid } from "./android-parser.js";
import { parseKakaoTalkText as parseKakaoTalkTextMac } from "./mac-parser.js";

export function parseKakaoTalkText(text) {
  const lines = text.split(/\r?\n/, 4);

  // mac
  if (lines[0].includes("Date,User,Message")) {
    return parseKakaoTalkTextMac(text);
  }

  // pc
  if (lines[3].startsWith("---------------")) {
    return parseKakaoTalkTextWindows(text);
  }

  // android
  return parseKakaoTalkTextAndroid(text);
}

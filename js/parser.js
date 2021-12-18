import { parseKakaoTalkText as parseKakaoTalkTextPC } from "./pc-parser.js";
import { parseKakaoTalkText as parseKakaoTalkTextAndroid } from "./android-parser.js";

export function parseKakaoTalkText(text) {
  const lines = text.split(/\r?\n/, 4);

  // error
  if (lines.length <= 3) {
    return null;
  }

  // pc
  if (lines[3].startsWith("---------------")) {
    return parseKakaoTalkTextPC(text);
  }
  // android
  return parseKakaoTalkTextAndroid(text);
}

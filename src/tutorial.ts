import type { Chat } from "./types";
import { getCurrentDate, getCurrentTime } from "./lib/format";

const APP_NAME = "카카오톡 뷰어";

export function createTutorialChat(): Chat {
  const date = getCurrentDate();
  const time = getCurrentTime();

  return {
    roomName: APP_NAME,
    users: [APP_NAME],
    messages: [
      { kind: "notification", date, text: date },
      {
        kind: "plain",
        username: APP_NAME,
        date,
        time,
        text: "안녕하세요. 카카오톡 뷰어입니다.\n\n아래 메시지 입력 창에 내보내기한 텍스트 파일을 올려주세요.",
      },
    ],
  };
}

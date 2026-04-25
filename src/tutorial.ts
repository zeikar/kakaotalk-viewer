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
      { kind: "date-header", date },
      {
        kind: "plain",
        username: APP_NAME,
        date,
        time,
        text: "카카오톡 내보내기 뷰어입니다.\n\n카카오톡에서 내보내기 한 .txt/.csv 대화 파일을 브라우저에서 바로 볼 수 있어요.\n\n파일은 서버로 업로드되지 않고, 이 브라우저 안에서만 읽고 렌더링됩니다.\n\n아래 파일 선택 버튼으로 카카오톡 내보내기 파일을 불러와 주세요.",
      },
    ],
  };
}

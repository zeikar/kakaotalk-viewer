import { Chat } from "./chat.js";
import { getCurrentDate, getCurrentTime } from "./format.js";
import { Message } from "./message.js";

export function generateTutorialMessages() {
  return new Chat(
    "카카오톡 뷰어",
    ["카카오톡 뷰어"],
    [
      new Message(
        "",
        getCurrentDate(),
        getCurrentTime(),
        "notification",
        getCurrentDate()
      ),
      new Message(
        "카카오톡 뷰어",
        getCurrentDate(),
        getCurrentTime(),
        "plain",
        `안녕하세요. 카카오톡 뷰어입니다.
        
        아래 메시지 입력 창에 내보내기한 텍스트 파일을 올려주세요.`
      ),
    ]
  );
}

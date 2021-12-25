import { Chat } from "./chat.js";
import { getCurrentDate, getCurrentTime } from "./lib/format.js";
import { MessageFactory } from "./messages/message-factory.js";

export function generateTutorialMessages() {
  return new Chat(
    "카카오톡 뷰어",
    ["카카오톡 뷰어"],
    [
      MessageFactory.createNotificationMessage(
        getCurrentDate(),
        getCurrentDate()
      ),
      MessageFactory.createPlainMessage(
        "카카오톡 뷰어",
        getCurrentDate(),
        getCurrentTime(),
        `안녕하세요. 카카오톡 뷰어입니다.
        
        아래 메시지 입력 창에 내보내기한 텍스트 파일을 올려주세요.`
      ),
    ]
  );
}

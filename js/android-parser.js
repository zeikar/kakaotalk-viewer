import { Chat } from "./chat.js";
import { convert12TimeTo24Time } from "./format.js";
import { Message } from "./message.js";

export function parseKakaoTalkText(text) {
  let roomName = "";
  let users = [];
  let messages = [];

  const lines = text.split(/\r?\n/);

  // 파싱 불가능
  if (lines.length <= 4) {
    return null;
  }

  // 채팅방 이름
  // 채팅방 이름 (님과) 카카오톡 대화
  roomName = lines[0].replace(/(.*) 카카오톡 대화/, "$1");
  if (roomName.endsWith("님과")) {
    roomName = roomName.substring(0, roomName.length - 3);
  }

  let date = "";

  for (let i = 4; i < lines.length; i++) {
    const line = lines[i];

    if (line.length == 0) {
      continue;
    }

    // 날짜
    // 2020년 12월 7일 오후 4:38
    if (!line.includes(",")) {
      const match = line.match(/^(\d{4}년 \d{1,2}월 \d{1,2}일) .*$/);

      // 연결되는 메시지
      if (!match || match.length != 2) {
        if (messages.length == 0) {
          continue;
        }

        messages[messages.length - 1].text += "\n" + line;
        continue;
      }

      date = match[1];
      messages.push(new Message("", date, "", "notification", date));
      continue;
    }

    // 2020년 12월 7일 오후 4:40, 사용자이름 : 메시지
    const match = line.match(
      /^\d{4}년 \d{1,2}월 \d{1,2}일 (오전|오후) (\d{1,2}:\d{1,2}), (.*) : (.*)$/
    );

    if (!match || match.length != 5) {
      // 초대/나감 메시지
      const notiMatch = line.match(
        /^\d{4}년 \d{1,2}월 \d{1,2}일 (오전|오후) \d{1,2}:\d{1,2}, (.*)$/
      );
      if (notiMatch) {
        messages.push(new Message("", date, "", "notification", notiMatch[2]));
        continue;
      }

      // 연결되는 메시지
      if (messages.length == 0) {
        continue;
      }

      messages[messages.length - 1].text += "\n" + line;
      continue;
    }

    let messageTime = convert12TimeTo24Time(match[2], match[1]);
    const userName = match[3];
    const messageText = match[4];

    // 사용자를 추가한다
    if (!users.includes(userName)) {
      users.push(userName);
    }

    // 메시지를 추가한다
    messages.push(
      new Message(userName, date, messageTime, "plain", messageText)
    );
  }

  return new Chat(roomName, users, messages);
}

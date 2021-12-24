import { Chat } from "./chat.js";
import { MessageFactory } from "./messages/message-factory.js";

// mac 2.9.9
export function parseKakaoTalkText(text) {
  let roomName = "";
  let users = [];
  let messages = [];

  // Date,User,Message
  const matchAll = text.matchAll(
    /(.*),\"(.*)\",\"((?:(?:"")*[^"]*)*|[^",\n]*)\"/gm
  );

  let currentDate = "";

  for (const match of matchAll) {
    // 2021-08-05 15:21:48
    const date = formatDate(match[1]);
    const time = formatTime(match[1]);

    if (currentDate != date) {
      currentDate = date;
      messages.push(MessageFactory.createNotificationMessage(date, date));
    }
    const user = match[2];
    let message = match[3];

    // 초대
    // 사용자 invited 사용자 and.
    const inviteMatch = message.match(/^(.*) invited (.*)( and)?\.$/);
    if (inviteMatch) {
      const user1 = inviteMatch[1];
      const user2 = inviteMatch[2];
      messages.push(
        MessageFactory.createNotificationMessage(
          time,
          `${user1}님이 ${user2}님을 초대하였습니다.`
        )
      );
      continue;
    }
    // 나감
    if (message.endsWith("님이 나갔습니다.")) {
      messages.push(MessageFactory.createNotificationMessage(date, message));
      continue;
    }

    // 사용자를 추가한다
    if (!users.includes(user)) {
      users.push(user);
    }

    // remove double quotes
    message = message.replace(/\"\"/g, '"');
    messages.push(MessageFactory.createPlainMessage(user, date, time, message));
  }

  // 채팅방 이름
  if (users.length <= 3) {
    roomName = users.join(", ");
  } else {
    roomName = "단체방";
  }

  return new Chat(roomName, users, messages);
}

function formatDate(str) {
  const date = new Date(str);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

function formatTime(str) {
  const date = new Date(str);
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

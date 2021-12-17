export function parseKakaoTalkText(text) {
  const result = {
    roomName: "",
    users: [],
    messages: [],
  };

  const lines = text.split(/\r?\n/);

  // 파싱 불가능
  if (lines.length <= 3) {
    return null;
  }

  // 채팅방 이름
  // 채팅방 이름 님과 카카오톡 대화
  result.roomName = lines[0].replace(/(.*) 님과 카카오톡 대화/, "$1");

  let date = "";

  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];

    // 날짜
    // --------------- 2020년 8월 31일 월요일 ---------------
    if (
      line.startsWith("---------------") &&
      line.endsWith("---------------")
    ) {
      date = line.replace(/^.*?(\d{4}년 \d{1,2}월 \d{1,2}일) .*$/, "$1");
      continue;
    }

    // [사용자 이름] [메시지 시각] 메시지
    const match = line.match(/^\[(.*)\] \[(\d{1,2}:\d{1,2})\] (.*)$/);

    // 연결되는 메시지
    if (!match || match.length != 4) {
      if (result.messages.length == 0) {
        continue;
      }

      result.messages[result.messages.length - 1].text += "\n" + line;
      continue;
    }

    const userName = match[1];
    const messageTime = match[2];
    const messageText = match[3];

    // 사용자를 추가한다
    if (!result.users.includes(userName)) {
      result.users.push(userName);
    }

    // 메시지를 추가한다
    result.messages.push({
      userName: userName,
      date: date,
      time: messageTime,
      text: messageText,
    });
  }

  return result;
}

import { describe, expect, test } from "vitest";
import { parseKakaoTalkText } from ".";

describe("parseKakaoTalkText", () => {
  test("dispatches Mac CSV exports", () => {
    const chat = parseKakaoTalkText(`Date,User,Message
2021-12-29 20:36:00,"테스트","ㅎㅇ"`);

    expect(chat?.roomName).toBe("테스트");
  });

  test("dispatches Windows exports", () => {
    const chat = parseKakaoTalkText(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17

--------------- 2021년 12월 29일 수요일 ---------------
[테스트] [20:36] ㅎㅇ`);

    expect(chat?.messages[1]).toMatchObject({
      kind: "plain",
      username: "테스트",
      time: "20:36",
    });
  });

  test("dispatches Android exports by default", () => {
    const chat = parseKakaoTalkText(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


2021년 12월 29일 오후 8:36
2021년 12월 29일 오후 8:36, 테스트 : ㅎㅇ`);

    expect(chat?.messages[1]).toMatchObject({
      kind: "plain",
      username: "테스트",
      time: "20:36",
    });
  });
});

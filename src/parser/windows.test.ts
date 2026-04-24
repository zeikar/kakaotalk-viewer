import { describe, expect, test } from "vitest";
import { parseWindows } from "./windows";

describe("parseWindows", () => {
  test("returns null for too-short exports", () => {
    expect(parseWindows("one\ntwo\nthree")).toBeNull();
  });

  test("parses messages, invite/leave notifications, and multiline text", () => {
    const chat = parseWindows(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17

--------------- 2021년 12월 29일 수요일 ---------------
[] [20:35] 시스템 알림
[테스트] [20:36] ㅎㅇ
이어지는 줄
수아님을 초대하였습니다.
테스트님이 나갔습니다.
[나] [20:37] 반가워
[나] [20:38] 또 말함`);

    expect(chat).toEqual({
      roomName: "테스트",
      users: ["테스트", "나"],
      messages: [
        {
          kind: "notification",
          date: "2021년 12월 29일",
          text: "2021년 12월 29일",
        },
        {
          kind: "plain",
          username: "",
          date: "2021년 12월 29일",
          time: "20:35",
          text: "시스템 알림",
        },
        {
          kind: "plain",
          username: "테스트",
          date: "2021년 12월 29일",
          time: "20:36",
          text: "ㅎㅇ\n이어지는 줄",
        },
        {
          kind: "notification",
          date: "2021년 12월 29일",
          text: "수아님을 초대하였습니다.",
        },
        {
          kind: "notification",
          date: "2021년 12월 29일",
          text: "테스트님이 나갔습니다.",
        },
        {
          kind: "plain",
          username: "나",
          date: "2021년 12월 29일",
          time: "20:37",
          text: "반가워",
        },
        {
          kind: "plain",
          username: "나",
          date: "2021년 12월 29일",
          time: "20:38",
          text: "또 말함",
        },
      ],
    });
  });

  test("ignores unmatched leading lines before the first message", () => {
    const chat = parseWindows(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17

unexpected line`);

    expect(chat).toEqual({
      roomName: "테스트",
      users: [],
      messages: [],
    });
  });
});

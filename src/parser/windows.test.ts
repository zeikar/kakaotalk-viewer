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
      users: ["나", "테스트"],
      messages: [
        {
          kind: "date-header",
          date: "2021-12-29",
        },
        {
          kind: "plain",
          username: "",
          date: "2021-12-29",
          time: "20:35",
          text: "시스템 알림",
        },
        {
          kind: "plain",
          username: "테스트",
          date: "2021-12-29",
          time: "20:36",
          text: "ㅎㅇ\n이어지는 줄",
        },
        {
          kind: "notification",
          date: "2021-12-29",
          text: "수아님을 초대하였습니다.",
        },
        {
          kind: "notification",
          date: "2021-12-29",
          text: "테스트님이 나갔습니다.",
        },
        {
          kind: "plain",
          username: "나",
          date: "2021-12-29",
          time: "20:37",
          text: "반가워",
        },
        {
          kind: "plain",
          username: "나",
          date: "2021-12-29",
          time: "20:38",
          text: "또 말함",
        },
      ],
    });
  });

  test("parses English-locale date separators", () => {
    const chat = parseWindows(`테스트 님과 카카오톡 대화
저장한 날짜 : 2023년 7월 22일 오후 11:34

--------------- Saturday, July 22, 2023 ---------------
[테스트] [23:34] 첫째 날
--------------- Sunday, July 23, 2023 ---------------
[지민] [00:00] 둘째 날`);

    expect(chat?.messages).toEqual([
      { kind: "date-header", date: "2023-07-22" },
      {
        kind: "plain",
        username: "테스트",
        date: "2023-07-22",
        time: "23:34",
        text: "첫째 날",
      },
      { kind: "date-header", date: "2023-07-23" },
      {
        kind: "plain",
        username: "지민",
        date: "2023-07-23",
        time: "00:00",
        text: "둘째 날",
      },
    ]);
  });

  test("parses Korean 12-hour message times from PC exports", () => {
    const chat = parseWindows(`P2 님과 카카오톡 대화
저장한 날짜 : 2019-08-14 13:25:39

--------------- 2017년 10월 29일 일요일 ---------------
[P2] [오후 10:10] 저 소가 무슨 소인지가 궁금했음 ?
[P1] [오전 12:23] ㅇㅇㅇㅇㅇ`);

    expect(chat?.messages).toEqual([
      { kind: "date-header", date: "2017-10-29" },
      {
        kind: "plain",
        username: "P2",
        date: "2017-10-29",
        time: "22:10",
        text: "저 소가 무슨 소인지가 궁금했음 ?",
      },
      {
        kind: "plain",
        username: "P1",
        date: "2017-10-29",
        time: "00:23",
        text: "ㅇㅇㅇㅇㅇ",
      },
    ]);
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

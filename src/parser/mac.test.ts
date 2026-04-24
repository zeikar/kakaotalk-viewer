import { describe, expect, test } from "vitest";
import { parseMac } from "./mac";

describe("parseMac", () => {
  test("returns null when there is no header line", () => {
    expect(parseMac("Date,User,Message")).toBeNull();
  });

  test("returns null when there are no CSV rows", () => {
    expect(parseMac("Date,User,Message\n")).toBeNull();
  });

  test("parses quoted CSV rows, escaped quotes, multiline messages, and notifications", () => {
    const chat = parseMac(`Date,User,Message
2021-12-29 20:36:00,"테스트","ㅎㅇ
""인용"" 포함"
2021-12-29 20:37:00,"나","반가워"
2021-12-29 20:38:00,"테스트","테스트 invited 나 and."
2021-12-29 20:39:00,"나","나님이 나갔습니다."
2021-12-29 20:40:00,"테스트","다시 말함"
2021-12-30 01:02:00,"수아","다음날 메시지"
`);

    expect(chat).toEqual({
      roomName: "테스트, 나, 수아",
      users: ["테스트", "나", "수아"],
      messages: [
        {
          kind: "notification",
          date: "2021년 12월 29일",
          text: "2021년 12월 29일",
        },
        {
          kind: "plain",
          username: "테스트",
          date: "2021년 12월 29일",
          time: "20:36",
          text: "ㅎㅇ\n\"인용\" 포함",
        },
        {
          kind: "plain",
          username: "나",
          date: "2021년 12월 29일",
          time: "20:37",
          text: "반가워",
        },
        {
          kind: "notification",
          date: "2021년 12월 29일",
          text: "테스트님이 나님을 초대하였습니다.",
        },
        {
          kind: "notification",
          date: "2021년 12월 29일",
          text: "나님이 나갔습니다.",
        },
        {
          kind: "plain",
          username: "테스트",
          date: "2021년 12월 29일",
          time: "20:40",
          text: "다시 말함",
        },
        {
          kind: "notification",
          date: "2021년 12월 30일",
          text: "2021년 12월 30일",
        },
        {
          kind: "plain",
          username: "수아",
          date: "2021년 12월 30일",
          time: "01:02",
          text: "다음날 메시지",
        },
      ],
    });
  });

  test("uses 단체방 for rooms with more than three users", () => {
    const chat = parseMac(`Date,User,Message
2021-12-29 20:36:00,"a","1"
2021-12-29 20:37:00,"b","2"
2021-12-29 20:38:00,"c","3"
2021-12-29 20:39:00,"d","4"`);

    expect(chat?.roomName).toBe("단체방");
  });

  test("stops parsing malformed CSV rows", () => {
    expect(parseMac(`Date,User,Message
2021-12-29 20:36:00,테스트,"ㅎㅇ"`)).toBeNull();

    expect(parseMac(`Date,User,Message
2021-12-29 20:36:00,"테스트","ㅎㅇ`)).toBeNull();

    expect(parseMac(`Date,User,Message
2021-12-29 20:36:00,"테스트""ㅎㅇ"`)).toBeNull();

    expect(parseMac(`Date,User,Message
2021-12-29 20:36:00`)).toBeNull();
  });
});

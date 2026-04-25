import { describe, expect, test } from "vitest";
import { parseAndroid } from "./android";

describe("parseAndroid", () => {
  test("returns null for too-short exports", () => {
    expect(parseAndroid("one\ntwo\nthree\nfour")).toBeNull();
  });

  test("parses room names ending with 님과", () => {
    const chat = parseAndroid(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


2021년 12월 29일 오후 8:36
2021년 12월 29일 오후 8:36, 테스트 : ㅎㅇ`);

    expect(chat?.roomName).toBe("테스트");
  });

  test("parses messages, notifications, and multiline text", () => {
    const chat = parseAndroid(`팀 채팅방 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


2021년 12월 29일 오후 8:36
2021년 12월 29일 오후 8:35,  : 시스템 알림
2021년 12월 29일 오후 8:36, 테스트 : ㅎㅇ
이어지는 줄
2021년 12월 29일 오후 8:37, 나 : 반가워
2021년 12월 29일 오후 8:38, 테스트님이 나갔습니다.`);

    expect(chat).toEqual({
      roomName: "팀 채팅방",
      users: ["테스트", "나"],
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
          kind: "plain",
          username: "나",
          date: "2021-12-29",
          time: "20:37",
          text: "반가워",
        },
        {
          kind: "notification",
          date: "2021-12-29",
          text: "테스트님이 나갔습니다.",
        },
      ],
    });
  });

  test("ignores unmatched lines before the first plain message", () => {
    const chat = parseAndroid(`팀 채팅방 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


알 수 없는 줄
2021년 12월 29일 오후 8:36, 알 수 없는 알림
broken, comma line
2021년 12월 29일 오후 8:37, 테스트 : 이후 메시지`);

    expect(chat).toEqual({
      roomName: "팀 채팅방",
      users: ["테스트"],
      messages: [
        {
          kind: "notification",
          date: "",
          text: "알 수 없는 알림",
        },
        {
          kind: "plain",
          username: "테스트",
          date: "",
          time: "20:37",
          text: "이후 메시지",
        },
      ],
    });
  });

  test("does not repeat date headers for the same date", () => {
    const chat = parseAndroid(`데모 채팅방 카카오톡 대화
저장한 날짜 : 2026년 4월 24일 오후 9:30


2026년 4월 24일 오후 8:56
2026년 4월 24일 오후 8:56, 지민 : 스크린샷용 데모 한번 뽑아보자

2026년 4월 24일 오후 9:12
2026년 4월 24일 오후 9:12, 나 : 날짜 헤더는 한 번만 보여야 함`);

    expect(
      chat?.messages.filter(
        (message) =>
          message.kind === "date-header" && message.date === "2026-04-24"
      )
    ).toHaveLength(1);
  });

  test("keeps colons in message text out of usernames", () => {
    const chat = parseAndroid(`데모 채팅방 카카오톡 대화
저장한 날짜 : 2026년 4월 24일 오후 9:30


2026년 4월 24일 오후 9:00
2026년 4월 24일 오후 9:00, 테스트 : Day 1 : https://example.com/one
Day 2 : https://example.com/two`);

    expect(chat?.users).toEqual(["테스트"]);
    expect(chat?.messages[1]).toEqual({
      kind: "plain",
      username: "테스트",
      date: "2026-04-24",
      time: "21:00",
      text: "Day 1 : https://example.com/one\nDay 2 : https://example.com/two",
    });
  });

  test("keeps the former public sample behavior", () => {
    const chat = parseAndroid(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


2021년 12월 29일 오후 8:36
2021년 12월 29일 오후 8:36, 테스트 : ㅎㅇ
2021년 12월 29일 오후 8:37, 나 : ㅎㅇ
2021년 12월 29일 오후 8:41, 테스트 : ㅎㅇㅎㅇ
2021년 12월 29일 오후 8:41, 테스트 : ㅎㅇㅎㅇ

2021년 12월 30일 오후 10:06
2021년 12월 30일 오후 10:06, 나 : Welcome to RegExr 0.3b, an intuitive tool for learning, writing, and testing Regular Expressions. Key features include: 
www.google.com
* real time results: shows results as you type 
* code hinting: roll over your expression to see info on specific elements 
* detailed results: roll over a match to see details & view group info below 
* built in regex guide: double click entries to insert them into your expression 
* online & desktop: regexr.com or download the desktop version for Mac, Windows, or Linux 
* save your expressions: My Saved expressions are saved locally 
* search Comm https://google.us.edi?34535/534534?dfg=g&fg unity expressions and add your own 
* create Share Links to send your expressions to co-workers or link to them on Twitter or your blog [ex. http://RegExr.com?2rjl6] 

Built by gskinner.com with Flex 3 [adobe.com/go/flex] and Spelling Plus Library for text highlighting [gskinner.com/products/spl].`);

    expect(chat?.messages).toHaveLength(7);
    expect(chat?.messages[6]).toMatchObject({
      kind: "plain",
      username: "나",
      date: "2021-12-30",
      time: "22:06",
    });
    expect(chat?.messages[6]?.kind === "plain" && chat.messages[6].text).toContain(
      "https://google.us.edi?34535/534534?dfg=g&fg"
    );
  });
});

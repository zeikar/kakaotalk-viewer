import { describe, expect, test } from "vitest";
import { parseKakaoTalkText } from ".";

describe("parseKakaoTalkText", () => {
  test("parses Android exports with multiline messages", () => {
    const chat = parseKakaoTalkText(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


2021년 12월 29일 오후 8:36
2021년 12월 29일 오후 8:36, 테스트 : ㅎㅇ
이어지는 줄
2021년 12월 29일 오후 8:37, 나 : 반가워`);

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
          username: "테스트",
          date: "2021년 12월 29일",
          time: "20:36",
          text: "ㅎㅇ\n이어지는 줄",
        },
        {
          kind: "plain",
          username: "나",
          date: "2021년 12월 29일",
          time: "20:37",
          text: "반가워",
        },
      ],
    });
  });

  test("parses the former public Android sample", () => {
    const chat = parseKakaoTalkText(`테스트 님과 카카오톡 대화
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

    if (!chat) throw new Error("Expected Android sample to parse");

    expect(chat.roomName).toBe("테스트");
    expect(chat.users).toEqual(["테스트", "나"]);
    expect(chat.messages).toHaveLength(7);
    expect(chat.messages[5]).toEqual({
      kind: "notification",
      date: "2021년 12월 30일",
      text: "2021년 12월 30일",
    });
    expect(chat.messages[6]).toMatchObject({
      kind: "plain",
      username: "나",
      date: "2021년 12월 30일",
      time: "22:06",
    });
    expect(chat.messages[6]?.kind === "plain" && chat.messages[6].text).toContain(
      "https://google.us.edi?34535/534534?dfg=g&fg"
    );
  });

  test("parses Windows exports with notifications", () => {
    const chat = parseKakaoTalkText(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17

--------------- 2021년 12월 29일 수요일 ---------------
[테스트] [20:36] ㅎㅇ
테스트님이 나갔습니다.
[나] [20:37] 반가워`);

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
          username: "테스트",
          date: "2021년 12월 29일",
          time: "20:36",
          text: "ㅎㅇ",
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
      ],
    });
  });

  test("parses Mac CSV exports with quoted multiline messages", () => {
    const chat = parseKakaoTalkText(`Date,User,Message
2021-12-29 20:36:00,"테스트","ㅎㅇ
이어지는 줄"
2021-12-29 20:37:00,"나","반가워"
2021-12-29 20:38:00,"테스트","테스트 invited 나."`);

    expect(chat).toEqual({
      roomName: "테스트, 나",
      users: ["테스트", "나"],
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
          text: "ㅎㅇ\n이어지는 줄",
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
      ],
    });
  });
});

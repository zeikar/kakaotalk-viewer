import { describe, expect, test } from "vitest";
import { isIosExport, parseIos } from "./ios";

describe("isIosExport", () => {
  test("detects iOS message and notification lines", () => {
    expect(
      isIosExport(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17

2021년 12월 29일 수요일
오후 8:36, 테스트 : ㅎㅇ`)
    ).toBe(true);

    expect(
      isIosExport(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17

2021년 12월 29일 수요일
오후 8:37, 테스트님이 나갔습니다.`)
    ).toBe(true);

    expect(
      isIosExport(`Talk_2026.4.25 10:20-1.txt
Date Saved : Apr 25, 2026 at 10:38

Wednesday, December 31, 2014
Dec 31, 2014 at 19:12, 테스트 : hello`)
    ).toBe(true);

    expect(
      isIosExport(`Talk_2026.4.25 10:20-1.txt
Date Saved : Apr 25, 2026 at 10:38

Wednesday, December 31, 2014
Dec 31, 2014 at 19:12: 테스트 invited iPad .`)
    ).toBe(true);
  });

  test("rejects exports without iOS-style message lines", () => {
    expect(
      isIosExport(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17

2021년 12월 29일 수요일`)
    ).toBe(false);

    expect(
      isIosExport(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17

unexpected line`)
    ).toBe(false);
  });
});

describe("parseIos", () => {
  test("returns null for too-short exports", () => {
    expect(parseIos("one\ntwo\nthree\nfour")).toBeNull();
  });

  test("parses room names ending with 님과", () => {
    const chat = parseIos(`테스트 님과 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


2021년 12월 29일 수요일
오후 8:36, 테스트 : ㅎㅇ`);

    expect(chat?.roomName).toBe("테스트");
  });

  test("removes UTF-8 BOM from English export titles", () => {
    const chat = parseIos(`﻿Talk_2026.4.25 10:20-1.txt
Date Saved : Apr 25, 2026 at 10:38


Wednesday, December 31, 2014
Dec 31, 2014 at 19:12, 테스트 : hello`);

    expect(chat?.roomName).toBe("Talk_2026.4.25 10:20-1.txt");
  });

  test("parses messages, notifications, multiline text, and repeated dates", () => {
    const chat = parseIos(`팀 채팅방 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


2021년 12월 29일 수요일
오전 12:05,  : 시스템 알림
오후 8:36, 테스트 : ㅎㅇ
이어지는 줄
오후 8:37, 나 : 반가워
오후 8:38, 테스트님이 나갔습니다.

2021년 12월 29일 수요일
오후 8:39, 테스트 : 다시 말함
2021년 12월 30일 목요일
오전 12:00, 나 : 다음날`);

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
          time: "00:05",
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
        {
          kind: "plain",
          username: "테스트",
          date: "2021-12-29",
          time: "20:39",
          text: "다시 말함",
        },
        {
          kind: "date-header",
          date: "2021-12-30",
        },
        {
          kind: "plain",
          username: "나",
          date: "2021-12-30",
          time: "00:00",
          text: "다음날",
        },
      ],
    });
  });

  test("parses Korean iOS message lines with dot-form dates", () => {
    const chat = parseIos(`P2 님과 카카오톡 대화
저장한 날짜 : 2019. 7. 30. 오전 11:02


2019년 7월 30일 화요일
2019. 7. 30. 오전 10:22, P1 : 부먹? 찍먹?
2019. 7. 30. 오후 12:23, P2 : 전 솔직히 둘다 좋아해요`);

    expect(chat?.messages).toEqual([
      { kind: "date-header", date: "2019-07-30" },
      {
        kind: "plain",
        username: "P1",
        date: "2019-07-30",
        time: "10:22",
        text: "부먹? 찍먹?",
      },
      {
        kind: "plain",
        username: "P2",
        date: "2019-07-30",
        time: "12:23",
        text: "전 솔직히 둘다 좋아해요",
      },
    ]);
  });

  test("parses English iOS date headers, messages, and notifications", () => {
    const chat = parseIos(`Talk_2026.4.25 10:20-1.txt
Date Saved : Apr 25, 2026 at 10:38


Wednesday, December 31, 2014
Dec 31, 2014 at 19:12: 테스트 invited iPad .
Dec 31, 2014 at 19:12, 테스트 : hello
continued line

Tuesday, February 17, 2015
Feb 17, 2015 at 21:00, iPad : Photo
Feb 17, 2015 at 21:01: iPad left this chatroom.`);

    expect(chat).toEqual({
      roomName: "Talk_2026.4.25 10:20-1.txt",
      users: ["테스트", "iPad"],
      messages: [
        {
          kind: "date-header",
          date: "2014-12-31",
        },
        {
          kind: "notification",
          date: "2014-12-31",
          text: "테스트 invited iPad .",
        },
        {
          kind: "plain",
          username: "테스트",
          date: "2014-12-31",
          time: "19:12",
          text: "hello\ncontinued line",
        },
        {
          kind: "date-header",
          date: "2015-02-17",
        },
        {
          kind: "plain",
          username: "iPad",
          date: "2015-02-17",
          time: "21:00",
          text: "Photo",
        },
        {
          kind: "notification",
          date: "2015-02-17",
          text: "iPad left this chatroom.",
        },
      ],
    });
  });

  test("keeps colons in Korean iOS message text out of usernames", () => {
    const chat = parseIos(`팀 채팅방 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


2023년 3월 24일 금요일
오전 9:00, 테스트 : Day 1 : https://example.com/one
Day 2 : https://example.com/two`);

    expect(chat?.users).toEqual(["테스트"]);
    expect(chat?.messages[1]).toEqual({
      kind: "plain",
      username: "테스트",
      date: "2023-03-24",
      time: "09:00",
      text: "Day 1 : https://example.com/one\nDay 2 : https://example.com/two",
    });
  });

  test("keeps colons in English iOS message text out of usernames", () => {
    const chat = parseIos(`Talk_2026.4.25 10:20-1.txt
Date Saved : Apr 25, 2026 at 10:38


Friday, March 24, 2023
Mar 24, 2023 at 09:00, 테스트 : Day 1 : https://www.youtube.com/playlist?list=one
Day 2 : https://www.youtube.com/playlist?list=two`);

    expect(chat?.users).toEqual(["테스트"]);
    expect(chat?.messages[1]).toEqual({
      kind: "plain",
      username: "테스트",
      date: "2023-03-24",
      time: "09:00",
      text: "Day 1 : https://www.youtube.com/playlist?list=one\nDay 2 : https://www.youtube.com/playlist?list=two",
    });
  });

  test("ignores unmatched leading lines before the first plain message", () => {
    const chat = parseIos(`팀 채팅방 카카오톡 대화
저장한 날짜 : 2021년 12월 18일 오후 7:17


알 수 없는 줄
2021년 12월 29일 수요일
broken line
오후 8:37, 테스트 : 이후 메시지`);

    expect(chat).toEqual({
      roomName: "팀 채팅방",
      users: ["테스트"],
      messages: [
        {
          kind: "date-header",
          date: "2021-12-29",
        },
        {
          kind: "plain",
          username: "테스트",
          date: "2021-12-29",
          time: "20:37",
          text: "이후 메시지",
        },
      ],
    });
  });
});

import { describe, expect, test } from "vitest";
import { splitByUrls } from "./url";

describe("splitByUrls", () => {
  test("returns text as-is when there are no URLs", () => {
    expect(splitByUrls("hello kakao")).toEqual([
      { kind: "text", value: "hello kakao" },
    ]);
  });

  test("splits a single URL out of surrounding text", () => {
    expect(splitByUrls("open https://example.com now")).toEqual([
      { kind: "text", value: "open " },
      { kind: "url", value: "https://example.com" },
      { kind: "text", value: " now" },
    ]);
  });

  test("splits multiple URLs in one message", () => {
    expect(splitByUrls("a http://one.test b https://two.test/path?q=1 c")).toEqual([
      { kind: "text", value: "a " },
      { kind: "url", value: "http://one.test" },
      { kind: "text", value: " b " },
      { kind: "url", value: "https://two.test/path?q=1" },
      { kind: "text", value: " c" },
    ]);
  });
});

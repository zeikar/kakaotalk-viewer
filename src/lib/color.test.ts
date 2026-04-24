import { describe, expect, test } from "vitest";
import {
  generateColorByUserName,
  getTextColorByBackgroundColor,
} from "./color";

describe("generateColorByUserName", () => {
  test("returns a stable translucent hex color for the same username", () => {
    const color = generateColorByUserName("테스트");

    expect(generateColorByUserName("테스트")).toBe(color);
    expect(color).toMatch(/^#[0-9a-f]{8}$/);
  });
});

describe("getTextColorByBackgroundColor", () => {
  test("uses black text on bright backgrounds", () => {
    expect(getTextColorByBackgroundColor("#ffffff99")).toBe("#000000");
  });

  test("uses white text on dark backgrounds", () => {
    expect(getTextColorByBackgroundColor("#00000099")).toBe("#ffffff");
  });
});

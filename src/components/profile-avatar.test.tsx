import { describe, expect, test } from "vitest";
import { render } from "@testing-library/preact";
import { ProfileAvatar, ProfileAvatarPlaceholder } from "./profile-avatar";
import {
  generateColorByUserName,
  getTextColorByBackgroundColor,
} from "../lib/color";

describe("ProfileAvatar", () => {
  test("uses the first three characters of the username as uppercase initials", () => {
    const { container } = render(<ProfileAvatar username="alice" />);
    expect(container.querySelector("text")?.textContent).toBe("ALI");
  });

  test("applies color from generateColorByUserName for the background and matching text color", () => {
    const { container } = render(<ProfileAvatar username="bob" />);
    const bg = generateColorByUserName("bob");
    const fg = getTextColorByBackgroundColor(bg);
    expect(container.querySelector("path")?.getAttribute("fill")).toBe(bg);
    expect(container.querySelector("text")?.getAttribute("fill")).toBe(fg);
  });
});

describe("ProfileAvatarPlaceholder", () => {
  test("renders an empty reserved-width div", () => {
    const { container } = render(<ProfileAvatarPlaceholder />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName.toLowerCase()).toBe("div");
    expect(root.children.length).toBe(0);
  });
});

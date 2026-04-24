import { describe, expect, test } from "vitest";
import { render } from "@testing-library/preact";
import { NotificationRow } from "./notification-row";

describe("NotificationRow", () => {
  test("renders plain text without <mark> when query is empty", () => {
    const { container } = render(
      <NotificationRow text="User joined" searchQuery="" isCurrentMatch={false} />
    );
    expect(container.querySelector("mark")).toBeNull();
    expect(container).toHaveTextContent("User joined");
  });

  test("wraps matches in a <mark> with bg-blue-200 and text-black", () => {
    const { container } = render(
      <NotificationRow text="User joined" searchQuery="join" isCurrentMatch={false} />
    );
    const mark = container.querySelector("mark");
    expect(mark).toHaveTextContent("join");
    expect(mark).toHaveClass("bg-blue-200");
    expect(mark).toHaveClass("text-black");
  });

  test("applies blue ring on the pill when isCurrentMatch is true", () => {
    const { container } = render(
      <NotificationRow text="hi" searchQuery="" isCurrentMatch={true} />
    );
    const pill = container.querySelector(".bg-kakao-timestamp");
    expect(pill).toHaveClass("ring-2");
    expect(pill).toHaveClass("ring-blue-500");
  });

  test("omits the ring when isCurrentMatch is false", () => {
    const { container } = render(
      <NotificationRow text="hi" searchQuery="" isCurrentMatch={false} />
    );
    const pill = container.querySelector(".bg-kakao-timestamp");
    expect(pill).not.toHaveClass("ring-2");
  });
});

import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { NotificationRow } from "./notification-row";

describe("NotificationRow", () => {
  test("renders plain text without <mark> when query is empty", () => {
    const { container } = render(
      <NotificationRow
        text="User joined"
        date="2026년 4월 25일"
        searchQuery=""
        isCurrentMatch={false}
      />
    );
    expect(container.querySelector("mark")).toBeNull();
    expect(container).toHaveTextContent("User joined");
  });

  test("wraps matches in a <mark> with bg-blue-200 and text-black", () => {
    const { container } = render(
      <NotificationRow
        text="User joined"
        date="2026년 4월 25일"
        searchQuery="join"
        isCurrentMatch={false}
      />
    );
    const mark = container.querySelector("mark");
    expect(mark).toHaveTextContent("join");
    expect(mark).toHaveClass("bg-blue-200");
    expect(mark).toHaveClass("text-black");
  });

  test("applies blue ring on the pill when isCurrentMatch is true", () => {
    const { container } = render(
      <NotificationRow
        text="hi"
        date="2026년 4월 25일"
        searchQuery=""
        isCurrentMatch={true}
      />
    );
    const pill = container.querySelector(".bg-kakao-timestamp");
    expect(pill).toHaveClass("ring-2");
    expect(pill).toHaveClass("ring-blue-500");
  });

  test("omits the ring when isCurrentMatch is false", () => {
    const { container } = render(
      <NotificationRow
        text="hi"
        date="2026년 4월 25일"
        searchQuery=""
        isCurrentMatch={false}
      />
    );
    const pill = container.querySelector(".bg-kakao-timestamp");
    expect(pill).not.toHaveClass("ring-2");
  });

  test("makes the date pill a button when text equals date and onDateClick is given", () => {
    const onDateClick = vi.fn();
    render(
      <NotificationRow
        text="2026년 4월 25일"
        date="2026년 4월 25일"
        searchQuery=""
        isCurrentMatch={false}
        onDateClick={onDateClick}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "2026년 4월 25일로 이동" }));
    expect(onDateClick).toHaveBeenCalledWith("2026년 4월 25일");
  });

  test("does not render a button for non-date notifications", () => {
    const { container } = render(
      <NotificationRow
        text="User joined"
        date="2026년 4월 25일"
        searchQuery=""
        isCurrentMatch={false}
        onDateClick={() => {}}
      />
    );
    expect(container.querySelector("button")).toBeNull();
  });
});

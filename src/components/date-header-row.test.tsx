import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { DateHeaderRow } from "./date-header-row";

describe("DateHeaderRow", () => {
  test("renders the Korean-formatted date", () => {
    const { container } = render(<DateHeaderRow date="2026-04-25" />);
    expect(container).toHaveTextContent("2026년 4월 25일");
  });

  test("renders without a button when onDateClick is not provided", () => {
    const { container } = render(<DateHeaderRow date="2026-04-25" />);
    expect(container.querySelector("button")).toBeNull();
  });

  test("invokes onDateClick with the ISO date when clicked", () => {
    const onDateClick = vi.fn();
    render(<DateHeaderRow date="2026-04-25" onDateClick={onDateClick} />);
    fireEvent.click(
      screen.getByRole("button", { name: "2026년 4월 25일로 이동" })
    );
    expect(onDateClick).toHaveBeenCalledWith("2026-04-25");
  });
});

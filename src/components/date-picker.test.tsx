import { afterEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { DatePicker } from "./date-picker";

function makeProps(overrides: Partial<Parameters<typeof DatePicker>[0]> = {}) {
  return {
    dateIndex: new Map<string, number>(),
    oldestIndex: null as number | null,
    recentIndex: null as number | null,
    initialDate: null as string | null,
    onPick: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };
}

describe("DatePicker", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("opens at the month derived from initialDate", () => {
    render(<DatePicker {...makeProps({ initialDate: "2024-03-15" })} />);
    expect(screen.getByRole("heading")).toHaveTextContent("2024년 3월");
  });

  test("falls back to the latest date in dateIndex when initialDate is null", () => {
    render(
      <DatePicker
        {...makeProps({
          dateIndex: new Map([
            ["2023-12-29", 0],
            ["2024-03-15", 5],
          ]),
          oldestIndex: 0,
          recentIndex: 5,
        })}
      />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("2024년 3월");
  });

  test("falls back to the current month when there is no data", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-25T12:00:00"));
    render(<DatePicker {...makeProps()} />);
    expect(screen.getByRole("heading")).toHaveTextContent("2026년 4월");
  });

  test("clicking a day with messages calls onPick with that day's index", () => {
    const onPick = vi.fn();
    render(
      <DatePicker
        {...makeProps({
          dateIndex: new Map([["2024-03-15", 7]]),
          oldestIndex: 7,
          recentIndex: 7,
          initialDate: "2024-03-15",
          onPick,
        })}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "15" }));
    expect(onPick).toHaveBeenCalledWith(7);
  });

  test("days without messages are disabled and do not call onPick", () => {
    const onPick = vi.fn();
    render(
      <DatePicker
        {...makeProps({
          dateIndex: new Map([["2024-03-15", 7]]),
          initialDate: "2024-03-15",
          onPick,
        })}
      />
    );
    const dayOne = screen.getByRole("button", { name: "1" });
    expect(dayOne).toBeDisabled();
    fireEvent.click(dayOne);
    expect(onPick).not.toHaveBeenCalled();
  });

  test("the focused day (matching initialDate) shows the filled circle", () => {
    render(
      <DatePicker
        {...makeProps({
          dateIndex: new Map([["2024-03-15", 7]]),
          initialDate: "2024-03-15",
        })}
      />
    );
    const cell = screen.getByRole("button", { name: "15" });
    expect(cell.querySelector("span")).toHaveClass("bg-black");
  });

  test("next-month button advances the displayed month", () => {
    render(<DatePicker {...makeProps({ initialDate: "2024-03-15" })} />);
    fireEvent.click(screen.getByRole("button", { name: "다음 달" }));
    expect(screen.getByRole("heading")).toHaveTextContent("2024년 4월");
  });

  test("prev-month button rewinds across the year boundary", () => {
    render(<DatePicker {...makeProps({ initialDate: "2024-01-15" })} />);
    fireEvent.click(screen.getByRole("button", { name: "이전 달" }));
    expect(screen.getByRole("heading")).toHaveTextContent("2023년 12월");
  });

  test("next-month button rolls over from December to January", () => {
    render(<DatePicker {...makeProps({ initialDate: "2024-12-15" })} />);
    fireEvent.click(screen.getByRole("button", { name: "다음 달" }));
    expect(screen.getByRole("heading")).toHaveTextContent("2025년 1월");
  });

  test("맨 처음 / 맨 끝 invoke onPick with the supplied indexes", () => {
    const onPick = vi.fn();
    render(
      <DatePicker
        {...makeProps({ oldestIndex: 3, recentIndex: 9, onPick })}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "맨 처음" }));
    expect(onPick).toHaveBeenLastCalledWith(3);
    fireEvent.click(screen.getByRole("button", { name: "맨 끝" }));
    expect(onPick).toHaveBeenLastCalledWith(9);
  });

  test("맨 처음 / 맨 끝 are disabled when there are no messages", () => {
    render(<DatePicker {...makeProps()} />);
    expect(screen.getByRole("button", { name: "맨 처음" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "맨 끝" })).toBeDisabled();
  });

  test("close button and backdrop click both invoke onClose", () => {
    const onClose = vi.fn();
    const { container } = render(<DatePicker {...makeProps({ onClose })} />);
    fireEvent.click(screen.getByRole("button", { name: "달력 닫기" }));
    fireEvent.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("clicking inside the card does not close the picker", () => {
    const onClose = vi.fn();
    render(
      <DatePicker {...makeProps({ initialDate: "2024-03-15", onClose })} />
    );
    fireEvent.click(screen.getByRole("heading"));
    expect(onClose).not.toHaveBeenCalled();
  });
});

import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { SearchBar } from "./search-bar";

function makeProps(overrides: Partial<Parameters<typeof SearchBar>[0]> = {}) {
  return {
    query: "",
    onQueryChange: vi.fn(),
    matchCount: 0,
    currentIndex: 0,
    onNext: vi.fn(),
    onPrev: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };
}

describe("SearchBar", () => {
  test("binds the query value to the input and autofocuses it", () => {
    render(<SearchBar {...makeProps({ query: "hello" })} />);
    const input = screen.getByPlaceholderText("메시지 검색") as HTMLInputElement;
    expect(input.value).toBe("hello");
    expect(input).toHaveFocus();
  });

  test('shows "0/0" and disables nav buttons when there are no matches', () => {
    render(<SearchBar {...makeProps({ matchCount: 0, currentIndex: 0 })} />);
    expect(screen.getByText("0/0")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전 매칭" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음 매칭" })).toBeDisabled();
  });

  test("shows 1-based counter when matches exist", () => {
    render(<SearchBar {...makeProps({ matchCount: 5, currentIndex: 0 })} />);
    expect(screen.getByText("1/5")).toBeInTheDocument();
  });

  test("calls onPrev / onNext / onClose when their buttons are clicked", () => {
    const props = makeProps({ matchCount: 2, currentIndex: 0 });
    render(<SearchBar {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "이전 매칭" }));
    fireEvent.click(screen.getByRole("button", { name: "다음 매칭" }));
    fireEvent.click(screen.getByRole("button", { name: "검색 닫기" }));
    expect(props.onPrev).toHaveBeenCalledTimes(1);
    expect(props.onNext).toHaveBeenCalledTimes(1);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  test("emits onQueryChange on input", () => {
    const props = makeProps();
    render(<SearchBar {...props} />);
    fireEvent.input(screen.getByPlaceholderText("메시지 검색"), {
      target: { value: "안녕" },
    });
    expect(props.onQueryChange).toHaveBeenCalledWith("안녕");
  });

  test("Enter triggers onNext", () => {
    const props = makeProps({ matchCount: 1 });
    render(<SearchBar {...props} />);
    fireEvent.keyDown(screen.getByPlaceholderText("메시지 검색"), { key: "Enter" });
    expect(props.onNext).toHaveBeenCalledTimes(1);
    expect(props.onPrev).not.toHaveBeenCalled();
  });

  test("Shift+Enter triggers onPrev", () => {
    const props = makeProps({ matchCount: 1 });
    render(<SearchBar {...props} />);
    fireEvent.keyDown(screen.getByPlaceholderText("메시지 검색"), {
      key: "Enter",
      shiftKey: true,
    });
    expect(props.onPrev).toHaveBeenCalledTimes(1);
    expect(props.onNext).not.toHaveBeenCalled();
  });

  test("Escape triggers onClose", () => {
    const props = makeProps();
    render(<SearchBar {...props} />);
    fireEvent.keyDown(screen.getByPlaceholderText("메시지 검색"), { key: "Escape" });
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});

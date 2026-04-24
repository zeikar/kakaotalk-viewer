import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { Header } from "./header";

describe("Header", () => {
  test("renders the provided title", () => {
    render(
      <Header title="채팅방 (3)" onOpenMenu={() => {}} onToggleSearch={() => {}} />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("채팅방 (3)");
  });

  test("fires onToggleSearch when the search button is clicked", () => {
    const onToggleSearch = vi.fn();
    render(
      <Header title="t" onOpenMenu={() => {}} onToggleSearch={onToggleSearch} />
    );
    fireEvent.click(screen.getByRole("button", { name: "검색 열기" }));
    expect(onToggleSearch).toHaveBeenCalledTimes(1);
  });

  test("fires onOpenMenu when the menu button is clicked", () => {
    const onOpenMenu = vi.fn();
    render(
      <Header title="t" onOpenMenu={onOpenMenu} onToggleSearch={() => {}} />
    );
    fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });
});

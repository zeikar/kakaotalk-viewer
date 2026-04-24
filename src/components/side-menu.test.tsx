import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { SideMenu } from "./side-menu";

describe("SideMenu", () => {
  test("is visible and slid into view when open=true", () => {
    const { container } = render(<SideMenu open={true} onClose={() => {}} />);
    const overlay = container.querySelector("[aria-hidden='true']");
    const panel = container.querySelector("aside");
    expect(overlay).toHaveClass("visible");
    expect(panel).toHaveClass("translate-x-0");
  });

  test("is hidden and off-screen when open=false", () => {
    const { container } = render(<SideMenu open={false} onClose={() => {}} />);
    const overlay = container.querySelector("[aria-hidden='true']");
    const panel = container.querySelector("aside");
    expect(overlay).toHaveClass("invisible");
    expect(panel).toHaveClass("translate-x-full");
  });

  test("fires onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<SideMenu open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "메뉴 닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("fires onClose when the backdrop overlay is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(<SideMenu open={true} onClose={onClose} />);
    const overlay = container.querySelector("[aria-hidden='true']") as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("exposes a GitHub link with the project URL", () => {
    render(<SideMenu open={true} onClose={() => {}} />);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", "https://github.com/zeikar/kakaotalk-viewer");
  });
});

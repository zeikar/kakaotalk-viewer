import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { PlainMessageBody } from "./plain-message-body";

describe("PlainMessageBody", () => {
  test("renders plain text without <mark> when query is empty", () => {
    const { container } = render(
      <PlainMessageBody text="안녕 카카오" searchQuery="" />
    );
    expect(container.querySelector("mark")).toBeNull();
    expect(container).toHaveTextContent("안녕 카카오");
  });

  test("wraps matching text in a <mark> with bg-blue-200", () => {
    const { container } = render(
      <PlainMessageBody text="안녕 카카오" searchQuery="카카오" />
    );
    const mark = container.querySelector("mark");
    expect(mark).not.toBeNull();
    expect(mark).toHaveTextContent("카카오");
    expect(mark).toHaveClass("bg-blue-200");
  });

  test("renders URLs as anchors with the URL as href", () => {
    render(
      <PlainMessageBody
        text="go https://example.com now"
        searchQuery=""
      />
    );
    const anchor = screen.getByRole("link");
    expect(anchor).toHaveAttribute("href", "https://example.com");
    expect(anchor).toHaveAttribute("target", "_blank");
  });

  test("highlights matches inside URL anchors too", () => {
    const { container } = render(
      <PlainMessageBody
        text="see https://example.com/hello world"
        searchQuery="example"
      />
    );
    const anchor = container.querySelector("a");
    expect(anchor?.querySelector("mark")).not.toBeNull();
    expect(anchor?.querySelector("mark")).toHaveTextContent("example");
  });

  test("matches case-insensitively but preserves original casing", () => {
    const { container } = render(
      <PlainMessageBody text="Hello World" searchQuery="hello" />
    );
    const mark = container.querySelector("mark");
    expect(mark).toHaveTextContent("Hello");
  });

  test("renders @username mentions as clickable blue buttons", () => {
    const onSelectUser = vi.fn();
    render(
      <PlainMessageBody
        text="안녕 @수아"
        searchQuery=""
        users={["수아"]}
        onSelectUser={onSelectUser}
      />
    );

    const mention = screen.getByRole("button", { name: "@수아" });
    expect(mention).toHaveClass("text-blue-700");

    fireEvent.click(mention);

    expect(onSelectUser).toHaveBeenCalledWith("수아");
  });

  test("supports braced mentions for names with spaces", () => {
    const onSelectUser = vi.fn();
    render(
      <PlainMessageBody
        text="안녕 @{수아 친구}"
        searchQuery=""
        users={["수아 친구"]}
        onSelectUser={onSelectUser}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "@{수아 친구}" }));

    expect(onSelectUser).toHaveBeenCalledWith("수아 친구");
  });
});

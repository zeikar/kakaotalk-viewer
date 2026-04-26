import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { SelectableUserText } from "./selectable-user-text";

describe("SelectableUserText", () => {
  test("renders known mentions as clickable blue buttons", () => {
    const onSelectUser = vi.fn();
    render(
      <SelectableUserText
        text="안녕 @수아"
        searchQuery=""
        users={["수아"]}
        mode="mention"
        onSelectUser={onSelectUser}
      />
    );

    const mention = screen.getByRole("button", { name: "@수아" });
    expect(mention).toHaveClass("text-blue-700");

    fireEvent.click(mention);

    expect(onSelectUser).toHaveBeenCalledWith("수아");
  });

  test("supports braced mentions", () => {
    const onSelectUser = vi.fn();
    render(
      <SelectableUserText
        text="@{수아 친구} 확인"
        searchQuery=""
        users={["수아 친구"]}
        mode="mention"
        onSelectUser={onSelectUser}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "@{수아 친구}" }));

    expect(onSelectUser).toHaveBeenCalledWith("수아 친구");
  });

  test("prefers the longest username when mentions overlap", () => {
    const onSelectUser = vi.fn();
    render(
      <SelectableUserText
        text="@수아"
        searchQuery=""
        users={["수", "수아"]}
        mode="mention"
        onSelectUser={onSelectUser}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "@수아" }));

    expect(onSelectUser).toHaveBeenCalledWith("수아");
  });

  test("does not render unknown mentions as buttons", () => {
    render(
      <SelectableUserText
        text="안녕 @수아"
        searchQuery=""
        users={["나"]}
        mode="mention"
        onSelectUser={() => {}}
      />
    );

    expect(screen.queryByRole("button", { name: "@수아" })).toBeNull();
  });

  test("does not match mentions embedded in another token", () => {
    render(
      <SelectableUserText
        text="mail@수아"
        searchQuery=""
        users={["수아"]}
        mode="mention"
        onSelectUser={() => {}}
      />
    );

    expect(screen.queryByRole("button", { name: "@수아" })).toBeNull();
  });

  test("renders Korean notification users as underlined buttons", () => {
    const onSelectUser = vi.fn();
    render(
      <SelectableUserText
        text="테스트님이 수아님을 초대하였습니다."
        searchQuery=""
        users={["테스트", "수아"]}
        mode="notification"
        onSelectUser={onSelectUser}
      />
    );

    expect(screen.getByRole("button", { name: "테스트" })).toHaveClass(
      "underline"
    );

    fireEvent.click(screen.getByRole("button", { name: "테스트" }));
    fireEvent.click(screen.getByRole("button", { name: "수아" }));

    expect(onSelectUser).toHaveBeenNthCalledWith(1, "테스트");
    expect(onSelectUser).toHaveBeenNthCalledWith(2, "수아");
  });

  test("renders English notification users as buttons only when they are known", () => {
    const onSelectUser = vi.fn();
    render(
      <SelectableUserText
        text="수아 joined this chatroom."
        searchQuery=""
        users={["수아"]}
        mode="notification"
        onSelectUser={onSelectUser}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "수아" }));

    expect(onSelectUser).toHaveBeenCalledWith("수아");
  });

  test("does not render unknown notification users as buttons", () => {
    render(
      <SelectableUserText
        text="수아 joined this chatroom."
        searchQuery=""
        users={["나"]}
        mode="notification"
        onSelectUser={() => {}}
      />
    );

    expect(screen.queryByRole("button", { name: "수아" })).toBeNull();
  });

  test("does not render casual username text as a notification button", () => {
    render(
      <SelectableUserText
        text="오늘 수아님과 대화했습니다."
        searchQuery=""
        users={["수아"]}
        mode="notification"
        onSelectUser={() => {}}
      />
    );

    expect(screen.queryByRole("button", { name: "수아" })).toBeNull();
  });

  test("keeps search highlights inside selectable users", () => {
    const { container } = render(
      <SelectableUserText
        text="@수아"
        searchQuery="수아"
        users={["수아"]}
        mode="mention"
        onSelectUser={() => {}}
      />
    );

    const mark = container.querySelector("button mark");
    expect(mark).toHaveTextContent("수아");
    expect(mark).toHaveClass("bg-blue-200");
  });
});

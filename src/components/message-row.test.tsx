import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { MessageRow } from "./message-row";
import type { Message } from "../types";

const plain = (overrides: Partial<Extract<Message, { kind: "plain" }>> = {}): Message => ({
  kind: "plain",
  username: "alice",
  date: "2024-01-01",
  time: "12:00",
  text: "hello",
  ...overrides,
});

const baseProps = {
  users: ["alice"],
  isMine: false,
  isFirst: true,
  isLast: true,
  onSelectOwner: () => {},
  onSelectUser: () => {},
  searchQuery: "",
  isCurrentMatch: false,
};

describe("MessageRow", () => {
  test("routes notification messages to NotificationRow", () => {
    const { container } = render(
      <MessageRow
        {...baseProps}
        message={{ kind: "notification", date: "2024-01-01", text: "hi there" }}
      />
    );
    expect(container.querySelector(".bg-kakao-timestamp")).not.toBeNull();
    expect(container).toHaveTextContent("hi there");
  });

  test("my message bubble uses kakao-yellow and reverses row direction without avatar", () => {
    const { container } = render(
      <MessageRow {...baseProps} isMine={true} message={plain()} />
    );
    expect(container.querySelector(".bg-kakao-yellow")).not.toBeNull();
    expect(container.querySelector(".flex-row-reverse")).not.toBeNull();
    expect(container.querySelector("svg")).toBeNull(); // no avatar
  });

  test("first message from another user shows avatar, display name, and left tail", () => {
    const { container } = render(
      <MessageRow {...baseProps} isFirst={true} message={plain({ username: "alice" })} />
    );
    expect(container.querySelector("svg")).not.toBeNull(); // avatar
    expect(screen.getByText("alice")).toBeInTheDocument();
    expect(container.querySelector(".bubble-tail-left")).not.toBeNull();
  });

  test("continuation message from another user shows placeholder and no tail", () => {
    const { container } = render(
      <MessageRow {...baseProps} isFirst={false} message={plain()} />
    );
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector(".bubble-tail-left")).toBeNull();
  });

  test("first my-message uses the right-side tail", () => {
    const { container } = render(
      <MessageRow {...baseProps} isMine={true} isFirst={true} message={plain()} />
    );
    expect(container.querySelector(".bubble-tail-right")).not.toBeNull();
  });

  test("last message shows the time and uses larger bottom padding", () => {
    const { container } = render(
      <MessageRow
        {...baseProps}
        isLast={true}
        message={plain({ time: "09:30" })}
      />
    );
    expect(screen.getByText("09:30")).toBeInTheDocument();
    expect(container.querySelector(".pb-2\\.5")).not.toBeNull();
  });

  test("non-last message hides time and uses the smaller bottom padding", () => {
    const { container } = render(
      <MessageRow
        {...baseProps}
        isLast={false}
        message={plain({ time: "09:30" })}
      />
    );
    expect(screen.queryByText("09:30")).toBeNull();
    expect(container.querySelector(".pb-1\\.5")).not.toBeNull();
  });

  test("applies the blue ring on the bubble when isCurrentMatch is true", () => {
    const { container } = render(
      <MessageRow {...baseProps} isCurrentMatch={true} message={plain()} />
    );
    expect(container.querySelector(".ring-blue-500")).not.toBeNull();
  });

  test("falls back to '알 수 없음' when username is blank", () => {
    render(
      <MessageRow
        {...baseProps}
        isFirst={true}
        message={plain({ username: "   " })}
      />
    );
    expect(screen.getByText("알 수 없음")).toBeInTheDocument();
  });

  test("select messages render SelectMessageBody and forward onSelectOwner", () => {
    const onSelectOwner = vi.fn();
    render(
      <MessageRow
        {...baseProps}
        onSelectOwner={onSelectOwner}
        message={{
          kind: "select",
          username: "sys",
          date: "2024-01-01",
          time: "12:00",
          options: ["alice", "bob"],
        }}
      />
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "bob" } });
    expect(onSelectOwner).toHaveBeenCalledWith("bob");
  });

  test("clicking another user's name or avatar forwards onSelectUser", () => {
    const onSelectUser = vi.fn();
    render(
      <MessageRow
        {...baseProps}
        onSelectUser={onSelectUser}
        isFirst={true}
        message={plain({ username: "alice" })}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "alice" }));
    fireEvent.click(screen.getByRole("button", { name: "alice 메시지 필터" }));
    expect(onSelectUser).toHaveBeenCalledTimes(2);
    expect(onSelectUser).toHaveBeenNthCalledWith(1, "alice");
    expect(onSelectUser).toHaveBeenNthCalledWith(2, "alice");
  });

  test("clicking a mention in a message forwards onSelectUser", () => {
    const onSelectUser = vi.fn();
    render(
      <MessageRow
        {...baseProps}
        onSelectUser={onSelectUser}
        message={plain({ text: "hello @alice" })}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "@alice" }));

    expect(onSelectUser).toHaveBeenCalledWith("alice");
  });

  test("clicking a username in a notification forwards onSelectUser", () => {
    const onSelectUser = vi.fn();
    render(
      <MessageRow
        {...baseProps}
        onSelectUser={onSelectUser}
        message={{
          kind: "notification",
          date: "2024-01-01",
          text: "alice joined this chatroom.",
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "alice" }));

    expect(onSelectUser).toHaveBeenCalledWith("alice");
  });
});

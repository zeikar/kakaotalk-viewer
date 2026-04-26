import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
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
      <NotificationRow
        text="User joined"
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

  test("renders a joined username as an underlined button", () => {
    const onSelectUser = vi.fn();
    render(
      <NotificationRow
        text="수아 joined this chatroom."
        searchQuery=""
        isCurrentMatch={false}
        users={["수아"]}
        onSelectUser={onSelectUser}
      />
    );

    const username = screen.getByRole("button", { name: "수아" });
    expect(username).toHaveClass("underline");

    fireEvent.click(username);

    expect(onSelectUser).toHaveBeenCalledWith("수아");
  });

  test("renders Korean system usernames as buttons", () => {
    const onSelectUser = vi.fn();
    render(
      <NotificationRow
        text="테스트님이 수아님을 초대하였습니다."
        searchQuery=""
        isCurrentMatch={false}
        users={["테스트", "수아"]}
        onSelectUser={onSelectUser}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "테스트" }));
    fireEvent.click(screen.getByRole("button", { name: "수아" }));

    expect(onSelectUser).toHaveBeenNthCalledWith(1, "테스트");
    expect(onSelectUser).toHaveBeenNthCalledWith(2, "수아");
  });

  test("does not make names clickable when they are not in the user list", () => {
    render(
      <NotificationRow
        text="Stewie left this chatroom."
        searchQuery=""
        isCurrentMatch={false}
        users={[]}
        onSelectUser={() => {}}
      />
    );

    expect(screen.queryByRole("button", { name: "Stewie" })).toBeNull();
  });
});

import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { SideMenu } from "./side-menu";

describe("SideMenu", () => {
  test("is visible and slid into view when open=true", () => {
    const { container } = render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={[]}
        onSelectUser={() => {}}
      />
    );
    const overlay = container.querySelector("[aria-hidden='true']");
    const panel = container.querySelector("aside");
    expect(overlay).toHaveClass("visible");
    expect(panel).toHaveClass("translate-x-0");
  });

  test("is hidden and off-screen when open=false", () => {
    const { container } = render(
      <SideMenu
        open={false}
        onClose={() => {}}
        users={[]}
        onSelectUser={() => {}}
      />
    );
    const overlay = container.querySelector("[aria-hidden='true']");
    const panel = container.querySelector("aside");
    expect(overlay).toHaveClass("invisible");
    expect(panel).toHaveClass("translate-x-full");
  });

  test("fires onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <SideMenu
        open={true}
        onClose={onClose}
        users={[]}
        onSelectUser={() => {}}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "메뉴 닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("fires onClose when the backdrop overlay is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <SideMenu
        open={true}
        onClose={onClose}
        users={[]}
        onSelectUser={() => {}}
      />
    );
    const overlay = container.querySelector("[aria-hidden='true']") as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("exposes a GitHub link with the project URL", () => {
    render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={[]}
        onSelectUser={() => {}}
      />
    );
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", "https://github.com/zeikar/kakaotalk-viewer");
  });

  test("renders the participants section with each name and the count", () => {
    render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={["나", "수아", "테스트"]}
        onSelectUser={() => {}}
      />
    );
    expect(screen.getByText("참여자 (3)")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("나");
    expect(items[1]).toHaveTextContent("수아");
    expect(items[2]).toHaveTextContent("테스트");
  });

  test("renders the selected owner at the top of the participant list", () => {
    render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={["나", "수아", "테스트"]}
        owner="테스트"
        onSelectUser={() => {}}
      />
    );

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("테스트");
    expect(items[1]).toHaveTextContent("나");
    expect(items[2]).toHaveTextContent("수아");
  });

  test("renders a me chip only for the selected owner", () => {
    render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={["나", "수아", "테스트"]}
        owner="수아"
        onSelectUser={() => {}}
      />
    );

    const items = screen.getAllByRole("listitem");
    expect(screen.getByLabelText("me")).toBeInTheDocument();
    expect(items[0]).toHaveTextContent("수아");
    expect(items[1]).not.toHaveTextContent("me");
    expect(items[2]).not.toHaveTextContent("me");
  });

  test("hides the participants section when users is empty", () => {
    render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={[]}
        onSelectUser={() => {}}
      />
    );
    expect(screen.queryByText(/^참여자/)).not.toBeInTheDocument();
  });

  test("fires onSelectUser when a participant is clicked", () => {
    const onSelectUser = vi.fn();
    render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={["나", "수아"]}
        onSelectUser={onSelectUser}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /수아/ }));
    expect(onSelectUser).toHaveBeenCalledWith("수아");
  });

  test("filters participants by search input", () => {
    render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={["나", "수아", "테스트"]}
        onSelectUser={() => {}}
      />
    );

    fireEvent.input(screen.getByRole("searchbox", { name: "참여자 검색" }), {
      target: { value: "수" },
    });

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("button", { name: /수아/ })).toBeInTheDocument();
    expect(screen.queryByText("나")).not.toBeInTheDocument();
  });

  test("keeps the selected owner first within participant search results", () => {
    render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={["테스트1", "수아", "테스트2"]}
        owner="테스트2"
        onSelectUser={() => {}}
      />
    );

    fireEvent.input(screen.getByRole("searchbox", { name: "참여자 검색" }), {
      target: { value: "테스트" },
    });

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("테스트2");
    expect(items[1]).toHaveTextContent("테스트1");
  });

  test("shows an empty state when participant search has no matches", () => {
    render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={["나", "수아"]}
        onSelectUser={() => {}}
      />
    );

    fireEvent.input(screen.getByRole("searchbox", { name: "참여자 검색" }), {
      target: { value: "테스트" },
    });

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.getByText("일치하는 참여자가 없습니다.")).toBeInTheDocument();
  });

  test("clears participant search when the menu closes", () => {
    const { rerender } = render(
      <SideMenu
        open={true}
        onClose={() => {}}
        users={["나", "수아"]}
        onSelectUser={() => {}}
      />
    );

    const input = screen.getByRole("searchbox", {
      name: "참여자 검색",
    }) as HTMLInputElement;
    fireEvent.input(input, { target: { value: "수" } });

    rerender(
      <SideMenu
        open={false}
        onClose={() => {}}
        users={["나", "수아"]}
        onSelectUser={() => {}}
      />
    );

    expect(input.value).toBe("");
  });
});

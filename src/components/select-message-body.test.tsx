import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";
import { SelectMessageBody } from "./select-message-body";

describe("SelectMessageBody", () => {
  test("renders each non-empty option", () => {
    render(<SelectMessageBody options={["alice", "bob"]} onSelect={() => {}} />);
    expect(screen.getByRole("option", { name: "alice" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "bob" })).toBeInTheDocument();
  });

  test("filters out whitespace-only and empty options", () => {
    const { container } = render(
      <SelectMessageBody options={["alice", "", "   ", "bob"]} onSelect={() => {}} />
    );
    const optionValues = Array.from(container.querySelectorAll("option"))
      .map((o) => o.value)
      .filter((v) => v !== ""); // drop the hidden placeholder
    expect(optionValues).toEqual(["alice", "bob"]);
  });

  test("fires onSelect with the chosen value", () => {
    const onSelect = vi.fn();
    render(<SelectMessageBody options={["alice", "bob"]} onSelect={onSelect} />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "alice" } });
    expect(onSelect).toHaveBeenCalledWith("alice");
  });
});

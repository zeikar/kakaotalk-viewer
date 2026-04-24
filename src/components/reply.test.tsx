import { describe, expect, test, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { Reply } from "./reply";

describe("Reply", () => {
  test("fires onFile with the selected file on input change", () => {
    const onFile = vi.fn();
    const { container } = render(<Reply onFile={onFile} />);
    const input = container.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["chat"], "chat.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFile).toHaveBeenCalledWith(file);
  });

  test("does not fire onFile when no file is picked", () => {
    const onFile = vi.fn();
    const { container } = render(<Reply onFile={onFile} />);
    const input = container.querySelector("input[type='file']") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [] } });
    expect(onFile).not.toHaveBeenCalled();
  });
});

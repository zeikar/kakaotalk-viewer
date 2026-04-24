import { afterEach, describe, expect, test, vi } from "vitest";
import { readFile } from "./read-file";

class FileReaderMock {
  static error: Error | null = null;
  static result = "";

  error: Error | null = null;
  onerror: (() => void) | null = null;
  onload: (() => void) | null = null;
  result: string | null = null;

  readAsText() {
    this.error = FileReaderMock.error;
    this.result = FileReaderMock.result;

    if (this.error) {
      this.onerror?.();
    } else {
      this.onload?.();
    }
  }
}

describe("readFile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    FileReaderMock.error = null;
    FileReaderMock.result = "";
  });

  test("resolves text loaded by FileReader", async () => {
    FileReaderMock.result = "hello";
    vi.stubGlobal("FileReader", FileReaderMock);

    await expect(readFile(new File([], "test.txt"))).resolves.toBe("hello");
  });

  test("rejects FileReader errors", async () => {
    const error = new Error("read failed");
    FileReaderMock.error = error;
    vi.stubGlobal("FileReader", FileReaderMock);

    await expect(readFile(new File([], "test.txt"))).rejects.toBe(error);
  });
});

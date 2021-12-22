import { Message } from "./message.js";

export class SelectMessage extends Message {
  constructor(username, date, time, options, callback) {
    super(username, date, time, "");
    this.options = options;
    this.callback = callback;
  }

  createCoreDomElement() {
    const options = this.options.map((option) => `<option>${option}</option>`);
    options.unshift(`<option>-</option>`);
    options.push(`<option value="">선택 안 함</option>`);

    const select = document.createElement("select");
    select.innerHTML = options.join("");
    select.addEventListener("change", () => {
      this.callback(select.value);
    });
    return select;
  }
}

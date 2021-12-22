import { Message } from "./message.js";

export class PlainMessage extends Message {
  constructor(username, date, time, text) {
    super(username, date, time, text);
  }

  createCoreDomElement() {    
    const text = document.createElement("span");
    text.innerText = this.text;
    return text;
  }
}

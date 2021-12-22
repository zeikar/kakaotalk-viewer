import { Message } from "./message.js";

export class NotificationMessage extends Message {
  constructor(date, text) {
    super("", date, "", text);
  }

  createContainerDomElement(coreDomElement) {
    const container = document.createElement("div");
    container.classList.add("chat__timestamp");
    container.appendChild(coreDomElement);
    return container;
  }

  createCoreDomElement() {
    const text = document.createElement("span");
    text.innerText = this.text;
    return text;
  }
}

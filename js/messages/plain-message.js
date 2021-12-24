import { Message } from "./message.js";
import { captureUrls } from "./regex.js";

export class PlainMessage extends Message {
  constructor(username, date, time, text) {
    super(username, date, time, text);
  }

  createCoreDomElement() {
    const container = document.createElement("div");
    let index = 0;

    const urls = captureUrls(this.text);
    console.log(urls);
    urls.forEach((url) => {
      const urlIndex = this.text.indexOf(url, index);
      const textBeforeUrl = this.text.substring(index, urlIndex);

      const urlElement = document.createElement("a");
      urlElement.setAttribute("href", url);
      urlElement.setAttribute("target", "_blank");
      urlElement.innerText = url;

      const text = document.createElement("span");
      text.innerText = textBeforeUrl;
      
      container.appendChild(text);
      container.appendChild(urlElement);
      index = urlIndex + url.length;
    });

    const text = document.createElement("span");
    text.innerText = this.text.substring(index);
    container.appendChild(text);
    return container;
  }
}

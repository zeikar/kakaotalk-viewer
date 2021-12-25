import { generateColorByUserName, getTextColorByBackgroundColor } from "../lib/color.js";

export class Message {
  constructor(username, date, time, text) {
    this.username = username;
    this.date = date;
    this.time = time;
    this.text = text;
  }

  setExtraData(isMine, isFirst, isLast) {
    this.isMine = isMine;
    this.isFirst = isFirst;
    this.isLast = isLast;
  }

  create() {
    const core = this.createCoreDomElement();
    const container = this.createContainerDomElement(core);
    return container;
  }

  // base method
  createContainerDomElement(coreDomElement) {
    const messageRow = document.createElement("div");
    messageRow.classList.add("message-row");

    // 자기 자신의 메시지
    if (this.isMine) {
      messageRow.classList.add("message-row--own");
    } else {
      const messageProfile = this.createProfilePictureDomElement();
      messageRow.appendChild(messageProfile);
    }

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-row__content");

    if (!this.isMine && this.isFirst) {
      const messageAuthor = document.createElement("div");
      messageAuthor.classList.add("message__author");
      messageAuthor.innerText = this.username;
      messageContent.appendChild(messageAuthor);
    }

    const messageInfo = document.createElement("div");
    messageInfo.classList.add("message__info");

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message__bubble");
    if (this.isFirst) {
      messageBubble.classList.add("tail");
    }

    messageBubble.appendChild(coreDomElement);
    messageInfo.appendChild(messageBubble);

    if (this.isLast) {
      const messageTime = document.createElement("div");
      messageTime.classList.add("message__time");
      messageTime.innerText = this.time;
      messageInfo.appendChild(messageTime);
    }

    messageContent.appendChild(messageInfo);
    messageRow.appendChild(messageContent);

    return messageRow;
  }

  createProfilePictureDomElement() {
    if (!this.isFirst) {
      const messageProfile = document.createElement("div");
      messageProfile.classList.add("message__profile");
      return messageProfile;
    }

    const messageProfile = document.createElement("div");
    messageProfile.classList.add("message__profile");

    const profileContainer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    profileContainer.setAttribute("viewBox", "0 0 50 50");

    const profileSquarcle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    // "M25 0C43 0 50 7 50 25 50 43 43 50 25 50 7 50 0 43 0 25 0 7 7 0 25 0Z"
    profileSquarcle.setAttribute(
      "d",
      "M25 0C43 0 50 7 50 25 50 43 43 50 25 50 7 50 0 43 0 25 0 7 7 0 25 0Z"
    );
    const profileColor = generateColorByUserName(this.username);
    profileSquarcle.setAttribute("fill", profileColor);

    const profileText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    profileText.setAttribute("x", "50%");
    profileText.setAttribute("y", "50%");
    profileText.setAttribute("dy", "5");
    profileText.setAttribute("text-anchor", "middle");
    profileText.setAttribute("fill", getTextColorByBackgroundColor(profileColor));
    profileText.innerHTML = this.username.slice(0, 3).toUpperCase();

    profileContainer.appendChild(profileSquarcle);
    profileContainer.appendChild(profileText);
    messageProfile.appendChild(profileContainer);
    return messageProfile;
  }
}

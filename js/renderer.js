export class Renderer {
  constructor() {
    this.chatTitle = document.getElementById("chat-title");
    this.mainChat = document.getElementById("main-chat");
  }

  startRenderingChat(chat) {
    window.scrollTo(0, 0);
    this.chat = chat;
    this.renderedMessages = 0;
    this.currentDate = "";

    // 채팅방 제목
    this.chatTitle.innerText = displayChatroomTitle(chat);

    // 채팅방 메시지
    this.mainChat.innerHTML = "";
  }

  renderMoreMessages(startIndex, size) {
    for (let i = startIndex; i < startIndex + size; i++) {
      if (i >= this.chat.messages.length) {
        break;
      }

      const message = this.chat.messages[i].clone();

      if (message.date !== this.currentDate) {
        this.currentDate = message.date;
        this.mainChat.innerHTML += displayDate(message.date);
      }

      // 같은 시각의 메시지는 아래에 붙이기
      if (
        i > 0 &&
        this.chat.messages[i - 1].userName === this.chat.messages[i].userName &&
        this.chat.messages[i - 1].time === this.chat.messages[i].time
      ) {
        message.userName = "";
      }
      if (
        i < this.chat.messages.length - 1 &&
        this.chat.messages[i + 1].userName === this.chat.messages[i].userName &&
        this.chat.messages[i + 1].time === this.chat.messages[i].time
      ) {
        message.time = "";
      }

      this.mainChat.innerHTML += displayChat(message);
    }
  }
}

function displayChatroomTitle(chat) {
  return `${chat.roomName} (${chat.users.length})`;
}

function displayDate(date) {
  return `<div class="chat__timestamp">${date}</div>`;
}

function displayProfilePicture(userName) {
  if (userName === "") {
    return `<div class="message__profile"></div>`;
  }
  return `<div class="message__profile">
    <svg viewBox="0 0 50 50">
      <path
        d="M25 0C43 0 50 7 50 25 50 43 43 50 25 50 7 50 0 43 0 25 0 7 7 0 25 0Z"
        fill="#fae100"
      ></path>
      <text
        class="default-txt"
        x="50%"
        y="50%"
        dy="5"
        text-anchor="middle"
      >
        ${userName.slice(0, 3).toUpperCase()}
      </text>
    </svg>
  </div>`;
}

function displayMessage(message) {
  if (message.userName === "") {
    return `
  <div class="message-row__content">
    <div class="message__info">
      <span class="message__bubble">${message.text.replaceAll(
        "\n",
        "<br />"
      )}</span>
      <span class="message__time">${message.time}</span>
    </div>
  </div>
`;
  }
  return `
  <div class="message-row__content">
    <span class="message__author">${message.userName}</span>
    <div class="message__info">
      <span class="message__bubble tail">${message.text.replaceAll(
        "\n",
        "<br />"
      )}</span>
      <span class="message__time">${message.time}</span>
    </div>
  </div>
`;
}

function displayChat(message) {
  return `<div class="message-row">
    ${displayProfilePicture(message.userName)}
    ${displayMessage(message)}
  </div>`;
}

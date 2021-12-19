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

      // 자기 자신의 메시지
      if (message.userName === this.chat.owner) {
        message.ownMessage = true;
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

      this.mainChat.appendChild(displayMessage(message));
    }
  }
}

function displayChatroomTitle(chat) {
  return `${chat.roomName} (${chat.users.length})`;
}

function displayNotification(text) {
  const container = document.createElement("div");
  container.classList.add("chat__timestamp");
  container.innerText = text;
  return container;
}

function displayProfilePicture(userName) {
  if (userName === "") {
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
  profileSquarcle.setAttribute("fill", "#fae100");

  const profileText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  profileText.setAttribute("x", "50%");
  profileText.setAttribute("y", "50%");
  profileText.setAttribute("dy", "5");
  profileText.setAttribute("text-anchor", "middle");
  profileText.innerHTML = userName.slice(0, 3).toUpperCase();

  profileContainer.appendChild(profileSquarcle);
  profileContainer.appendChild(profileText);
  messageProfile.appendChild(profileContainer);
  return messageProfile;
}

function displayMessageContent(message) {
  if (message.userName === "") {
    const messageContent = document.createElement("div");
    messageContent.classList.add("message-row__content");

    const messageInfo = document.createElement("div");
    messageInfo.classList.add("message__info");

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message__bubble");

    const messageText = displayMessageText(message);
    messageBubble.appendChild(messageText);

    const messageTime = document.createElement("div");
    messageTime.classList.add("message__time");
    messageTime.innerText = message.time;

    messageInfo.appendChild(messageBubble);
    messageInfo.appendChild(messageTime);

    messageContent.appendChild(messageInfo);
    return messageContent;
  }

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-row__content");

  const messageAuthor = document.createElement("div");
  messageAuthor.classList.add("message__author");
  messageAuthor.innerText = message.userName;

  const messageInfo = document.createElement("div");
  messageInfo.classList.add("message__info");

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message__bubble");
  messageBubble.classList.add("tail");

  const messageText = displayMessageText(message);
  messageBubble.appendChild(messageText);

  const messageTime = document.createElement("div");
  messageTime.classList.add("message__time");
  messageTime.innerText = message.time;

  messageInfo.appendChild(messageBubble);
  messageInfo.appendChild(messageTime);

  messageContent.appendChild(messageAuthor);
  messageContent.appendChild(messageInfo);
  return messageContent;
}

function displayOwnerMessage(message) {
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-row__content");

  const messageInfo = document.createElement("div");
  messageInfo.classList.add("message__info");

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message__bubble");

  if (message.userName !== "") {
    messageBubble.classList.add("tail");
  }

  const messageText = displayMessageText(message);
  messageBubble.appendChild(messageText);

  const messageTime = document.createElement("div");
  messageTime.classList.add("message__time");
  messageTime.innerText = message.time;

  messageInfo.appendChild(messageBubble);
  messageInfo.appendChild(messageTime);

  messageContent.appendChild(messageInfo);
  return messageContent;
}

function displayMessageText(message) {
  if (message.messageType === "plain") {
    const text = document.createElement("span");
    text.innerText = message.text;
    return text;
  } else if (message.messageType === "select") {
    const options = message.extra.options.map(
      (option) => `<option>${option}</option>`
    );
    options.unshift(`<option>-</option>`);
    options.push(`<option value="">선택 안 함</option>`);

    const select = document.createElement("select");
    select.innerHTML = options.join("");
    select.addEventListener("change", () => {
      message.extra.callback(select.value);
    });
    return select;
  }
  return document.createElement("span");
}

function displayMessage(message) {
  if (message.messageType == "notification") {
    return displayNotification(message.text);
  }

  const messageRow = document.createElement("div");

  // 자기 자신의 메시지
  if (message.ownMessage) {
    messageRow.classList.add("message-row");
    messageRow.classList.add("message-row--own");

    const messageContent = displayOwnerMessage(message);
    messageRow.appendChild(messageContent);
  } else {
    messageRow.classList.add("message-row");

    const messageProfile = displayProfilePicture(message.userName);
    messageRow.appendChild(messageProfile);

    const messageContent = displayMessageContent(message);
    messageRow.appendChild(messageContent);
  }

  return messageRow;
}

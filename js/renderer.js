export function displayChats(result) {
  const chatTitle = document.getElementById("chat-title");
  const mainChat = document.getElementById("main-chat");

  chatTitle.innerText = result.roomName;

  mainChat.innerHTML = "";

  let currentDate = "";
  for (let i = 0; i < result.messages.length; i++) {
    const message = result.messages[i];

    if (message.date !== currentDate) {
      currentDate = message.date;
      mainChat.innerHTML += `<div class="chat__timestamp">${currentDate}</div>`;
    }

    mainChat.innerHTML += createChat(message);
  }
}

function createProfilePicture(userName) {
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
        ${userName}
      </text>
    </svg>
  </div>`;
}

function createMessage(message) {
  return `
  <div class="message-row__content">
    <span class="message__author">${message.userName}</span>
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

function createChat(message) {
  return `<div class="message-row">
    ${createProfilePicture(message.userName)}
    ${createMessage(message)}
  </div>`;
}

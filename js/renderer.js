export function displayChats(result) {
  const chatTitle = document.getElementById("chat-title");
  const mainChat = document.getElementById("main-chat");

  chatTitle.innerText = result.roomName;

  mainChat.innerHTML = "";

  for (let i = 0; i < result.messages.length; i++) {
    const message = result.messages[i];

    const chat = document.createElement("div");
    chat.className = "message-row";
    chat.innerHTML = `
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
    mainChat.appendChild(chat);
  }
}

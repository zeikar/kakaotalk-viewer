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

      const message = this.chat.messages[i];
      let isMine = false;
      let isFirst = true;
      let isLast = true;

      // 자기 자신의 메시지
      if (message.username === this.chat.owner) {
        isMine = true;
      }

      // 같은 시각의 메시지는 아래에 붙이기
      if (
        i > 0 &&
        this.chat.messages[i - 1].username === message.username &&
        this.chat.messages[i - 1].time === message.time
      ) {
        isFirst = false;
      }
      if (
        i < this.chat.messages.length - 1 &&
        this.chat.messages[i + 1].username === message.username &&
        this.chat.messages[i + 1].time === message.time
      ) {
        isLast = false;
      }

      message.setExtraData(isMine, isFirst, isLast);
      this.mainChat.appendChild(message.create());
    }
  }
}

function displayChatroomTitle(chat) {
  return `${chat.roomName} (${chat.users.length})`;
}

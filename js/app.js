import { Chat } from "./chat.js";
import { readFile } from "./file.js";
import { parseKakaoTalkText } from "./parser.js";
import { Renderer } from "./renderer.js";
import { generateTutorialMessages } from "./tutorial.js";

const renderMessagesSize = 10;

export class App {
  constructor() {
    this.chatData = new Chat();
    this.renderer = new Renderer();
    this.lastMessageIndex = 0;
  }

  addMessage(username, message) {
    this.chatData.addMessage(username, message);
  }

  generateTutorialChatData() {
    this.lastMessageIndex = 0;
    this.chatData = generateTutorialMessages();
  }

  async generateChatDataFromFile(file) {
    const raw = await readFile(file);
    const chatData = parseKakaoTalkText(raw);
    console.log(chatData);

    if (chatData === null) {
      throw new Error("지원하지 않는 파일 형식입니다.");
    }
    this.lastMessageIndex = 0;
    this.chatData = chatData;
  }

  display() {
    this.renderer.startRenderingChat(this.chatData);
    this.loadMoreChatMessages();
  }

  async startParsing() {
    const inputFile = document.getElementById("file");
    if (inputFile.files.length === 0) {
      alert("파일을 선택해주세요.");
      return;
    }

    const file = inputFile.files[0];

    this.addMessage(
      "카카오톡 뷰어",
      `${file.name} 파일을 읽는 중입니다... 잠시만 기다려 주세요`
    );
    this.display();

    try {
      await this.generateChatDataFromFile(file);
    } catch (error) {
      this.addMessage("카카오톡 뷰어", `파일 읽기 실패: ${error.message}`);
    }
    this.display();
  }

  updateScroll(scrollTop, scrollHeight, clientHeight) {
    if (
      scrollTop + clientHeight >= scrollHeight - scrollHeight * 0.1 &&
      this.hasMoreChatMessages()
    ) {
      this.loadMoreChatMessages();
    }
  }

  hasMoreChatMessages() {
    return this.lastMessageIndex < this.chatData.messages.length - 1;
  }

  loadMoreChatMessages() {
    this.renderer.renderMoreMessages(this.lastMessageIndex, renderMessagesSize);
    this.lastMessageIndex += renderMessagesSize;
  }
}

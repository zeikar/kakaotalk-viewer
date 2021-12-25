import { Chat } from "./chat.js";
import { readFile } from "./lib/file.js";
import { parseKakaoTalkText } from "./parser/parser.js";
import { Renderer } from "./renderer.js";
import { generateTutorialMessages } from "./tutorial.js";

const renderMessagesSize = 20;

export class App {
  constructor() {
    this.chatData = new Chat();
    this.renderer = new Renderer();
    this.lastMessageIndex = 0;
  }

  addMessage(username, message) {
    this.chatData.addMessage(username, message);
    this.display();
  }

  addMessageWithOptions(username, options) {
    this.chatData.addMessageWithOptions(
      username,
      options,
      this.onSelectOwnerUserName.bind(this)
    );
    this.display();
  }

  generateTutorialChatData() {
    this.lastMessageIndex = 0;
    this.chatData = generateTutorialMessages();
  }

  async generateChatDataFromFile(file) {
    const raw = await readFile(file);
    const chatData = parseKakaoTalkText(raw);
    console.log(chatData);
    return chatData;
  }

  // 사용자 이름 선택, 메인 채팅 출력
  onSelectOwnerUserName(userName) {
    this.chatData.setOwner(userName);
    this.display();
  }

  display() {
    this.renderer.startRenderingChat(this.chatData);
    this.lastMessageIndex = 0;
    this.loadMoreChatMessages();
  }

  async startParsing() {
    this.generateTutorialChatData();
    this.display();

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

    const chatData = await this.generateChatDataFromFile(file);
    if (chatData === null) {
      this.addMessage(
        "카카오톡 뷰어",
        `파일 읽기 실패: 지원하지 않는 파일 형식입니다.`
      );
      return;
    }

    this.addMessage(
      "카카오톡 뷰어",
      "자신으로 설정할 사용자 이름을 선택해주세요."
    );

    this.addMessageWithOptions("카카오톡 뷰어", chatData.users);

    // 실제 채팅 데이터 세팅
    this.chatData = chatData;
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

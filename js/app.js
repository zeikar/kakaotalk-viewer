import { Chat } from "./chat.js";
import { readFile } from "./file.js";
import { parseKakaoTalkText } from "./parser.js";
import { displayChats } from "./renderer.js";
import { generateTutorialMessages } from "./tutorial.js";

export class App {
  constructor() {
    this.chatData = new Chat();
  }

  addMessage(username, message) {
    this.chatData.addMessage(username, message);
  }

  generateTutorialChatData() {
    this.chatData = generateTutorialMessages();
  }

  async generateChatDataFromFile(file) {
    const raw = await readFile(file);
    const chatData = parseKakaoTalkText(raw);
    console.log(chatData);

    if (chatData === null) {
      throw new Error("지원하지 않는 파일 형식입니다.");
    }

    this.chatData = chatData;
  }

  display() {
    displayChats(this.chatData);
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
}

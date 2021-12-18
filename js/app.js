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
    const data = await readFile(file);
    this.chatData = parseKakaoTalkText(data);
  }

  display() {
    displayChats(this.chatData);
  }
}

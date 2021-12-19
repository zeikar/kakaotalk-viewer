import { getCurrentDate, getCurrentTime } from "./format.js";
import { Message } from "./message.js";

export class Chat {
  constructor(roomName, users, messages) {
    this.roomName = roomName;
    this.users = users;
    this.messages = messages;
  }

  addMessage(username, text) {
    this.messages.push(
      new Message(username, getCurrentDate(), getCurrentTime(), "plain", text)
    );
  }

  addMessageWithOptions(username, options, callback) {
    this.messages.push(
      new Message(username, getCurrentDate(), getCurrentTime(), "select", "", {
        options,
        callback,
      })
    );
  }

  setOwner(username) {
    this.owner = username;
  }
}

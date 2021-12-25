import { getCurrentDate, getCurrentTime } from "./lib/format.js";
import { MessageFactory } from "./messages/message-factory.js";

export class Chat {
  constructor(roomName, users, messages) {
    this.roomName = roomName;
    this.users = users;
    this.messages = messages;
  }

  addMessage(username, text) {
    this.messages.push(
      MessageFactory.createPlainMessage(
        username,
        getCurrentDate(),
        getCurrentTime(),
        text
      )
    );
  }

  addMessageWithOptions(username, options, callback) {
    this.messages.push(
      MessageFactory.createSelectMessage(
        username,
        getCurrentDate(),
        getCurrentTime(),
        options,
        callback
      )
    );
  }

  setOwner(username) {
    this.owner = username;
  }
}

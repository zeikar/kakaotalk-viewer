import { NotificationMessage } from "./notification-message.js";
import { PlainMessage } from "./plain-message.js";
import { SelectMessage } from "./select-message.js";

export class MessageFactory {
  static createPlainMessage(username, date, time, text) {
    return new PlainMessage(username, date, time, text);
  }

  static createSelectMessage(username, date, time, options, callback) {
    return new SelectMessage(username, date, time, options, callback);
  }

  static createNotificationMessage(date, text) {
    return new NotificationMessage(date, text);
  }
}

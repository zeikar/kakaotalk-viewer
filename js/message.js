export class Message {
  constructor(userName, date, time, messageType, text, extra) {
    this.userName = userName;
    this.date = date;
    this.time = time;
    this.messageType = messageType;
    this.text = text;
    this.extra = extra;
  }

  clone() {
    return new Message(
      this.userName,
      this.date,
      this.time,
      this.messageType,
      this.text,
      this.extra
    );
  }
}

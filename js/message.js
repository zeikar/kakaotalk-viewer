export class Message {
  constructor(userName, date, time, text) {
    this.userName = userName;
    this.date = date;
    this.time = time;
    this.text = text;
  }

  clone() {
    return new Message(this.userName, this.date, this.time, this.text);
  }
}

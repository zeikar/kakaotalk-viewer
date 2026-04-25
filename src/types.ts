export interface PlainMessage {
  kind: "plain";
  username: string;
  date: string;
  time: string;
  text: string;
}

export interface NotificationMessage {
  kind: "notification";
  date: string;
  text: string;
}

export interface DateHeaderMessage {
  kind: "date-header";
  date: string;
}

export interface SelectMessage {
  kind: "select";
  username: string;
  date: string;
  time: string;
  options: string[];
}

export type Message =
  | PlainMessage
  | NotificationMessage
  | DateHeaderMessage
  | SelectMessage;

export interface Chat {
  roomName: string;
  users: string[];
  messages: Message[];
}

import { Virtuoso } from "react-virtuoso";
import type { Message } from "../types";
import { MessageRow } from "./message-row";

interface Props {
  messages: Message[];
  owner: string | null;
  onSelectOwner: (username: string) => void;
}

export function MessageList({ messages, owner, onSelectOwner }: Props) {
  return (
    <Virtuoso
      className="flex-1 min-h-0"
      data={messages}
      initialTopMostItemIndex={Math.max(0, messages.length - 1)}
      alignToBottom
      followOutput="auto"
      increaseViewportBy={400}
      computeItemKey={(index, msg) => `${index}-${msg.kind}`}
      itemContent={(index, msg) => (
        <MessageRow
          message={msg}
          isMine={msg.kind === "plain" && msg.username === owner}
          isFirst={isFirstOfGroup(messages, index)}
          isLast={isLastOfGroup(messages, index)}
          onSelectOwner={onSelectOwner}
        />
      )}
    />
  );
}

function isFirstOfGroup(messages: Message[], index: number): boolean {
  if (index === 0) return true;
  return !sameAuthorAndTime(messages[index - 1], messages[index]);
}

function isLastOfGroup(messages: Message[], index: number): boolean {
  if (index === messages.length - 1) return true;
  return !sameAuthorAndTime(messages[index], messages[index + 1]);
}

function sameAuthorAndTime(a: Message, b: Message): boolean {
  if (a.kind !== "plain" || b.kind !== "plain") return false;
  return a.username === b.username && a.time === b.time;
}

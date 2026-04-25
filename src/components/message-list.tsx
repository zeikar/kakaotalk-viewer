import type { Ref } from "preact";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import type { Message } from "../types";
import { MessageRow } from "./message-row";

interface Props {
  messages: Message[];
  owner: string | null;
  onSelectOwner: (username: string) => void;
  virtuosoRef?: Ref<VirtuosoHandle>;
  searchQuery: string;
  currentMatchMessageIndex: number | null;
  onDateHeaderClick?: (date: string) => void;
  onVisibleStartChange?: (index: number) => void;
  onScrollingChange?: (scrolling: boolean) => void;
  onScroll?: (event: Event) => void;
}

export function MessageList({
  messages,
  owner,
  onSelectOwner,
  virtuosoRef,
  searchQuery,
  currentMatchMessageIndex,
  onDateHeaderClick,
  onVisibleStartChange,
  onScrollingChange,
  onScroll,
}: Props) {
  return (
    <Virtuoso
      ref={virtuosoRef}
      className="flex-1 min-h-0"
      data={messages}
      initialTopMostItemIndex={Math.max(0, messages.length - 1)}
      followOutput="auto"
      increaseViewportBy={400}
      rangeChanged={(range) => onVisibleStartChange?.(range.startIndex)}
      isScrolling={(scrolling) => onScrollingChange?.(scrolling)}
      onScroll={onScroll}
      components={{
        Header: () => <div class="h-2" />,
        Footer: () => <div class="h-3" />,
      }}
      computeItemKey={(index, msg) => `${index}-${msg.kind}`}
      itemContent={(index, msg) => (
        <MessageRow
          message={msg}
          isMine={msg.kind === "plain" && msg.username === owner}
          isFirst={isFirstOfGroup(messages, index)}
          isLast={isLastOfGroup(messages, index)}
          onSelectOwner={onSelectOwner}
          searchQuery={searchQuery}
          isCurrentMatch={index === currentMatchMessageIndex}
          onDateHeaderClick={onDateHeaderClick}
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

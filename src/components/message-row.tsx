import type { Message } from "../types";
import { NotificationRow } from "./notification-row";
import { PlainMessageBody } from "./plain-message-body";
import { ProfileAvatar, ProfileAvatarPlaceholder } from "./profile-avatar";
import { SelectMessageBody } from "./select-message-body";

interface Props {
  message: Message;
  isMine: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelectOwner: (username: string) => void;
}

export function MessageRow({
  message,
  isMine,
  isFirst,
  isLast,
  onSelectOwner,
}: Props) {
  if (message.kind === "notification") {
    return <NotificationRow text={message.text} />;
  }

  const username = message.username;
  const displayName = username.trim().length > 0 ? username : "알 수 없음";
  const bubbleColor = isMine ? "bg-kakao-yellow" : "bg-white";
  const rowDir = isMine ? "flex-row-reverse" : "";
  const timePosition = isMine ? "right-full mr-1" : "left-full ml-1";
  // Reserve tail-side gutter on every bubble so first/continuation bubbles
  // line up vertically; only the first bubble in a group actually draws the tail.
  const bubbleGutter = isMine ? "mr-2.5" : "ml-2.5";
  const tail = isFirst ? (isMine ? "bubble-tail-right" : "bubble-tail-left") : "";

  return (
    <div class={`flex w-full px-2 pb-1.5 ${rowDir}`}>
      {!isMine &&
        (isFirst ? (
          <ProfileAvatar username={displayName} />
        ) : (
          <ProfileAvatarPlaceholder />
        ))}

      <div class="flex flex-col max-w-[calc(80%-3rem)] min-w-0">
        {!isMine && isFirst && (
          <div class="text-sm opacity-80 ml-2 mb-1">{displayName}</div>
        )}

        <div class="relative flex items-end min-w-0">
          <div
            class={`${bubbleColor} ${tail} ${bubbleGutter} rounded-2xl px-3.5 py-2.5 text-base shadow-sm`}
          >
            {message.kind === "plain" ? (
              <PlainMessageBody text={message.text} />
            ) : (
              <SelectMessageBody
                options={message.options}
                onSelect={onSelectOwner}
              />
            )}
          </div>
          {isLast && (
            <div
              class={`absolute bottom-0 ${timePosition} text-xs opacity-70 whitespace-nowrap`}
            >
              {message.time}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

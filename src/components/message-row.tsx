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
  const bubbleColor = isMine ? "bg-kakao-yellow" : "bg-white";
  const rowDir = isMine ? "flex-row-reverse" : "";
  const infoDir = isMine ? "flex-row-reverse" : "";

  return (
    <div class={`flex w-full mb-1.5 px-2 ${rowDir}`}>
      {!isMine &&
        (isFirst ? (
          <ProfileAvatar username={username} />
        ) : (
          <ProfileAvatarPlaceholder />
        ))}

      <div class="flex flex-col max-w-[80%]">
        {!isMine && isFirst && (
          <div class="text-sm opacity-80 ml-2 mb-1">{username}</div>
        )}

        <div class={`flex items-end gap-1 ${infoDir}`}>
          <div
            class={`${bubbleColor} rounded-md px-2.5 py-2 text-base shadow-sm`}
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
            <div class="text-xs opacity-70 whitespace-nowrap">
              {message.time}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

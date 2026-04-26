import { splitByQuery } from "../lib/search";
import { SelectableUserText } from "./selectable-user-text";

interface Props {
  text: string;
  searchQuery: string;
  isCurrentMatch: boolean;
  users?: string[];
  onSelectUser?: (username: string) => void;
}

export function NotificationRow({
  text,
  searchQuery,
  isCurrentMatch,
  users = [],
  onSelectUser,
}: Props) {
  const currentRing = isCurrentMatch ? "ring-2 ring-blue-500" : "";
  const parts = splitByQuery(text, searchQuery);

  return (
    <div class="flex justify-center py-4">
      <div
        class={`bg-kakao-timestamp text-white text-sm rounded-full px-3 py-1.5 ${currentRing}`}
      >
        {onSelectUser ? (
          <SelectableUserText
            text={text}
            searchQuery={searchQuery}
            users={users}
            mode="notification"
            onSelectUser={onSelectUser}
          />
        ) : (
          parts.map((part, i) =>
            part.match ? (
              <mark key={i} class="bg-blue-200 text-black rounded-sm">
                {part.text}
              </mark>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )
        )}
      </div>
    </div>
  );
}

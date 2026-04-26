import { splitByUrls } from "../lib/url";
import { SelectableUserText, renderHighlighted } from "./selectable-user-text";

interface Props {
  text: string;
  searchQuery: string;
  users?: string[];
  onSelectUser?: (username: string) => void;
}

export function PlainMessageBody({
  text,
  searchQuery,
  users = [],
  onSelectUser,
}: Props) {
  const segments = splitByUrls(text);

  return (
    <span class="whitespace-pre-wrap break-all">
      {segments.map((seg, i) =>
        seg.kind === "url" ? (
          <a
            key={i}
            href={seg.value}
            target="_blank"
            rel="noopener noreferrer"
            class="underline text-blue-700"
          >
            {renderHighlighted(seg.value, searchQuery)}
          </a>
        ) : (
          <span key={i}>
            {onSelectUser ? (
              <SelectableUserText
                text={seg.value}
                searchQuery={searchQuery}
                users={users}
                mode="mention"
                onSelectUser={onSelectUser}
              />
            ) : (
              renderHighlighted(seg.value, searchQuery)
            )}
          </span>
        )
      )}
    </span>
  );
}

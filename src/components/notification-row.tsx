import { splitByQuery } from "../lib/search";

interface Props {
  text: string;
  date: string;
  searchQuery: string;
  isCurrentMatch: boolean;
  onDateClick?: (date: string) => void;
}

export function NotificationRow({
  text,
  date,
  searchQuery,
  isCurrentMatch,
  onDateClick,
}: Props) {
  const currentRing = isCurrentMatch ? "ring-2 ring-blue-500" : "";
  const parts = splitByQuery(text, searchQuery);
  const isDateHeader = text === date;
  const clickable = isDateHeader && onDateClick !== undefined;

  const inner = (
    <div
      class={`bg-kakao-timestamp text-white text-sm rounded-full px-3 py-1.5 ${currentRing}`}
    >
      {parts.map((part, i) =>
        part.match ? (
          <mark key={i} class="bg-blue-200 text-black rounded-sm">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </div>
  );

  return (
    <div class="flex justify-center py-4">
      {clickable ? (
        <button
          type="button"
          aria-label={`${date}로 이동`}
          onClick={() => onDateClick(date)}
          class="cursor-pointer"
        >
          {inner}
        </button>
      ) : (
        inner
      )}
    </div>
  );
}

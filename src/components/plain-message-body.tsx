import { splitByQuery } from "../lib/search";
import { splitByUrls } from "../lib/url";

interface Props {
  text: string;
  searchQuery: string;
}

export function PlainMessageBody({ text, searchQuery }: Props) {
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
          <span key={i}>{renderHighlighted(seg.value, searchQuery)}</span>
        )
      )}
    </span>
  );
}

function renderHighlighted(text: string, query: string) {
  return splitByQuery(text, query).map((part, i) =>
    part.match ? (
      <mark key={i} class="bg-blue-200 text-inherit rounded-sm">
        {part.text}
      </mark>
    ) : (
      <span key={i}>{part.text}</span>
    )
  );
}

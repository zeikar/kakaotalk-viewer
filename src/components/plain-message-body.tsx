import { splitByUrls } from "../lib/url";

interface Props {
  text: string;
}

export function PlainMessageBody({ text }: Props) {
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
            {seg.value}
          </a>
        ) : (
          <span key={i}>{seg.value}</span>
        )
      )}
    </span>
  );
}

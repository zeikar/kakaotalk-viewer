import { formatDateKorean } from "../lib/format";

interface Props {
  date: string;
  onDateClick?: (date: string) => void;
}

export function DateHeaderRow({ date, onDateClick }: Props) {
  const label = formatDateKorean(date);
  const pill = (
    <div class="bg-kakao-timestamp text-white text-sm rounded-full px-3 py-1.5">
      {label}
    </div>
  );

  return (
    <div class="flex justify-center py-4">
      {onDateClick ? (
        <button
          type="button"
          aria-label={`${label}로 이동`}
          onClick={() => onDateClick(date)}
          class="cursor-pointer"
        >
          {pill}
        </button>
      ) : (
        pill
      )}
    </div>
  );
}

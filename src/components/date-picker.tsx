import { useMemo, useState } from "preact/hooks";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { formatKakaoDate, parseKakaoDate } from "../lib/date-index";

interface Props {
  dateIndex: Map<string, number>;
  recentIndex: number | null;
  initialDate: string | null;
  onPick: (messageIndex: number) => void;
  onClose: () => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function pickInitialMonth(
  initialDate: string | null,
  dateIndex: Map<string, number>
): { year: number; month: number } {
  const fromInitial = initialDate ? parseKakaoDate(initialDate) : null;
  if (fromInitial) return { year: fromInitial.year, month: fromInitial.month };

  let latest: { year: number; month: number; day: number } | null = null;
  for (const key of dateIndex.keys()) {
    const parsed = parseKakaoDate(key);
    if (!parsed) continue;
    if (
      !latest ||
      parsed.year > latest.year ||
      (parsed.year === latest.year && parsed.month > latest.month) ||
      (parsed.year === latest.year &&
        parsed.month === latest.month &&
        parsed.day > latest.day)
    ) {
      latest = parsed;
    }
  }
  if (latest) return { year: latest.year, month: latest.month };

  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function DatePicker({
  dateIndex,
  recentIndex,
  initialDate,
  onPick,
  onClose,
}: Props) {
  const [view, setView] = useState(() =>
    pickInitialMonth(initialDate, dateIndex)
  );

  const { year, month } = view;
  const firstDayOfWeek = useMemo(
    () => new Date(year, month - 1, 1).getDay(),
    [year, month]
  );
  const daysInMonth = useMemo(
    () => new Date(year, month, 0).getDate(),
    [year, month]
  );

  const goPrev = () =>
    setView((v) =>
      v.month === 1
        ? { year: v.year - 1, month: 12 }
        : { year: v.year, month: v.month - 1 }
    );

  const goNext = () =>
    setView((v) =>
      v.month === 12
        ? { year: v.year + 1, month: 1 }
        : { year: v.year, month: v.month + 1 }
    );

  const recentDisabled = recentIndex === null;

  const cells: ({ day: number; key: string; index: number | undefined } | null)[] =
    [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const key = formatKakaoDate(year, month, day);
    cells.push({ day, key, index: dateIndex.get(key) });
  }

  return (
    <div
      class="absolute inset-0 z-20 flex items-start justify-center pt-12 bg-black/20"
      onClick={onClose}
    >
      <div
        class="relative bg-white rounded-2xl shadow-xl p-4 w-[90%] max-w-[22rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="달력 닫기"
          onClick={onClose}
          class="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow ring-1 ring-black/10 cursor-pointer"
        >
          <XMarkIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
        </button>

        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-1">
            <button
              type="button"
              aria-label="이전 달"
              onClick={goPrev}
              class="flex h-7 w-7 items-center justify-center cursor-pointer"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <h2 class="font-bold text-base">
              {year}년 {month}월
            </h2>
            <button
              type="button"
              aria-label="다음 달"
              onClick={goNext}
              class="flex h-7 w-7 items-center justify-center cursor-pointer"
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              if (recentIndex !== null) onPick(recentIndex);
            }}
            disabled={recentDisabled}
            class="text-sm rounded-full border border-black/30 px-3 py-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            최근
          </button>
        </div>

        <div class="grid grid-cols-7 text-center text-xs opacity-60 mb-1">
          {WEEKDAYS.map((w) => (
            <div key={w} class="py-1">
              {w}
            </div>
          ))}
        </div>

        <div class="grid grid-cols-7 text-center text-sm">
          {cells.map((cell, i) => {
            if (cell === null) return <div key={`pad-${i}`} class="py-2" />;
            const hasMessage = cell.index !== undefined;
            const isFocused = initialDate === cell.key;
            const base = "py-2 flex items-center justify-center";
            const cls = isFocused
              ? `${base} font-bold`
              : hasMessage
                ? `${base} font-bold`
                : `${base} opacity-30`;
            const inner = isFocused
              ? "h-8 w-8 rounded-full bg-black text-white flex items-center justify-center"
              : "h-8 w-8 flex items-center justify-center";
            return (
              <button
                type="button"
                key={cell.key}
                disabled={!hasMessage}
                onClick={() => {
                  if (cell.index !== undefined) onPick(cell.index);
                }}
                class={`${cls} cursor-pointer disabled:cursor-default`}
              >
                <span class={inner}>{cell.day}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

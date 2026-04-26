import { useEffect, useRef } from "preact/hooks";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  matchCount: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  userFilter: string | null;
  onClearUserFilter: () => void;
}

export function SearchBar({
  query,
  onQueryChange,
  matchCount,
  currentIndex,
  onNext,
  onPrev,
  onClose,
  userFilter,
  onClearUserFilter,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [userFilter]);

  const disabled = matchCount === 0;
  const displayIndex = matchCount === 0 ? 0 : currentIndex + 1;

  return (
    <div class="bg-kakao-bg border-b border-black/10 flex items-center gap-2 px-3 py-2 flex-shrink-0">
      <div class="flex flex-1 min-w-0 items-center gap-1.5 rounded-full bg-white px-2 py-1.5">
        {userFilter && (
          <span class="inline-flex max-w-[8rem] items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
            <span class="truncate">{userFilter}</span>
            <button
              type="button"
              aria-label="사용자 필터 해제"
              onClick={onClearUserFilter}
              class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full cursor-pointer hover:bg-slate-300"
            >
              <XMarkIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="메시지 검색"
          onInput={(e) => onQueryChange((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.shiftKey) onPrev();
              else onNext();
            } else if (e.key === "Escape") {
              e.preventDefault();
              onClose();
            }
          }}
          class="flex-1 min-w-0 bg-transparent text-sm outline-none"
        />
      </div>
      <span class="text-xs tabular-nums opacity-80 min-w-[3rem] text-center">
        {displayIndex}/{matchCount}
      </span>
      <button
        type="button"
        aria-label="이전 매칭"
        onClick={onPrev}
        disabled={disabled}
        class="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="다음 매칭"
        onClick={onNext}
        disabled={disabled}
        class="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="검색 닫기"
        onClick={onClose}
        class="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
      >
        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

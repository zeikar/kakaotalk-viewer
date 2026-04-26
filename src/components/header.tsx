import {
  ArrowLeftIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  CalendarIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

interface Props {
  title: string;
  onBack?: () => void;
  onOpenMenu: () => void;
  onToggleSearch: () => void;
  onToggleDatePicker: () => void;
}

export function Header({
  title,
  onBack,
  onOpenMenu,
  onToggleSearch,
  onToggleDatePicker,
}: Props) {
  return (
    <header class="bg-kakao-bg grid grid-cols-[3rem,minmax(0,1fr),6.5rem] items-center px-3 h-[50px] flex-shrink-0">
      <div class="flex items-center justify-start">
        {onBack && (
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={onBack}
            class="flex h-8 w-8 items-center justify-center cursor-pointer"
          >
            <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>
      <h1 class="min-w-0 text-lg font-semibold truncate text-center">{title}</h1>
      <div class="flex items-center justify-end gap-1">
        <button
          type="button"
          aria-label="날짜로 이동"
          onClick={onToggleDatePicker}
          class="flex h-8 w-8 items-center justify-center cursor-pointer"
        >
          <CalendarIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="검색 열기"
          onClick={onToggleSearch}
          class="flex h-8 w-8 items-center justify-center cursor-pointer"
        >
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={onOpenMenu}
          class="flex h-8 w-8 items-center justify-center cursor-pointer"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

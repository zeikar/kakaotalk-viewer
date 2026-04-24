import {
  ArrowLeftIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface Props {
  title: string;
  onOpenMenu: () => void;
}

export function Header({ title, onOpenMenu }: Props) {
  return (
    <header class="bg-kakao-bg flex items-center justify-between px-3 h-[50px] flex-shrink-0">
      <div class="w-12 flex items-center">
        <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 class="text-lg font-semibold truncate text-center flex-1">{title}</h1>
      <div class="w-12 flex justify-end items-center gap-4">
        <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={onOpenMenu}
          class="cursor-pointer"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

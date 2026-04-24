interface Props {
  title: string;
  onOpenMenu: () => void;
}

export function Header({ title, onOpenMenu }: Props) {
  return (
    <header class="bg-kakao-bg flex items-center justify-between px-3 h-[50px] flex-shrink-0">
      <div class="w-12">
        <i class="fas fa-angle-left fa-2x" />
      </div>
      <h1 class="text-lg font-semibold truncate text-center flex-1">{title}</h1>
      <div class="w-12 flex justify-end items-center gap-4">
        <i class="fas fa-search fa-lg" />
        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={onOpenMenu}
          class="cursor-pointer"
        >
          <i class="fas fa-bars fa-lg" />
        </button>
      </div>
    </header>
  );
}

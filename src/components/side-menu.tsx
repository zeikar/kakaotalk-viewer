import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ open, onClose }: Props) {
  return (
    <>
      <div
        class={`absolute inset-0 z-20 transition duration-500 ${
          open
            ? "visible bg-black/50"
            : "invisible bg-transparent pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        class={`absolute top-0 right-0 z-30 h-full w-[70%] min-w-[200px] bg-white flex flex-col transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div class="flex justify-between items-center p-3">
          <h2 class="text-lg font-semibold">카카오톡 뷰어</h2>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={onClose}
            class="cursor-pointer p-1"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div class="mt-auto flex justify-center p-3">
          <a
            href="https://github.com/zeikar/kakaotalk-viewer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700"
          >
            <span>GitHub</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </aside>
    </>
  );
}

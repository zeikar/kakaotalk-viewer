import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useRef } from "preact/hooks";

interface Props {
  onFile: (file: File) => void;
}

export function Reply({ onFile }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div class="bg-white border-t flex items-center gap-3 px-4 py-2 h-[70px] flex-shrink-0">
      <button
        type="button"
        class="flex h-8 w-8 flex-shrink-0 items-center justify-center opacity-50"
        aria-label="파일 선택"
        onClick={() => fileInputRef.current?.click()}
      >
        <PlusCircleIcon className="h-7 w-7" aria-hidden="true" />
      </button>
      <label class="flex-1 relative">
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv,text/plain,text/csv"
          class="block w-full text-sm border rounded-full px-4 py-3 file:mr-3 file:rounded-full file:border-0 file:bg-kakao-bg file:px-3 file:py-1 file:text-white"
          onChange={(e) => {
            const input = e.target as HTMLInputElement;
            if (input.files && input.files[0]) onFile(input.files[0]);
          }}
        />
      </label>
    </div>
  );
}

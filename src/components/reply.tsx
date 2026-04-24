import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  onFile: (file: File) => void;
}

export function Reply({ onFile }: Props) {
  return (
    <div class="bg-white border-t flex items-center gap-3 px-4 py-2 h-[70px] flex-shrink-0">
      <PlusCircleIcon className="h-7 w-7 opacity-50 flex-shrink-0" aria-hidden="true" />
      <label class="flex-1 relative">
        <input
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

import { useEffect, useState } from "preact/hooks";
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ProfileAvatar } from "./profile-avatar";

interface Props {
  open: boolean;
  onClose: () => void;
  users: string[];
  onSelectUser: (username: string) => void;
}

export function SideMenu({ open, onClose, users, onSelectUser }: Props) {
  const [userQuery, setUserQuery] = useState("");
  const normalizedQuery = userQuery.trim().toLowerCase();
  const filteredUsers =
    normalizedQuery.length === 0
      ? users
      : users.filter((name) => name.toLowerCase().includes(normalizedQuery));

  useEffect(() => {
    if (!open) setUserQuery("");
  }, [open]);

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

        {users.length > 0 && (
          <section class="px-3 pb-3 flex flex-col min-h-0">
            <h3 class="text-sm font-semibold text-slate-600 mb-2">
              참여자 ({users.length})
            </h3>
            <input
              type="search"
              value={userQuery}
              aria-label="참여자 검색"
              placeholder="참여자 검색"
              onInput={(e) => setUserQuery((e.target as HTMLInputElement).value)}
              class="mb-2 w-full rounded-full bg-slate-100 px-3 py-1.5 text-sm outline-none focus:bg-slate-200"
            />
            <ul class="overflow-y-auto">
              {filteredUsers.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    class="flex w-full items-center rounded-md text-left cursor-pointer hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                    onClick={() => onSelectUser(name)}
                  >
                    <ProfileAvatar username={name} />
                    <span class="ml-2 truncate text-base text-slate-800">
                      {name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {filteredUsers.length === 0 && (
              <p class="py-4 text-center text-sm text-slate-500">
                일치하는 참여자가 없습니다.
              </p>
            )}
          </section>
        )}

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

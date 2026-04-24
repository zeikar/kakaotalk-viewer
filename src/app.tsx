import { useCallback, useState } from "preact/hooks";
import { Header } from "./components/header";
import { MessageList } from "./components/message-list";
import { Reply } from "./components/reply";
import { SideMenu } from "./components/side-menu";
import { readFile } from "./lib/read-file";
import { getCurrentDate, getCurrentTime } from "./lib/format";
import { parseKakaoTalkText } from "./parser";
import { createTutorialChat } from "./tutorial";
import type { Chat } from "./types";

const SYSTEM_USER = "카카오톡 뷰어";

export function App() {
  const [chat, setChat] = useState<Chat>(() => createTutorialChat());
  const [owner, setOwner] = useState<string | null>(null);
  const [pendingChat, setPendingChat] = useState<Chat | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // Bumped on each chat replacement to remount the Virtuoso list and start
  // scroll position at the latest message.
  const [chatKey, setChatKey] = useState(0);

  const appendSystemMessage = useCallback((text: string) => {
    setChat((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          kind: "plain",
          username: SYSTEM_USER,
          date: getCurrentDate(),
          time: getCurrentTime(),
          text,
        },
      ],
    }));
  }, []);

  const appendSelectMessage = useCallback((options: string[]) => {
    setChat((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          kind: "select",
          username: SYSTEM_USER,
          date: getCurrentDate(),
          time: getCurrentTime(),
          options,
        },
      ],
    }));
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      // Reset to tutorial baseline so re-uploads don't pile up.
      setChat(createTutorialChat());
      setOwner(null);
      setPendingChat(null);
      setChatKey((k) => k + 1);

      appendSystemMessage(
        `${file.name} 파일을 읽는 중입니다... 잠시만 기다려 주세요`
      );

      let parsed: Chat | null = null;
      try {
        const raw = await readFile(file);
        parsed = parseKakaoTalkText(raw);
      } catch (err) {
        console.error(err);
      }

      if (!parsed || parsed.messages.length === 0) {
        appendSystemMessage("파일 읽기 실패: 지원하지 않는 파일 형식입니다.");
        return;
      }

      appendSystemMessage("자신으로 설정할 사용자 이름을 선택해주세요.");
      appendSelectMessage(parsed.users);
      setPendingChat(parsed);
    },
    [appendSystemMessage, appendSelectMessage]
  );

  const handleSelectOwner = useCallback(
    (username: string) => {
      if (!pendingChat || !username) return;
      setChat(pendingChat);
      setOwner(username);
      setChatKey((k) => k + 1);
    },
    [pendingChat]
  );

  return (
    <div class="h-screen flex justify-center bg-slate-700">
      <div class="relative flex flex-col w-full max-w-[480px] h-screen bg-kakao-bg shadow-xl overflow-hidden">
        <Header
          title={`${chat.roomName} (${chat.users.length})`}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <MessageList
          key={chatKey}
          messages={chat.messages}
          owner={owner}
          onSelectOwner={handleSelectOwner}
        />
        <Reply onFile={handleFile} />
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </div>
  );
}

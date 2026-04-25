import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { ListRange, VirtuosoHandle } from "react-virtuoso";
import { DatePicker } from "./components/date-picker";
import { Header } from "./components/header";
import { MessageList } from "./components/message-list";
import { Reply } from "./components/reply";
import { SearchBar } from "./components/search-bar";
import { SideMenu } from "./components/side-menu";
import { buildDateIndex } from "./lib/date-index";
import { pickVisibleDateIndex } from "./lib/visible-date";
import { readFile } from "./lib/read-file";
import { formatDateKorean, getCurrentDate, getCurrentTime } from "./lib/format";
import { findMatches } from "./lib/search";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [datePickerInitialDate, setDatePickerInitialDate] = useState<
    string | null
  >(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const visibleStartRef = useRef(0);
  const scrollPillTimerRef = useRef<number | null>(null);
  const [scrollingDate, setScrollingDate] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(1);

  const matches = useMemo(
    () => findMatches(chat.messages, searchQuery),
    [chat.messages, searchQuery]
  );

  const dateIndex = useMemo(
    () => buildDateIndex(chat.messages),
    [chat.messages]
  );

  const oldestIndex = chat.messages.length === 0 ? null : 0;

  const recentIndex = useMemo(() => {
    if (chat.messages.length === 0) return null;
    const lastDate = chat.messages[chat.messages.length - 1].date;
    return dateIndex.get(lastDate) ?? null;
  }, [chat.messages, dateIndex]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setCurrentMatchIdx(0);
  }, []);

  const closeDatePicker = useCallback(() => {
    setDatePickerOpen(false);
    setDatePickerInitialDate(null);
  }, []);

  const openDatePickerAt = useCallback((date: string | null) => {
    setDatePickerInitialDate(date);
    setDatePickerOpen(true);
  }, []);

  const handleDatePick = useCallback(
    (index: number) => {
      virtuosoRef.current?.scrollToIndex({ index, align: "start" });
      closeDatePicker();
    },
    [closeDatePicker]
  );

  const handleVisibleRangeChange = useCallback(
    (range: ListRange) => {
      const index = pickVisibleDateIndex(chat.messages, range);
      visibleStartRef.current = index;

      const msg = chat.messages[index];
      if (msg) setScrollingDate(msg.date);
    },
    [chat.messages]
  );

  const handleScroll = useCallback((event: Event) => {
    const el = event.target as HTMLElement;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? el.scrollTop / max : 1);
  }, []);

  const handleScrollingChange = useCallback((scrolling: boolean) => {
    if (scrollPillTimerRef.current !== null) {
      clearTimeout(scrollPillTimerRef.current);
      scrollPillTimerRef.current = null;
    }
    if (!scrolling) {
      scrollPillTimerRef.current = window.setTimeout(() => {
        setScrollingDate(null);
        scrollPillTimerRef.current = null;
      }, 800);
    }
  }, []);

  useEffect(() => {
    visibleStartRef.current = Math.max(0, chat.messages.length - 1);
    setScrollingDate(null);
    if (scrollPillTimerRef.current !== null) {
      clearTimeout(scrollPillTimerRef.current);
      scrollPillTimerRef.current = null;
    }
  }, [chatKey]);

  useEffect(() => {
    setCurrentMatchIdx(0);
  }, [searchQuery]);

  useEffect(() => {
    if (matches.length === 0) return;
    virtuosoRef.current?.scrollToIndex({
      index: matches[currentMatchIdx],
      align: "center",
    });
  }, [matches, currentMatchIdx]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "Escape") {
        if (datePickerOpen) {
          e.preventDefault();
          closeDatePicker();
        } else if (searchOpen) {
          e.preventDefault();
          closeSearch();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen, datePickerOpen, closeSearch, closeDatePicker]);

  const handleNext = useCallback(() => {
    setCurrentMatchIdx((i) => (matches.length === 0 ? 0 : (i + 1) % matches.length));
  }, [matches.length]);

  const handlePrev = useCallback(() => {
    setCurrentMatchIdx((i) =>
      matches.length === 0 ? 0 : (i - 1 + matches.length) % matches.length
    );
  }, [matches.length]);

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
          onToggleSearch={() => setSearchOpen((v) => !v)}
          onToggleDatePicker={() => {
            if (datePickerOpen) closeDatePicker();
            else {
              const visible = chat.messages[visibleStartRef.current];
              openDatePickerAt(visible?.date ?? null);
            }
          }}
        />
        {searchOpen && (
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            matchCount={matches.length}
            currentIndex={currentMatchIdx}
            onNext={handleNext}
            onPrev={handlePrev}
            onClose={closeSearch}
          />
        )}
        <div class="relative flex flex-col flex-1 min-h-0 min-w-0">
          <MessageList
            key={chatKey}
            messages={chat.messages}
            owner={owner}
            onSelectOwner={handleSelectOwner}
            virtuosoRef={virtuosoRef}
            searchQuery={searchOpen ? searchQuery : ""}
            currentMatchMessageIndex={
              searchOpen && matches.length > 0 ? matches[currentMatchIdx] : null
            }
            onDateHeaderClick={openDatePickerAt}
            onVisibleRangeChange={handleVisibleRangeChange}
            onScrollingChange={handleScrollingChange}
            onScroll={handleScroll}
          />
          {scrollingDate && (
            <div
              class="pointer-events-none absolute right-4 z-10 bg-kakao-timestamp/80 text-white text-xs rounded-full px-2.5 py-1 shadow"
              style={{
                top: `${scrollProgress * 100}%`,
                transform: `translateY(-${scrollProgress * 100}%)`,
              }}
            >
              {formatDateKorean(scrollingDate)}
            </div>
          )}
        </div>
        <Reply onFile={handleFile} />
        <SideMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          users={chat.users}
        />
        {datePickerOpen && (
          <DatePicker
            dateIndex={dateIndex}
            oldestIndex={oldestIndex}
            recentIndex={recentIndex}
            initialDate={datePickerInitialDate}
            onPick={handleDatePick}
            onClose={closeDatePicker}
          />
        )}
      </div>
    </div>
  );
}

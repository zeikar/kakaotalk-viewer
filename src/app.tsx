import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { ListRange, VirtuosoHandle } from "react-virtuoso";
import { DatePicker } from "./components/date-picker";
import { Header } from "./components/header";
import { MessageList } from "./components/message-list";
import { Reply } from "./components/reply";
import { SearchBar } from "./components/search-bar";
import { SideMenu } from "./components/side-menu";
import { useSearchNavigation } from "./hooks/use-search-navigation";
import { buildDateIndex } from "./lib/date-index";
import { pickVisibleDateIndex } from "./lib/visible-date";
import { readFile } from "./lib/read-file";
import { formatDateKorean, getCurrentDate, getCurrentTime } from "./lib/format";
import { parseKakaoTalkText } from "./parser";
import { createTutorialChat } from "./tutorial";
import type { Chat } from "./types";

const SYSTEM_USER = "카카오톡 뷰어";

export function App() {
  const [chat, setChat] = useState<Chat>(() => createTutorialChat());
  const [owner, setOwner] = useState<string | null>(null);
  const [pendingChat, setPendingChat] = useState<Chat | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Bumped on each chat replacement to remount the Virtuoso list and start
  // scroll position at the latest message.
  const [chatKey, setChatKey] = useState(0);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [datePickerInitialDate, setDatePickerInitialDate] = useState<
    string | null
  >(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const visibleStartRef = useRef(0);
  const scrollPillTimerRef = useRef<number | null>(null);
  const [scrollingDate, setScrollingDate] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(1);

  const scrollToMessage = useCallback((index: number) => {
    virtuosoRef.current?.scrollToIndex({ index, align: "center" });
  }, []);

  const {
    searchOpen,
    searchQuery,
    userFilter,
    currentMatchIdx,
    matches,
    setSearchQuery,
    openSearch,
    toggleSearch,
    closeSearch,
    clearUserFilter,
    handleNext,
    handlePrev,
    selectUser,
    selectUserFromMessage,
  } = useSearchNavigation({
    messages: chat.messages,
    scrollToIndex: scrollToMessage,
  });

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
    const latestIndex = Math.max(0, chat.messages.length - 1);
    visibleStartRef.current = latestIndex;
    setScrollingDate(null);
    if (scrollPillTimerRef.current !== null) {
      clearTimeout(scrollPillTimerRef.current);
      scrollPillTimerRef.current = null;
    }
  }, [chatKey]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        openSearch();
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
  }, [searchOpen, datePickerOpen, openSearch, closeSearch, closeDatePicker]);

  const handleSelectUser = useCallback(
    (username: string) => {
      selectUser(username);
      setMenuOpen(false);
    },
    [selectUser]
  );

  const handleSelectUserFromMessage = useCallback(
    (username: string, messageIndex: number) => {
      selectUserFromMessage(username, messageIndex);
      setMenuOpen(false);
    },
    [selectUserFromMessage]
  );

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

  const handleReset = useCallback(() => {
    closeSearch();
    closeDatePicker();
    setMenuOpen(false);
    setChat(createTutorialChat());
    setOwner(null);
    setPendingChat(null);
    setHasUploaded(false);
    setChatKey((k) => k + 1);
  }, [closeSearch, closeDatePicker]);

  const handleFile = useCallback(
    async (file: File) => {
      closeSearch();

      // On re-upload, reset to tutorial baseline so previous load's messages
      // don't pile up. On the very first upload from pristine tutorial, skip
      // the reset and just append — avoids a Virtuoso remount flicker.
      if (hasUploaded) {
        setChat(createTutorialChat());
        setOwner(null);
        setPendingChat(null);
        setChatKey((k) => k + 1);
      }
      setHasUploaded(true);

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
    [appendSystemMessage, appendSelectMessage, closeSearch, hasUploaded]
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
          onBack={hasUploaded ? handleReset : undefined}
          onOpenMenu={() => setMenuOpen(true)}
          onToggleSearch={toggleSearch}
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
            userFilter={userFilter}
            onClearUserFilter={clearUserFilter}
          />
        )}
        <div class="relative flex flex-col flex-1 min-h-0 min-w-0">
          <MessageList
            key={chatKey}
            messages={chat.messages}
            users={chat.users}
            owner={owner}
            onSelectOwner={handleSelectOwner}
            onSelectUser={handleSelectUserFromMessage}
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
          owner={owner}
          onSelectUser={handleSelectUser}
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

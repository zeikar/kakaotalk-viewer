import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { findMatches } from "../lib/search";
import type { Message } from "../types";

interface Options {
  messages: Message[];
  scrollToIndex: (index: number) => void;
}

export function findNearestMatchPosition(
  matches: number[],
  anchorIndex: number
): number {
  if (matches.length === 0) return 0;

  let nearestPosition = 0;
  let nearestDistance = Math.abs(matches[0] - anchorIndex);
  for (let i = 1; i < matches.length; i++) {
    const distance = Math.abs(matches[i] - anchorIndex);
    if (distance < nearestDistance) {
      nearestPosition = i;
      nearestDistance = distance;
    }
  }
  return nearestPosition;
}

export function useSearchNavigation({ messages, scrollToIndex }: Options) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState<string | null>(null);
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);
  const pendingUserFilterMatchIdxRef = useRef<number | null>(null);

  const matches = useMemo(
    () => findMatches(messages, searchQuery, userFilter),
    [messages, searchQuery, userFilter]
  );

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setUserFilter(null);
    setCurrentMatchIdx(0);
  }, []);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((v) => !v);
  }, []);

  const clearUserFilter = useCallback(() => {
    setUserFilter(null);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentMatchIdx((i) => (matches.length === 0 ? 0 : (i + 1) % matches.length));
  }, [matches.length]);

  const handlePrev = useCallback(() => {
    setCurrentMatchIdx((i) =>
      matches.length === 0 ? 0 : (i - 1 + matches.length) % matches.length
    );
  }, [matches.length]);

  const selectUser = useCallback((username: string) => {
    pendingUserFilterMatchIdxRef.current = null;
    setUserFilter(username);
    setSearchOpen(true);
    setCurrentMatchIdx(0);
  }, []);

  const selectUserFromMessage = useCallback(
    (username: string, messageIndex: number) => {
      const nextMatches = findMatches(messages, searchQuery, username);
      const nextMatchIdx = findNearestMatchPosition(nextMatches, messageIndex);
      pendingUserFilterMatchIdxRef.current = nextMatchIdx;
      setUserFilter(username);
      setSearchOpen(true);
      setCurrentMatchIdx(nextMatchIdx);
    },
    [messages, searchQuery]
  );

  useEffect(() => {
    const pendingMatchIdx = pendingUserFilterMatchIdxRef.current;
    pendingUserFilterMatchIdxRef.current = null;
    setCurrentMatchIdx(pendingMatchIdx ?? 0);
  }, [searchQuery, userFilter]);

  useEffect(() => {
    const target = matches[currentMatchIdx];
    if (target === undefined) return;
    scrollToIndex(target);
  }, [matches, currentMatchIdx, scrollToIndex]);

  return {
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
  };
}

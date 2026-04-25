export function formatIsoDate(
  year: number,
  month: number,
  day: number
): string {
  const m = month.toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function parseIsoDate(
  iso: string
): { year: number; month: number; day: number } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return {
    year: parseInt(m[1], 10),
    month: parseInt(m[2], 10),
    day: parseInt(m[3], 10),
  };
}

export function formatDateKorean(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  return `${parsed.year}년 ${parsed.month}월 ${parsed.day}일`;
}

export function getCurrentDate(): string {
  const date = new Date();
  return formatIsoDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

export function getCurrentTime(): string {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

// "4:38" + "오후" => "16:38"
export function convert12TimeTo24Time(time: string, ampm: string): string {
  const [hourStr, minute] = time.split(":");
  const hour = parseInt(hourStr, 10);

  let convertedHour = hour;
  if (ampm === "오전") {
    if (hour === 12) convertedHour = 0;
  } else {
    if (hour !== 12) convertedHour += 12;
  }

  return `${convertedHour.toString().padStart(2, "0")}:${minute}`;
}

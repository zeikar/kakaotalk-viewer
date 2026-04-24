export function getCurrentDate(): string {
  const date = new Date();
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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

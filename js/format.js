export function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

export function getCurrentTime() {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${hour}:${minute}`;
}

// "4:38" => "16:38"
export function convert12TimeTo24Time(time, ampm) {
  const hour = parseInt(time.split(":")[0]);
  const minute = time.split(":")[1];

  let convertedHour = hour;

  if (ampm == "오전") {
    if (hour == 12) {
      convertedHour = 0;
    }
  } else {
    if (hour != 12) {
      convertedHour += 12;
    }
  }

  return `${convertedHour.toString().padStart(2, "0")}:${minute}`;
}

export function generateColorByUserName(username) {
  const hash = username.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  const color = Math.abs(hash) % 16777216;
  return "#" + color.toString(16).padStart(6, "0") + "99";
}

export function getTextColorByBackgroundColor(backgroundColor) {
  const color = parseInt(backgroundColor.substring(1, 7), 16);
  const r = (color >> 16) & 255;
  const g = (color >> 8) & 255;
  const b = color & 255;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 127.5 ? "#000000" : "#ffffff";
}
// Based on https://regexr.com/39nr7
export function captureUrls(text) {
  const urlRegex =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#-=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.,~#?&//=]*)/gi;
  const matches = text.match(urlRegex);
  return matches ? matches.map((match) => match.trim()) : [];
}

import { readFile } from "./file.js";
import { parseKakaoTalkText } from "./parser.js";
import { displayChats } from "./renderer.js";

const button = document.getElementById("button");
button.addEventListener("click", startParsing);

async function startParsing() {
  const inputFile = document.getElementById("file");
  if (inputFile.files.length === 0) {
    alert("파일을 선택해주세요.");
    return;
  }

  const file = inputFile.files[0];
  const data = await readFile(file);
  const chatData = parseKakaoTalkText(data);
  console.log(chatData);
  displayChats(chatData);
}

import { App } from "./app.js";

const button = document.getElementById("button");
button.addEventListener("click", startParsing);

const app = new App();
await app.generateTutorialChatData();
app.display();

async function startParsing() {
  const inputFile = document.getElementById("file");
  if (inputFile.files.length === 0) {
    alert("파일을 선택해주세요.");
    return;
  }

  const file = inputFile.files[0];

  app.addMessage("카카오톡 뷰어", `${file.name} 파일을 읽는 중입니다...`);
  app.display();

  await app.generateChatDataFromFile(file);
  app.display();
}

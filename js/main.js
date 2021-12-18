import { App } from "./app.js";

const app = new App();

const button = document.getElementById("button");
button.addEventListener("click", app.startParsing.bind(app));

window.addEventListener(
  "scroll",
  () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    app.updateScroll(scrollTop, scrollHeight, clientHeight);
  },
  {
    passive: true,
  }
);

await app.generateTutorialChatData();
app.display();

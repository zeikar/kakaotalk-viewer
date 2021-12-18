import { App } from "./app.js";

const app = new App();

const button = document.getElementById("button");
button.addEventListener("click", app.startParsing.bind(app));

await app.generateTutorialChatData();
app.display();

import { App } from "./app.js";
import { closeSideMenu, openSideMenu } from "./sidemenu.js";

const app = new App();

const startButton = document.getElementById("button");
startButton.addEventListener("click", app.startParsing.bind(app));

const sideMenuButton = document.getElementById("side-menu-open");
sideMenuButton.addEventListener("click", () => {
  openSideMenu();
});

const sideMenuCloseButton = document.getElementById("side-menu-close");
sideMenuCloseButton.addEventListener("click", () => {
  closeSideMenu();
});

const sideMenuBackground = document.getElementById("side-menu-background");
sideMenuBackground.addEventListener("click", () => {
  closeSideMenu();
});

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

app.generateTutorialChatData();
app.display();

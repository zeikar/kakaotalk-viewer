export function openSideMenu() {
  const sideMenu = document.getElementById("side-menu");
  sideMenu.classList.add("open");
  const background = document.getElementById("side-menu-background");
  background.classList.add("open");
}

export function closeSideMenu() {
  const sideMenu = document.getElementById("side-menu");
  sideMenu.classList.remove("open");
  const background = document.getElementById("side-menu-background");
  background.classList.remove("open");
}

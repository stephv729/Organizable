import { appKey, tokenKey } from "../config.js";
import DOMHandler from "../DOM-handler.js";
import homePage from "../pages/home-page.js";
import loginPage from "../pages/login-page.js";
import STORE from "../store.js";

function renderHeader() {
  return `
  <div class="clickable p-0_75 logo js-logo">{organizable}</div>
  `;
}

function homeLinkListener() {
  const link = document.querySelector(".js-logo");
  link.addEventListener("click", () => {
    STORE.currentPage = "myBoards";
    const token = sessionStorage.getItem(tokenKey);
    if (!token) {
      try {
        DOMHandler.load(loginPage);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        STORE.currentPage="myBoards"
        localStorage.setItem(appKey, STORE.currentPage)
        DOMHandler.load(homePage);
      } catch (error) {
        console.log(error.message);
      }
    }
  });
}

const header = {
  toString: () => renderHeader(),
  addListeners: () => {
    homeLinkListener();
  },
};

export default header;

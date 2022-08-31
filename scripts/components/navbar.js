import { appKey, userId } from "../config.js";
import DOMHandler from "../DOM-handler.js";
import closedBoardsPage from "../pages/closedBoards-page.js";
import homePage from "../pages/home-page.js";
import myProfilePage from "../pages/myProfile-page.js";
import getResponse from "../services/api-fetch.js";
import { reinit } from "../services/session-services.js";
import STORE from "../store.js";
import header from "./header.js";

function renderNavbar() {
  return `
  <aside class="bg-white min-w-15 flex flex-column space-between">
    <div>
      ${header}
      <div class="js-myboards clickable h-2_5 flex pt-0_5">
        <div class="w-0_25 ${
          STORE.currentPage == "myBoards" ? "bg-primary500" : ""
        }"></div>
        <div class="w-100p flex center-items gap-0_5 pl-1 ${
          STORE.currentPage == "myBoards" ? "bg-primary100" : ""
        }">
          <div class="p-0_1875">
            <img src="images/boards.svg" alt="boards">
          </div>
          <span> My Boards </span>
        </div>
      </div>
      <div class="js-closed-boards clickable h-2_5 flex pt-0_5">
        <div class="w-0_25 ${
          STORE.currentPage == "closedBoards" ? "bg-primary500" : ""
        }"></div>
        <div class="w-100p flex center-items gap-0_5 pl-1 ${
          STORE.currentPage == "closedBoards" ? "bg-primary100" : ""
        }">
          <div class="p-0_1875">
            <img src="images/closed-boards.svg" alt="closed-boards">
          </div>
          <span> Closed Boards </span>
        </div>
      </div>
      <div class="js-my-profile clickable h-2_5 flex pt-0_5">
        <div class="w-0_25 ${
          STORE.currentPage == "myProfile" ? "bg-primary500" : ""
        }"></div>
        <div class="w-100p flex center-items gap-0_5 pl-1 ${
          STORE.currentPage == "myProfile" ? "bg-primary100" : ""
        }">
          <div class="p-0_1875">
            <img src="images/profile.svg" alt="my-profile">
          </div>
          <span> My Profile </span>
        </div>
      </div>
    </div>
    <div class="js-logout-link clickable h-2_5 flex ptb-2_625 border-t-primary400">
        <div class="w-0_25"></div>
        <div class="w-100p flex center-items gap-0_5 pl-1">
          <div class="p-0_1875">
            <img src="images/logout.svg" alt="logout">
          </div>
          <a href=""> Logout </a>
        </div>
      </div>
  </aside>
  `;
}

function myBoardsListener() {
  const link = document.querySelector(".js-myboards");
  link.addEventListener("click", () => {
    STORE.currentPage = "myBoards";
    localStorage.setItem(appKey, STORE.currentPage);
    DOMHandler.load(homePage);
  });
}

function closedBoardsListener() {
  const link = document.querySelector(".js-closed-boards");
  link.addEventListener("click", () => {
    STORE.currentPage = "closedBoards";
    localStorage.setItem(appKey, STORE.currentPage);
    DOMHandler.load(closedBoardsPage);
  });
}
function myProfileListener() {
  const link = document.querySelector(".js-my-profile");
  link.addEventListener("click", async () => {
    STORE.currentPage = "myProfile";
    localStorage.setItem(appKey, STORE.currentPage);
    myProfilePage.state.message = null;
    DOMHandler.load(myProfilePage);
  });
}
function logoutListener() {
  const link = document.querySelector(".js-logout-link");
  link.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await getResponse("/logout", { method: "POST" });
      reinit();
    } catch (error) {
      console.log(error);
      reinit(error);
    }
  });
}

const navbar = {
  toString: () => renderNavbar(),
  addListeners: () => {
    header.addListeners();
    myBoardsListener();
    closedBoardsListener();
    myProfileListener();
    logoutListener();
  },
};

export default navbar;

import { appKey, tokenKey, userId } from "./scripts/config.js";
import DOMHandler from "./scripts/DOM-handler.js";
import closedBoardsPage from "./scripts/pages/closedBoards-page.js";
import currentBoardPage from "./scripts/pages/currentBoard-page.js";
import homePage from "./scripts/pages/home-page.js";
import loginPage from "./scripts/pages/login-page.js";
import myProfilePage from "./scripts/pages/myProfile-page.js";
import getResponse from "./scripts/services/api-fetch.js";
import { reinit } from "./scripts/services/session-services.js";
import STORE from "./scripts/store.js";

const token = sessionStorage.getItem(tokenKey);
const id = sessionStorage.getItem(userId);
const currentPage = localStorage.getItem(appKey);
STORE.currentPage = currentPage;

async function init() {
  if (!token || !id) {
    DOMHandler.load(loginPage);
  } else {
    try {
      await STORE.fetchBoards();
      STORE.user = await getResponse(`/users/${id}`);
      let module;
      switch (currentPage) {
        case "myBoards":
          module = homePage;
          break;
        case "closedBoards":
          module = closedBoardsPage;
          break;
        case "myProfile":
          module = myProfilePage;
          break;
        case currentPage.match(/currentBoard/)?.input:
          const board = STORE.boards.find((b) => b.id == currentPage.split("-")[1]);
          STORE.currentBoard.self = board;
          await STORE.fetchLists()
          module = currentBoardPage;
          break;
        default:
          STORE.currentPage = "myBoards"
          module = homePage;
          break;
      }
      DOMHandler.load(module);
    } catch (error) {
      reinit(error);
      console.log(error);
    }
  }
}

init();

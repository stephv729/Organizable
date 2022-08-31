import { appKey } from "../config.js";
import DOMHandler from "../DOM-handler.js";
import currentBoardPage from "../pages/currentBoard-page.js";
import getResponse from "../services/api-fetch.js";
import STORE from "../store.js";

const boards = {
  toString: () => renderBoards(),
  addListeners: () => {
    starListener();
    trashAndRecoverListener();
    purgeListener();
    nameBoardListener();
  },
};

export const starredBoards = {
  toString: () => renderBoards("starred"),
};

function renderBoards(starred = null) {
  const status = STORE.currentPage === "closedBoards";
  let boards = STORE.boards.filter((board) => board.closed === status);
  if (starred) boards = boards.filter((board) => board.starred === true);
  return boards.map(renderBoard).join("");
}

function renderBoard(board) {
  return `
    <li>
      <div style="background-color: ${
        board.color
      }" class="board flex flex-column space-between" data-id=${board.id}>
        <div class="h-100p ${board.closed ? "" : "js-board-name clickable"}">
          <span class="content--lg">${board.name}</span>
        </div>
        <div class="flex gap-0_5 right">
        ${
          board.closed
            ? `
          <div class="js-trash-and-recover opaque icon-container flex center center-items clickable">
            <img class="icon" src="images/recover.svg" alt="trash"></img>
          </div>
          <div class="js-purge opaque icon-container flex center center-items clickable">
            <img class="icon" src="images/trash.svg" alt="trash"></img>
          </div>
        `
            : `
          <div class="js-trash-and-recover opaque icon-container flex center center-items clickable">
            <img class="icon" src="images/trash.svg" alt="trash"></img>
          </div>
          <div class="js-star opaque icon-container flex center center-items clickable">
            <img class="icon" src="images/${
              board.starred ? "starred" : "non-starred"
            }.svg" alt="star"></img>
          </div>
        `
        }
        <div>
      </div>
    </li>
  `;
}

function hoverEffect(icon) {
  icon.addEventListener("mouseenter", () => {
    icon.classList.remove("opaque");
  });
  icon.addEventListener("mouseleave", () => {
    icon.classList.add("opaque");
  });
}

function starListener() {
  const starIcons = document.querySelectorAll(".js-star");
  starIcons.forEach((icon) => {
    hoverEffect(icon);
    icon.addEventListener("click", async (event) => {
      const boardContainer = event.target.closest("[data-id]");
      const board = STORE.boards.find((b) => b.id == boardContainer.dataset.id);
      try {
        await getResponse(`/boards/${board.id}`, {
          method: "PATCH",
          body: { starred: !board.starred },
        });
        await STORE.fetchBoards();
        DOMHandler.reload();
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function trashAndRecoverListener() {
  const trashIcons = document.querySelectorAll(".js-trash-and-recover");
  trashIcons.forEach((icon) => {
    hoverEffect(icon);
    icon.addEventListener("click", async (event) => {
      const boardContainer = event.target.closest("[data-id]");
      const board = STORE.boards.find((b) => b.id == boardContainer.dataset.id);
      try {
        await getResponse(`/boards/${board.id}`, {
          method: "PATCH",
          body: { closed: !board.closed },
        });
        await STORE.fetchBoards();
        DOMHandler.reload();
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function purgeListener() {
  const purgeIcons = document.querySelectorAll(".js-purge");
  purgeIcons.forEach((icon) => {
    hoverEffect(icon);
    icon.addEventListener("click", async (event) => {
      const boardContainer = event.target.closest("[data-id]");
      const board = STORE.boards.find((b) => b.id == boardContainer.dataset.id);
      try {
        await getResponse(`/boards/${board.id}`, {
          method: "DELETE",
        });
        await STORE.fetchBoards();
        DOMHandler.reload();
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function nameBoardListener() {
  const nameLinks = document.querySelectorAll(".js-board-name");
  nameLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const boardContainer = event.target.closest("[data-id]");
      const board = STORE.boards.find((b) => b.id == boardContainer.dataset.id);
      STORE.currentBoard.self = board;
      STORE.currentPage = `currentBoard-${board.id}`
      localStorage.setItem(appKey,STORE.currentPage)
      await STORE.fetchLists();
      DOMHandler.load(currentBoardPage);
    });
  });
}

export default boards;

import boards, { starredBoards } from "../components/boards.js";
import navbar from "../components/navbar.js";
import DOMHandler from "../DOM-handler.js";
import getResponse from "../services/api-fetch.js";
import STORE from "../store.js";

const homePage = {
  toString: () => {
    return render();
  },
  addListeners: () => {
    navbar.addListeners();
    boards.addListeners();
    createBoardListener();
    // paletteListener();
  },
};

export default homePage;

function render() {
  return `
  <main class="flex min-h-100vh">
    ${navbar}
    <section class="mt-1 p-2"> 
      <h2 class="heading"> My Boards </h2>
      <div class="mt-2"> 
      ${
        starredBoards == ""
        ? ""
        : `
        <h3 class="mb-2 heading--sm"> Starred Boards </h3>
        <ul role="list" class="flex gap-1 wrap">
          ${starredBoards}
        </ul>
        `
        }
      </div>
      <div class="mt-2">
        <h3 class="mb-2 heading--sm"> Boards </h3>
        <ul role="list" class="flex gap-1 wrap">
          ${boards}
          <li>
            <a href="" class="js-create-board content--lg create-board flex flex-column center center-items">
              Create Board
            </a>
          </li>
        </ul>
        <form class="js-new-board-form flex center center-items"></form>
      </div>
    </section>
  </main>
  `;
}

function createBoardListener() {
  const link = document.querySelector(".js-create-board");
  const form = document.querySelector(".js-new-board-form");
  link.addEventListener("click", (event) => {
    event.preventDefault();
    form.classList.add("new-board__form");
    // document.querySelector("#root").classList.add("position-relative")
    form.innerHTML = `
    <div class="flex flex-column end-items">
      <div class="p-0_4">
        <img class="js-form-exit form-exit" src="images/exit.svg"></img>
      </div>
      <div class="flex gap-1 p-1">
        <div class="js-new-board board flex flex-column space-between" style="background-color: var(--palette-100)">
          <input id="board-name" class="create-board__input content-lg" placeholder="Board name" required />
          <div class="flex gap-0_5 right">
            <button class="bg-gray100 content-xs">Create</button>
          </div>
        </div>
        <ul class="palette flex wrap gap-0_5" role="list">
          <li data-color="100" style="background-color:var(--palette-100)"></li>
          <li data-color="200" style="background-color:var(--palette-200)"></li>
          <li data-color="300" style="background-color:var(--palette-300)"></li>
          <li data-color="400" style="background-color:var(--palette-400)"></li>
          <li data-color="500" style="background-color:var(--palette-500)"></li>
          <li data-color="600" style="background-color:var(--palette-600)"></li>
          <li data-color="700" style="background-color:var(--palette-700)"></li>
          <li data-color="800" style="background-color:var(--palette-800)"></li>
          <li data-color="900" style="background-color:var(--palette-900)"></li>
        </ul>
      </div>
      </div>
    `;
    formListener();
  });
}

function formListener() {
  const form = document.querySelector(".js-new-board-form");
  const newBoard = form.querySelector(".js-new-board");
  const colors = form.querySelectorAll("[data-color]");
  const exit = form.querySelector(".js-form-exit");

  exit.addEventListener("click", () => {
    form.innerHTML = "";
    form.classList.remove("new-board__form");
    // document.querySelector("#root").classList.remove("position-relative")
  });

  colors.forEach((color) => {
    color.addEventListener("click", (event) => {
      const colorCode = event.target.dataset.color;
      newBoard.style.backgroundColor = `var(--palette-${colorCode})`;
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const boardName = form.querySelector("#board-name").value;
    try {
      await getResponse("/boards", {
        body: {
          name: boardName,
          color: newBoard.style.backgroundColor,
        },
      });
      await STORE.fetchBoards();
      DOMHandler.reload();
    } catch (error) {
      console.log(error);
    }
  });
}

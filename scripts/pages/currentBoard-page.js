import header from "../components/header.js";
import lists from "../components/lists.js";
import DOMHandler from "../DOM-handler.js";
import getResponse from "../services/api-fetch.js";
import STORE from "../store.js";

function render() {
  const board = STORE.currentBoard.self;
  const listArr = STORE.currentBoard.lists;
  return `
  <main class="flex flex-column min-h-100vh" style="background-color:${board.color}">
    <div class="flex center center-items bg-gray100">${header}</div>
    <section class="p-2"> 
      <h2 class="mb-1 heading color-gray500">${board.name}</h2>
      <div class="flex wrap ${listArr.length === 0 ? "" : "gap-2_5"}">      
       <ul role="list" class="js-lists lists flex wrap gap-2_5">
        ${lists}
       </ul>
       <div class="list-form__container flex flex-column p-0_5">
        <form class="js-add-list-form add-list__form flex space-between">
          <input required placeholder = "new list" id="list-name" class="name-list__input">
          <button class="p-0_125 flex center center-items">
            <img src="images/add-button.png" alt="edit"><img>
          </button>
        </form>
       </div>
      </div>
    </section>
  </main>`;
}

function addListListener() {
  const board = STORE.currentBoard.self;
  const addListForms = document.querySelectorAll(".js-add-list-form");
  addListForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        await getResponse(`/boards/${board.id}/lists`, {
          body: { name: form.querySelector("#list-name").value },
        });
        await STORE.fetchLists();
        DOMHandler.reload();
      } catch (error) {
        console.log(error);
        //cambiar el color del input
      }
    });
  });
}

function boardSortable() {
  const board = STORE.currentBoard.self;
  const listsContainer = document.querySelector(".js-lists");
  Sortable.create(listsContainer, {
    animation: 150,
    store: {
      set: async function (sorteable) {
        const order = sorteable.toArray().map(Number);
        try {
          await getResponse(`/boards/${board.id}/lists/sort`, {
            body: { ids: order },
          });
        } catch (error) {
          console.log(error);
        }
      },
    },
  });
}

const currentBoardPage = {
  toString: () => {
    return render();
  },
  addListeners: () => {
    addListListener();
    boardSortable();
    header.addListeners();
    lists.addListeners();
  },
};

export default currentBoardPage;

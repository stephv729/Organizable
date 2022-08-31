import DOMHandler from "../DOM-handler.js";
import getResponse from "../services/api-fetch.js";
import STORE from "../store.js";
import cards from "./cards.js";

const lists = {
  toString: () => renderLists(),
  addListeners: () => {
    editListener();
    editCancelListener();
    addCardListener();
    deleteListListener();
    cardListSortable();
    cards.addListeners();
  },
};

function renderLists() {
  const lists = STORE.currentBoard.lists;
  return lists.map(renderList).join("");
}

function renderList(list) {
  const currentList = STORE.currentList;
  return `
    <li class="list flex flex-column p-0_5" data-id="${list.listId}">
      <div class="flex space-between">
       ${
         list === currentList.self && currentList.editMode
           ? `
       <input autofocus value="${list.name}" id="list-name" class="name-list__input">
       <div class="flex gap-0_5">
        <div class="js-edit-list p-0_125 flex center center-items clickable">
          <img src="images/ok-button.svg" alt="ok"><img>
        </div>
        <div class="js-edit-list-cancel p-0_125 flex center center-items clickable">
          <img src="images/cancel-button.svg" alt="cancel"><img>
        </div>
       </div>
       `
           : `
       <span class="js-list-name">${list.name}</span>
       <div class="flex gap-0_5">
         <div class="js-edit-list p-0_125 flex center center-items clickable">
           <img src="images/edit.svg" alt="edit"><img>
         </div>
         <div class="js-delete-list p-0_125 flex center center-items clickable">
           <img src="images/trash.svg" alt="edit"><img>
         </div>
       </div>
       `
       }
      </div>
      <div style="height:1px" class="bg-gray300 mtb-0_625"></div>
      <div class="flex flex-column gap-0_625">
        <ul role="list" class="js-cards-list flex flex-column gap-0_625">
          ${list.cards.map(cards.renderCard).join("")}         
        </ul>
        <form class="js-add-card-form add-card__form flex space-between">
              <input required placeholder = "new card" id="card-name" class="name-list__input">
              <button class="p-0_125 flex center center-items">
                <img src="images/add-button.png" alt="edit"><img>
              </button>
        </form>
      </div>
    </li>
  `;
}

function editListener() {
  const board = STORE.currentBoard.self;
  const lists = STORE.currentBoard.lists;
  const editIcons = document.querySelectorAll(".js-edit-list");
  editIcons.forEach((icon) => {
    icon.addEventListener("click", async (event) => {
      const listContainer = event.target.closest("[data-id]");
      const list = lists.find((l) => l.listId == listContainer.dataset.id);
      const editMode = STORE.currentList.editMode;
      STORE.currentList.self = list;
      if (editMode) {
        try {
          await getResponse(`/boards/${board.id}/lists/${list.listId}`, {
            method: "PATCH",
            body: {
              name: listContainer.querySelector("#list-name").value,
            },
          });
          await STORE.fetchLists();
        } catch (error) {
          console.log(error);
        }
      }
      STORE.currentList.editMode = !editMode;
      DOMHandler.reload();
    });
  });
}

function editCancelListener() {
  const editIcons = document.querySelectorAll(".js-edit-list-cancel");
  editIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const editMode = STORE.currentList.editMode;
      STORE.currentList.editMode = !editMode;
      DOMHandler.reload();
    });
  });
}

function deleteListListener() {
  const board = STORE.currentBoard.self;
  const lists = STORE.currentBoard.lists;
  const deleteIcons = document.querySelectorAll(".js-delete-list");
  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", async (event) => {
      const listContainer = event.target.closest("[data-id]");
      const list = lists.find((l) => l.listId == listContainer.dataset.id);
      try {
        await getResponse(`/boards/${board.id}/lists/${list.listId}`, {
          method: "DELETE",
        });
        await STORE.fetchLists();
        DOMHandler.reload();
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function addCardListener() {
  const lists = STORE.currentBoard.lists;
  const addCardForms = document.querySelectorAll(".js-add-card-form");
  addCardForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const listContainer = event.target.closest("[data-id]");
      const list = lists.find((l) => l.listId == listContainer.dataset.id);
      try {
        await getResponse(`/lists/${list.listId}/cards`, {
          body: { name: form.querySelector("#card-name").value },
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

function cardListSortable() {
  const cardsLists = document.querySelectorAll(".js-cards-list");
  cardsLists.forEach((list) => {
    const listId = list.closest("[data-id]").dataset.id;
    Sortable.create(list, {
      animation: 150,
      dataIdAttr: "data-card-id",
      store: {
        set: async function (sorteable) {
          const order = sorteable.toArray().map(Number);
          try {
            await getResponse(`/lists/${listId}/cards/sort`,{
              body: {ids:order}
            })
          } catch (error) {
            console.log(error);
          }
        },
      },
    });
  });
}

export default lists;

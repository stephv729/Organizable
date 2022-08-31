import DOMHandler from "../DOM-handler.js";
import getResponse from "../services/api-fetch.js";
import STORE from "../store.js";

function renderCard(card) {
  return `
    <li data-card-id="${card.cardId}" class="dragable">
      <div class="flex space-between">
        <span>${card.name}</span>
        <div class="flex gap-0_5">
          <div class="js-delete-card p-0_125 flex center center-items clickable">
            <img src="images/trash.svg" alt="edit"><img>
          </div>
      <div>
    </li>
  `;
}

function deleteCardListener() {
  const lists = STORE.currentBoard.lists;
  const deleteIcons = document.querySelectorAll(".js-delete-card");
  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", async (event) => {
      const listContainer = event.target.closest("[data-id]");
      const cardContainer = event.target.closest("[data-card-id]");
      const list = lists.find((l) => l.listId == listContainer.dataset.id);
      const card = list.cards.find(
        (c) => c.cardId == cardContainer.dataset.cardId
      );
      try {
        await getResponse(`/lists/${list.listId}/cards/${card.cardId}`,{
          method: "DELETE"
        })
        await STORE.fetchLists()
        DOMHandler.reload()
      } catch (error) {
        console.log(error);
      }
    });
  });
}

const cards = {
  renderCard,
  addListeners: () => {
    deleteCardListener();
  },
};

export default cards;

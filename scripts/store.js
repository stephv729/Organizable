import getResponse from "./services/api-fetch.js";

const STORE = {
  user: {},
  boards: [],
  currentPage: "myBoards",
  currentBoard: {
    self: null,
    lists: [],
  },
  currentList: {
    self: null,
    editMode: false,
  },
  fetchBoards,
  fetchLists,
};

async function fetchBoards() {
  try {
    this.boards = await getResponse("/boards");
  } catch (error) {
    throw Error(error.message);
  }
}

async function fetchLists() {
  const id = this.currentBoard.self.id;
  try {
    const boardDetails = await getResponse(`/boards/${id}`);
    this.currentBoard.lists = boardDetails.lists;
  } catch (error) {
    throw Error(error.message);
  }
}

export default STORE;

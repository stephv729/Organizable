import boards from "../components/boards.js";
import navbar from "../components/navbar.js";

const closedBoardsPage = {
  toString: ()=>{
    return render()
  },
  addListeners: ()=>{
    navbar.addListeners()
    boards.addListeners()
  },
}

export default closedBoardsPage;

function render() {
  return `
  <main class="flex min-h-100vh">
    ${navbar}
    <section class="mt-1 p-2"> 
      <h2 class="heading mb-2"> Closed Boards </h2>
      <ul role="list" class="flex wrap gap-1">
        ${boards}
      </ul>
    </section>
  </main>
  `
}
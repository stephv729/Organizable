import header from "../components/header.js";
import { createInput } from "../components/inputs.js";
import { tokenKey, userId } from "../config.js";
import DOMHandler from "../DOM-handler.js";
import getResponse from "../services/api-fetch.js";
import STORE from "../store.js";
import homePage from "./home-page.js";
import signupPage from "./signup-page.js";

const loginPage = {
  toString: () => {
    return render();
  },
  addListeners: () => {
    header.addListeners();
    loginListener();
    signupLinkListener();
  },
  state: {
    loginError: null,
  },
};

function render() {
  const error = loginPage.state.loginError;
  return `
  <main class="flex flex-column center-items center min-h-100vh">
  ${header}
  <h2 class="heading"> Login </h2>
  <form class="js-login-form login-form flex flex-column gap-1 w-30">
  <h3> ${error ? error : ""} </h3>
  ${createInput({
    label: "USERNAME",
    id: "username",
    placeholder: "username",
    icon: "images/username.svg",
  })}

  ${createInput({
    label: "PASSWORD",
    id: "password",
    placeholder: "******",
    type: "password",
    icon: "images/password.svg",
  })}

  <button class="w-100p bg-secondary100">Login</button>
  </form>
  <a href="/" class="js-signup-link">Create an account</a>
  </main>
  `;
}

function loginListener() {
  const form = document.querySelector(".js-login-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = {},
      fields = ["username", "password"];

    fields.forEach((field) => {
      body[field] = form.querySelector(`#${field}`).value;
    });

    try {
      const data = await getResponse("/login", { body: body });
      sessionStorage.setItem(tokenKey, data.token);
      sessionStorage.setItem(userId, data.id);
      STORE.user = await getResponse(`/users/${data.id}`);
      await STORE.fetchBoards();
      DOMHandler.load(homePage);
      // console.clear()
    } catch (error) {
      console.log(error);
      loginPage.state.loginError = JSON.parse(error.message);
      DOMHandler.reload();
    }
  });
}

function signupLinkListener() {
  const link = document.querySelector(".js-signup-link");
  link.addEventListener("click", (event) => {
    event.preventDefault();
    DOMHandler.load(signupPage);
  });
}

export default loginPage;

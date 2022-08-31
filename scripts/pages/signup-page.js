import header from "../components/header.js";
import { createInput } from "../components/inputs.js";
import { tokenKey, userId } from "../config.js";
import DOMHandler from "../DOM-handler.js";
import getResponse from "../services/api-fetch.js";
import STORE from "../store.js";
import homePage from "./home-page.js";
import loginPage from "./login-page.js";

const signupPage = {
  toString: () => {
    return render();
  },
  addListeners: () => {
    header.addListeners();
    signupListener();
    loginLinkListener();
  },
  state: {
    passwordError: null,
  },
};

function render() {
  return `
  ${header}
  <h2> Create an account </h2>
  <form class="js-signup-form">
  
  ${createInput({
    label: "USERNAME",
    id: "username",
    placeholder: "joeDoe1",
    icon: "images/username.svg",
    required: true,
  })}

  ${createInput({
    label: "EMAIL",
    id: "email",
    placeholder: "joe.doe@mail.com",
    icon: "images/email.svg",
  })}

  ${createInput({
    label: "FIRST NAME",
    id: "first_name",
    placeholder: "Joe",
    icon: "images/name.svg",
  })}

  ${createInput({
    label: "LAST NAME",
    id: "last_name",
    placeholder: "Doe",
    icon: "images/name.svg",
  })}

  ${createInput({
    label: "PASSWORD",
    id: "password",
    placeholder: "******",
    type: "password",
    icon: "images/password.svg",
    error: signupPage.state.passwordError,
  })}

  <button>Create account</button>
  </form>
  <a href="/" class ="js-login-link">Login</a>
  `;
}

function signupListener() {
  const form = document.querySelector(".js-signup-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const body = {},
      fields = ["username", "email", "first_name", "last_name", "password"];

    fields.forEach((field) => {
      body[field] = form.querySelector(`#${field}`).value;
    });

    try {
      const data = await getResponse("/users", { body: body });
      sessionStorage.setItem(tokenKey, data.token);
      sessionStorage.setItem(userId, data.id);
      STORE.user = await getResponse(`/users/${data.id}`);
      await STORE.fetchBoards();
      DOMHandler.load(homePage);
    } catch (error) {
      console.log(error);
      signupPage.state.passwordError = JSON.parse(error.message).password;
      DOMHandler.reload();
    }
  });
}

function loginLinkListener() {
  const link = document.querySelector(".js-login-link");
  link.addEventListener("click", (event) => {
    event.preventDefault();
    DOMHandler.load(loginPage);
  });
}

export default signupPage;

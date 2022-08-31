import { createInput } from "../components/inputs.js";
import navbar from "../components/navbar.js";
import DOMHandler from "../DOM-handler.js";
import getResponse from "../services/api-fetch.js";
import { reinit } from "../services/session-services.js";
import STORE from "../store.js";

function render() {
  const msg = myProfilePage.state.message;
  const user = STORE.user;
  return `
  <main class="flex min-h-100vh">
  ${navbar}
  <section class="w-100p mt-1 p-2"> 
      <h2 class="heading mb-2"> My Profile </h2>
      <div class="my-profile h-100p flex flex-column center-items gap-1">
      ${msg ? `<h3>${msg}</h3>` : ""}
      <form class="js-my-profile-form my-profile-form w-30 flex flex-column center gap-1">
      ${createInput({
        label: "USERNAME",
        id: "username",
        placeholder: "joeDoe1",
        icon: "images/username.svg",
        required: true,
        value: user.username,
      })}
      
        ${createInput({
          label: "EMAIL",
          id: "email",
          placeholder: "joe.doe@mail.com",
          icon: "images/email.svg",
          value: user.email,
        })}
      
        ${createInput({
          label: "FIRST NAME",
          id: "first_name",
          placeholder: "Joe",
          icon: "images/name.svg",
          value: user.firstName,
        })}
        
        ${createInput({
          label: "LAST NAME",
          id: "last_name",
          placeholder: "Doe",
          icon: "images/name.svg",
          value: user.lastName,
        })}
        <button class="bg-primary300 content-sm">Update profile</button>
      </form>
      <button class="js-delete-account bg-secondary100 content-sm w-30">Delete account</button>
      </div>
      </section>
      </main>
      `;
}

function deleteAccountListener() {
  const user = STORE.user;
  const button = document.querySelector(".js-delete-account");
  button.addEventListener("click", async () => {
    try {
      await getResponse(`/users/${user.id}`, {
        method: "DELETE",
      });
      reinit()
    } catch (error) {
      console.log(error)
    }
  });
}

function updateProfileListener() {
  const user = STORE.user;
  const form = document.querySelector(".js-my-profile-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = {},
      fields = ["username", "email", "first_name", "last_name"];

    fields.forEach((field) => {
      body[field] = form.querySelector(`#${field}`).value;
    });
    try {
      const data = await getResponse(`/users/${user.id}`, {
        method: "PATCH",
        body: body,
      });
      STORE.user = data;
      myProfilePage.state.message =
        "Your profile has been updated successfully";
      DOMHandler.reload();
    } catch (error) {
      console.log(error);
    }
  });
}

function dispelMsg() {
  if (myProfilePage.state.message) {
    setTimeout(() => {
      myProfilePage.state.message = null;
      DOMHandler.reload();
    }, 5000);
  }
}

const myProfilePage = {
  toString: () => {
    return render();
  },
  addListeners: () => {
    navbar.addListeners();
    updateProfileListener();
    deleteAccountListener();
    dispelMsg();
  },
  state: {
    message: null,
  },
};

export default myProfilePage;

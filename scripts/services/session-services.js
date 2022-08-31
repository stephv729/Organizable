import { appKey, tokenKey, userId } from "../config.js";
import DOMHandler from "../DOM-handler.js";
import loginPage from "../pages/login-page.js";

export function reinit(error = {message:""}) {
  if (error.message.includes("Access denied")) window.alert(error.message);
  sessionStorage.removeItem(tokenKey);
  sessionStorage.removeItem(userId);
  localStorage.removeItem(appKey)
  DOMHandler.load(loginPage);
  console.clear();
}

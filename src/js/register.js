import { loadHeaderFooter } from "./utils.mjs";
import { registerRequest } from "./auth.mjs";

loadHeaderFooter();

const registerForm = document.querySelector("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    registerRequest({ name, email, password }, "/WDD330/login/index.html");
  });
}

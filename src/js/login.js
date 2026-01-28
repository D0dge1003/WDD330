import { loadHeaderFooter } from "./utils.mjs";
import { loginRequest } from "./auth.mjs";

loadHeaderFooter();

const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // Get optional redirect param
    const urlParams = new URLSearchParams(window.location.search);
    const rawRedirect = urlParams.get("redirect") || "/WDD330/orders/index.html";

    // Validate redirect to prevent open-redirect vulnerabilities
    // Must start with / and not be protocol-relative //
    const redirect = (rawRedirect.startsWith("/") && !rawRedirect.startsWith("//"))
      ? rawRedirect
      : "/WDD330/orders/index.html";

    loginRequest({ email, password }, redirect);
  });
}

import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".checkout-summary");
myCheckout.init();

const zipEl = document.querySelector("#zip");
if (zipEl) {
  zipEl.addEventListener("blur", myCheckout.calculateOrdertotal.bind(myCheckout));
}
// listening for click instead of submit to avoid default form submission issues if any,
// though submit event is better for validation. Instructions say "form should not submit unless..."
const checkoutForm = document.querySelector("#checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // check validity
    const myForm = document.forms["checkout-form"];
    const chk_status = myForm.checkValidity();
    myForm.reportValidity();
    if (chk_status) myCheckout.checkout();
  });
}

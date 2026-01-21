import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="remove-item" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  renderCartContents() {
    const cartItems = getLocalStorage(this.key);
    const element = document.querySelector(this.parentSelector);
    if (!cartItems || cartItems.length === 0) {
      element.innerHTML = "<p>Your cart is empty.</p>";
      document.querySelector(".cart-footer").classList.add("hide");
      return;
    }

    renderListWithTemplate(cartItemTemplate, element, cartItems, "afterbegin", true);
    document.querySelector(".cart-footer").classList.remove("hide");

    this.calculateTotal(cartItems);
    this.addRemoveListeners();
  }

  calculateTotal(cartItems) {
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    document.querySelector("#total-amount").innerText = `$${total.toFixed(2)}`;
  }

  addRemoveListeners() {
    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const idToRemove = e.target.dataset.id;
        this.removeItem(idToRemove);
      });
    });
  }

  removeItem(id) {
    const cartItems = getLocalStorage(this.key);
    const index = cartItems.findIndex((item) => item.Id === id);
    if (index > -1) {
      cartItems.splice(index, 1);
      setLocalStorage(this.key, cartItems);
      this.renderCartContents();
    }
  }
}

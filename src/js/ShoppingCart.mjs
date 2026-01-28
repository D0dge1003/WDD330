import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function cartItemTemplate(item) {
  const colorName = item.SelectedColor ? item.SelectedColor.ColorName : (item.Colors?.[0]?.ColorName || '');
  // Fix: Handle cases where item.Image might be missing but item.Images exists
  const imgSrc = item.Images?.PrimaryMedium || item.Images?.PrimaryLarge || item.Image || '';
  const escapedImgSrc = escapeHtml(imgSrc);
  const productUrl = `${import.meta.env.BASE_URL}product_pages/index.html?product=${encodeURIComponent(item.Id)}`;

  const newItem = `<li class="cart-card">
  <span class="remove-item" data-id="${escapeHtml(item.Id)}" data-color="${escapeHtml(colorName)}">X</span>
  <a href="${productUrl}" class="cart-card__image">
    <img
      src="${escapedImgSrc}"
      alt="${escapeHtml(item.Name)}"
      class="cart-image"
    />
  </a>
  <a href="${productUrl}">
    <h2 class="card__name">${escapeHtml(item.Name)}</h2>
  </a>
  <p class="cart-card__color">${escapeHtml(colorName)}</p>
  <div class="cart-card__quantity item-quantity">
    <button class="qty-btn minus" data-id="${escapeHtml(item.Id)}" data-color="${escapeHtml(colorName)}">-</button>
    <span>${item.Quantity}</span>
    <button class="qty-btn plus" data-id="${escapeHtml(item.Id)}" data-color="${escapeHtml(colorName)}">+</button>
  </div>
  <p class="cart-card__price">$${(item.FinalPrice * item.Quantity).toFixed(2)}</p>
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

    // Group items
    const groupedItems = [];
    cartItems.forEach(item => {
      const color = item.SelectedColor ? item.SelectedColor.ColorName : (item.Colors?.[0]?.ColorName || '');
      const existing = groupedItems.find(i => i.Id === item.Id &&
        (i.SelectedColor?.ColorName || (i.Colors?.[0]?.ColorName || '')) === color);
      if (existing) {
        existing.Quantity += 1;
      } else {
        // Clone to avoid mutating original if we needed that (but we act on copy)
        const newItem = { ...item, Quantity: 1 };
        // Ensure color property consistency for template
        if (!newItem.SelectedColor && newItem.Colors?.[0]) {
          // Just relying on checking Colors[0] in template
        }
        groupedItems.push(newItem);
      }
    });

    renderListWithTemplate(cartItemTemplate, element, groupedItems, "afterbegin", true);
    document.querySelector(".cart-footer").classList.remove("hide");

    this.calculateTotal(cartItems);
    this.addEventListeners();
  }

  calculateTotal(cartItems) {
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    document.querySelector("#total-amount").innerText = `$${total.toFixed(2)}`;
  }

  addEventListeners() {
    if (this._listenersAttached) return;

    const element = document.querySelector(this.parentSelector);
    if (!element) return;

    element.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        this.removeItem(e.target.dataset.id, e.target.dataset.color);
      } else if (e.target.classList.contains('plus')) {
        this.updateQuantity(e.target.dataset.id, e.target.dataset.color, 1);
      } else if (e.target.classList.contains('minus')) {
        this.updateQuantity(e.target.dataset.id, e.target.dataset.color, -1);
      }
    });

    this._listenersAttached = true;
  }

  updateQuantity(id, color, change) {
    let cartItems = getLocalStorage(this.key);
    if (change > 0) {
      // Find one item of this type to duplicate
      const item = cartItems.find(i => i.Id === id && (i.SelectedColor?.ColorName || (i.Colors?.[0]?.ColorName || '')) === color);
      if (item) {
        // Deep clone to avoid shared-mutation bugs
        const itemClone = JSON.parse(JSON.stringify(item));
        cartItems.push(itemClone);
      }
    } else {
      // Remove one instance
      const index = cartItems.findIndex(i => i.Id === id && (i.SelectedColor?.ColorName || (i.Colors?.[0]?.ColorName || '')) === color);
      if (index >= 0) {
        cartItems.splice(index, 1);
      }
    }
    setLocalStorage(this.key, cartItems);
    this.renderCartContents();
  }

  removeItem(id, color) {
    let cartItems = getLocalStorage(this.key);
    // Remove ALL instances of this item+color
    cartItems = cartItems.filter(i => !(i.Id === id && (i.SelectedColor?.ColorName || (i.Colors?.[0]?.ColorName || '')) === color));
    setLocalStorage(this.key, cartItems);
    this.renderCartContents();
  }
}

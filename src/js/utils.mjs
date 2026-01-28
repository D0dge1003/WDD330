import Modal from './Modal.mjs';

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function renderWithTemplate(
  template,
  parentElement,
  data,
  callback
) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/WDD330/partials/header.html");
  const footerTemplate = await loadTemplate("/WDD330/partials/footer.html");
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  updateCartCount();

  // Add search functionality
  const searchForm = document.querySelector("#search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.querySelector("#search-input");
      if (!input) return;

      const query = input.value.trim();
      if (!query) return; // Don't navigate if empty

      // Normalize search term: replace spaces with hyphens, convert to lowercase
      const normalizedQuery = query.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/WDD330/product_listing/index.html?q=${encodeURIComponent(normalizedQuery)}`;
    });
  }

  // Newsletter
  const newsletterForm = document.querySelector("#newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const modal = new Modal();
      modal.render('Newsletter Subscription', 'Thank you for subscribing!');
      newsletterForm.reset();
    });
  }

  // Welcome Modal
  if (!localStorage.getItem('hasSeenWelcome')) {
    const modal = new Modal();
    modal.render('Welcome to SleepOutside!', '<p>Register now to enter our giveaway!</p>');
    localStorage.setItem('hasSeenWelcome', 'true');
  }
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart");
  if (cartItems && cartItems.length > 0) {
    const count = cartItems.length;
    const cartIcon = document.querySelector(".cart a");
    if (cartIcon) {
      // Check if badge already exists
      let badge = cartIcon.querySelector(".cart-count");
      if (!badge) {
        badge = document.createElement("span");
        badge.classList.add("cart-count");
        cartIcon.appendChild(badge);
      }
      badge.innerText = count;
    }
  }
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) parentElement.innerHTML = '';
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}


export function animateCart() {
  const cartIcon = document.querySelector(".cart");
  if (cartIcon) {
    cartIcon.classList.add("cart-animate");
    // Remove class after animation to allow re-triggering
    setTimeout(() => {
      cartIcon.classList.remove("cart-animate");
    }, 500); // 500ms matches CSS animation duration
  }
}

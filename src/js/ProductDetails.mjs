import { getLocalStorage, setLocalStorage, qs, updateCartCount, animateCart } from './utils.mjs';

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    const btn = qs('#addToCart');
    if (btn) {
      btn.addEventListener('click', this.addProductToCart.bind(this));
    }

    this.initCarousel();
    this.initColors();
    this.initWishList();
    this.initComments();
  }

  addProductToCart() {
    // Update product with selected color if any
    const productToAdd = { ...this.product };
    if (this.selectedColor) {
      productToAdd.SelectedColor = this.selectedColor;
    }

    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(productToAdd);
    setLocalStorage('so-cart', cartItems);
    updateCartCount();
    animateCart();
  }

  renderProductDetails() {
    if (!this.product) return;

    const brandEl = qs('#productBrand');
    const nameEl = qs('#productName');
    const imgEl = qs('#productImage');
    const priceEl = qs('#productPrice');
    const discountEl = qs('#productDiscount');
    const colorEl = qs('#productColor');
    const descEl = qs('#productDescription');
    const addBtn = qs('#addToCart');

    if (brandEl) brandEl.textContent = this.product.Brand?.Name || '';
    if (nameEl) nameEl.textContent = this.product.NameWithoutBrand || this.product.Name || '';
    if (imgEl) {
      // Try multiple image sources from API response
      let imgSrc = this.product.Images?.PrimaryLarge ||
        this.product.Images?.PrimaryMedium ||
        this.product.Image || '';

      // Normalize image paths if they are relative to ../images
      const baseImagePath = import.meta.env.BASE_URL + 'images/';
      imgSrc = imgSrc.replace(/\.\.\/images\//g, baseImagePath);

      imgEl.src = imgSrc;

      if (this.product.Images) {
        const srcsetArr = [];
        if (this.product.Images.PrimarySmall) srcsetArr.push(`${this.product.Images.PrimarySmall.replace(/\.\.\/images\//g, baseImagePath)} 300w`);
        if (this.product.Images.PrimaryMedium) srcsetArr.push(`${this.product.Images.PrimaryMedium.replace(/\.\.\/images\//g, baseImagePath)} 500w`);
        if (this.product.Images.PrimaryLarge) srcsetArr.push(`${this.product.Images.PrimaryLarge.replace(/\.\.\/images\//g, baseImagePath)} 1000w`);
        if (this.product.Images.PrimaryExtraLarge) srcsetArr.push(`${this.product.Images.PrimaryExtraLarge.replace(/\.\.\/images\//g, baseImagePath)} 1500w`);

        if (srcsetArr.length > 0) {
          imgEl.srcset = srcsetArr.join(', ');
          imgEl.sizes = '(max-width: 600px) 300px, (max-width: 900px) 500px, 1000px';
        }
      }
      imgEl.alt = this.product.Name || '';
    }
    if (priceEl) priceEl.textContent = `$${(this.product.FinalPrice ?? this.product.ListPrice ?? 0).toFixed(2)}`;

    const listPrice = this.product.SuggestedRetailPrice ?? this.product.ListPrice ?? 0;
    const finalPrice = this.product.FinalPrice ?? this.product.ListPrice ?? 0;

    if (discountEl && listPrice > finalPrice) {
      const discountAmount = listPrice - finalPrice;
      const discountPercent = Math.round((discountAmount / listPrice) * 100);
      discountEl.textContent = `Save ${discountPercent}% ($${discountAmount.toFixed(2)} off)`;
    } else if (discountEl) {
      discountEl.textContent = '';
    }

    if (colorEl) colorEl.textContent = this.product.Colors?.[0]?.ColorName || '';
    if (descEl) {
      const dirty = this.product.DescriptionHtmlSimple || this.product.Description || '';

      // Use DOMParser to safely sanitize/manipulate HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(dirty, 'text/html');

      // Remove glossary links but keep their text content
      const glossaryLinks = doc.querySelectorAll('a.glossaryTermLink');
      glossaryLinks.forEach(link => {
        const text = link.textContent;
        link.replaceWith(text);
      });

      // Use textContent for the description to ensure 100% safety from XSS
      descEl.textContent = doc.body.textContent;
    }
    if (addBtn) addBtn.dataset.id = this.product.Id || '';
  }

  initCarousel() {
    if (this.product.Images?.ExtraImages && this.product.Images.ExtraImages.length > 0) {
      const imgContainer = qs('.product-detail');
      const mainImg = qs('#productImage');
      if (!mainImg) return;

      const carouselContainer = document.createElement('div');
      carouselContainer.classList.add('carousel-thumbnails');

      this.product.Images.ExtraImages.forEach(imgData => {
        // Normalize thumbnail sources
        const baseImagePath = import.meta.env.BASE_URL + 'images/';
        const normalizedSrc = imgData.Src.replace(/\.\.\/images\//g, baseImagePath);

        const thumb = document.createElement('img');
        thumb.src = normalizedSrc;
        thumb.alt = imgData.Title || 'Extra Image';
        thumb.classList.add('carousel-thumb');
        thumb.addEventListener('click', () => {
          mainImg.src = normalizedSrc;
          mainImg.srcset = ''; // Clear srcset when manually swapping images
        });
        carouselContainer.appendChild(thumb);
      });
      mainImg.parentNode.insertBefore(carouselContainer, mainImg.nextSibling);
    }
  }

  initColors() {
    if (this.product.Colors && this.product.Colors.length > 1) {
      const colorContainer = qs('#productColor');
      if (!colorContainer) return;

      colorContainer.innerHTML = '';
      const label = document.createElement('p');
      label.textContent = "Select Color:";
      colorContainer.appendChild(label);

      const swatchesDiv = document.createElement('div');
      swatchesDiv.classList.add('color-swatches');

      this.product.Colors.forEach(color => {
        const swatch = document.createElement('button');
        swatch.textContent = color.ColorName;
        swatch.classList.add('color-swatch');
        swatch.addEventListener('click', () => {
          this.selectedColor = color;
          const selected = colorContainer.querySelector('.color-swatch.selected');
          if (selected) selected.classList.remove('selected');
          swatch.classList.add('selected');
        });
        swatchesDiv.appendChild(swatch);
      });
      colorContainer.appendChild(swatchesDiv);
    }
  }

  initWishList() {
    const addBtn = qs('.product-detail__add');
    if (!addBtn) return;

    let wishBtn = qs('#addToWishList');
    if (!wishBtn) {
      wishBtn = document.createElement('button');
      wishBtn.id = 'addToWishList';
      wishBtn.textContent = '❤ Add to Wish List';
      wishBtn.classList.add('wishlist-btn');
      addBtn.appendChild(wishBtn);
    }

    const wishlist = getLocalStorage('so-wishlist') || [];
    const exists = wishlist.find(p => p.Id === this.product.Id);
    if (exists) {
      wishBtn.textContent = '❤ In Wish List';
      wishBtn.classList.add('active');
    }

    wishBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent adding to cart if nested? No, button is separate.
      let currentList = getLocalStorage('so-wishlist') || [];
      const idx = currentList.findIndex(p => p.Id === this.product.Id);

      if (idx >= 0) {
        currentList.splice(idx, 1);
        wishBtn.textContent = '❤ Add to Wish List';
        wishBtn.classList.remove('active');
      } else {
        currentList.push(this.product);
        wishBtn.textContent = '❤ In Wish List';
        wishBtn.classList.add('active');
      }
      setLocalStorage('so-wishlist', currentList);
    });
  }

  initComments() {
    const section = qs('.product-detail');
    if (!section) return;

    // Check if already exists to avoid duplication on re-renders
    if (qs('.product-comments')) return;

    const commentsDiv = document.createElement('div');
    commentsDiv.classList.add('product-comments');
    commentsDiv.innerHTML = `
      <h3>Customer Comments</h3>
      <ul id="commentsList"></ul>
      <form id="commentForm">
        <textarea id="commentText" placeholder="Write a comment..." required></textarea>
        <button type="submit">Submit Comment</button>
      </form>
    `;
    section.appendChild(commentsDiv);

    this.renderComments();

    qs('#commentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = qs('#commentText').value;
      const comments = getLocalStorage(`so-comments-${this.product.Id}`) || [];
      comments.push({ text, date: new Date().toLocaleDateString() });
      setLocalStorage(`so-comments-${this.product.Id}`, comments);
      qs('#commentText').value = '';
      this.renderComments();
    });
  }

  renderComments() {
    const list = qs('#commentsList');
    if (!list) return;
    const comments = getLocalStorage(`so-comments-${this.product.Id}`) || [];

    // Clear list safely
    list.innerHTML = '';

    comments.forEach(c => {
      const li = document.createElement('li');
      const p = document.createElement('p');
      p.textContent = c.text;
      const small = document.createElement('small');
      small.textContent = c.date;

      li.appendChild(p);
      li.appendChild(small);
      list.appendChild(li);
    });
  }
}
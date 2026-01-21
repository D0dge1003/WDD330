import { getLocalStorage, setLocalStorage, qs } from './utils.mjs';

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
  }

  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);
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
      const imgSrc = (this.product.Image || '').replace(/^\.\.\/images/, `${import.meta.env.BASE_URL}images`);
      imgEl.src = imgSrc;
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
    if (descEl) descEl.innerHTML = this.product.DescriptionHtmlSimple || this.product.Description || '';
    if (addBtn) addBtn.dataset.id = this.product.Id || '';
  }
}
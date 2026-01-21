import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const imgSrc = product.Images?.PrimaryMedium || product.Image || ''; // Fallback for local testing if needed
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountAmount = product.SuggestedRetailPrice - product.FinalPrice;
  const discountHTML = isDiscounted ? `<p class="product__discount">-${Math.round((discountAmount / product.SuggestedRetailPrice) * 100)}% Off</p>` : '';

  return `
    <li class="product-card">
      <a href="${import.meta.env.BASE_URL}product_pages/index.html?product=${product.Id}">
        <img src="${imgSrc}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand?.Name || ''}</h3>
        <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
        <p class="product-card__price">$${product.ListPrice}</p>
        ${discountHTML}
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    try {
      this.products = await this.dataSource.getData(this.category);
      console.log(`Loaded ${this.products?.length || 0} products for category: ${this.category}`);
      if (!this.products || this.products.length === 0) {
        console.warn(`No products found for category: ${this.category}`);
        this.listElement.innerHTML = '<p>No products found.</p>';
        return;
      }
      this.renderList(this.products);
    } catch (error) {
      console.error('Error loading products:', error);
      this.listElement.innerHTML = '<p>Error loading products. Please try again.</p>';
    }
  }

  renderList(list, position = 'afterbegin', clear = true) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, position, clear);
  }
}
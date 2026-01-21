import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const imgSrc = (product.Image || '').replace(/^\.\.\/images/, `${import.meta.env.BASE_URL}images`);
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountAmount = product.SuggestedRetailPrice - product.FinalPrice;
  const discountHTML = isDiscounted ? `<p class="product__discount">-${Math.round((discountAmount / product.SuggestedRetailPrice) * 100)}% Off</p>` : '';

  return `
    <li class="product-card">
      <a href="${import.meta.env.BASE_URL}product_pages/index.html?product=${product.Id}">
        <img src="${imgSrc}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand?.Name || ''}</h3>
        <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
        <p class="product-card__price">$${(product.FinalPrice ?? product.ListPrice ?? 0).toFixed(2)}</p>
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
    this.products = await this.dataSource.getData();
    this.renderList(this.products);
  }

  renderList(list, position = 'afterbegin', clear = true) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, position, clear);
  }
}
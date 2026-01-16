import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const imgSrc = (product.Image || '').replace(/^\.\.\/images/, '/images');
  return `
    <li class="product-card">
      <a href="./product_pages/?product=${product.Id}">
        <img src="${imgSrc}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand?.Name || ''}</h3>
        <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
        <p class="product-card__price">$${(product.FinalPrice ?? product.ListPrice ?? 0).toFixed(2)}</p>
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
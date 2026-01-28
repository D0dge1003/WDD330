import { renderListWithTemplate } from './utils.mjs';
import Modal from './Modal.mjs';

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function productCardTemplate(product) {
  const imgSrc = escapeHtml(product.Images?.PrimaryMedium || product.Image || '');
  const isDiscounted = (typeof product.SuggestedRetailPrice === 'number' && product.SuggestedRetailPrice > 0) && product.FinalPrice < product.SuggestedRetailPrice;
  const discountAmount = isDiscounted ? product.SuggestedRetailPrice - product.FinalPrice : 0;
  const discountHTML = isDiscounted ? `<p class="product__discount">-${Math.round((discountAmount / product.SuggestedRetailPrice) * 100)}% Off</p>` : '';

  let srcset = '';
  if (product.Images) {
    const srcsetArr = [];
    if (product.Images.PrimarySmall) srcsetArr.push(`${escapeHtml(product.Images.PrimarySmall)} 300w`);
    if (product.Images.PrimaryMedium) srcsetArr.push(`${escapeHtml(product.Images.PrimaryMedium)} 500w`);
    if (product.Images.PrimaryLarge) srcsetArr.push(`${escapeHtml(product.Images.PrimaryLarge)} 1000w`);
    if (product.Images.PrimaryExtraLarge) srcsetArr.push(`${escapeHtml(product.Images.PrimaryExtraLarge)} 1500w`);
    srcset = srcsetArr.join(', ');
  }

  return `
    <li class="product-card">
      <a href="${import.meta.env.BASE_URL}product_pages/index.html?product=${escapeHtml(product.Id)}">
        <img src="${imgSrc}" srcset="${srcset}" sizes="(max-width: 600px) 300px, 500px" alt="${escapeHtml(product.Name)}" />
        <h3 class="card__brand">${escapeHtml(product.Brand?.Name || '')}</h3>
        <h2 class="card__name">${escapeHtml(product.NameWithoutBrand || product.Name)}</h2>
        <p class="product-card__price">$${escapeHtml(product.ListPrice)}</p>
        ${discountHTML}
      </a>
      <button class="quick-view" data-id="${escapeHtml(product.Id)}">Quick View</button>
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
      console.log(`Loaded ${this.products?.length || 0} products for category: ${this.category} `);
      if (!this.products || this.products.length === 0) {
        console.warn(`No products found for category: ${this.category} `);
        this.listElement.innerHTML = '<p>No products found.</p>';
        return;
      }
      this.renderList(this.products);

      // Add event listener for Quick View (only once)
      if (!this._initialized) {
        this.listElement.addEventListener('click', (e) => {
          if (e.target.classList.contains('quick-view')) {
            e.preventDefault();
            const id = e.target.dataset.id;
            this.quickView(id);
          }
        });
        this._initialized = true;
      }
    } catch (error) {
      console.error('Error loading products:', error);
      this.listElement.innerHTML = '<p>Error loading products. Please try again.</p>';
    }
  }

  async quickView(productId) {
    try {
      const product = this.products.find(p => p.Id === productId) || await this.dataSource.findProductById(productId);
      if (!product) {
        alert("Product not found.");
        return;
      }

      const modal = new Modal();

      // Sanitize description
      const dirty = product.DescriptionHtmlSimple || '';
      const parser = new DOMParser();
      const doc = parser.parseFromString(dirty, 'text/html');
      doc.querySelectorAll('a.glossaryTermLink').forEach(el => el.replaceWith(el.textContent));

      const html = `
        <div class="product-detail quick-view-detail">
          <h3>${escapeHtml(product.Brand?.Name || '')}</h3>
          <h2>${escapeHtml(product.NameWithoutBrand || product.Name)}</h2>
          <img src="${escapeHtml(product.Images?.PrimaryLarge || product.Image || '')}" alt="${escapeHtml(product.Name)}" />
          <p class="product-card__price">$${escapeHtml(product.FinalPrice)}</p>
          <p>${escapeHtml(doc.body.textContent)}</p>
          <div class="product-detail__add">
             <a href="${import.meta.env.BASE_URL}product_pages/index.html?product=${escapeHtml(product.Id)}" class="btn add-to-cart-btn">View Full Details</a>
          </div>
        </div>
      `;
      modal.render('Quick View', html);
    } catch (err) {
      console.error('Quick view error:', err);
      alert('Sorry, we could not load the product details right now.');
    }
  }

  renderList(list, position = 'afterbegin', clear = true) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, position, clear);
  }

  sortBy(criteria) {
    if (criteria === 'name') {
      this.products.sort((a, b) => {
        const nameA = a.NameWithoutBrand || a.Name;
        const nameB = b.NameWithoutBrand || b.Name;
        return nameA.localeCompare(nameB);
      });
    } else if (criteria === 'price') {
      this.products.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }
    this.renderList(this.products);
  }
}
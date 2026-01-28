import { qs } from './utils.mjs';

export function renderBreadcrumbs(category, count = null) {
    // Move breadcrumbs to bottom of product list
    const productsSection = qs('.products');
    if (!productsSection) return;

    // Remove existing breadcrumb if any
    const existingBreadcrumb = qs('.breadcrumbs-bottom');
    if (existingBreadcrumb) {
        existingBreadcrumb.remove();
    }

    // Validate category
    if (typeof category !== 'string' || !category) {
        category = 'Unknown';
    }

    // Capitalize category
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    const breadcrumbDiv = document.createElement('div');
    breadcrumbDiv.classList.add('breadcrumbs-bottom');

    const p = document.createElement('p');
    if (count !== null) {
        p.textContent = `Showing ${count} ${categoryName}`;
    } else {
        p.textContent = `Category: ${categoryName}`;
    }
    breadcrumbDiv.appendChild(p);

    productsSection.appendChild(breadcrumbDiv);
}

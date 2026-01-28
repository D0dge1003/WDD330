import { loadHeaderFooter, getLocalStorage, setLocalStorage, qs } from "./utils.mjs";

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = String(str);
    // Explicitly escape quotes for attribute contexts
    return div.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function wishlistItemTemplate(item) {
    let imgSrc = item.Images?.PrimaryMedium || item.Images?.PrimaryLarge || item.Image || '';

    // Sanitize image source URLs (basic scheme validation)
    if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('data:') && !imgSrc.startsWith('/') && !imgSrc.startsWith('.')) {
        imgSrc = ''; // Block potentially malformed/risky paths
    }
    const escapedImgSrc = escapeHtml(imgSrc);

    return `<li class="product-card">
    <span class="remove-wishlist" data-id="${escapeHtml(item.Id)}">✕</span>
    <a href="${import.meta.env.BASE_URL}product_pages/index.html?product=${escapeHtml(item.Id)}">
      <img src="${escapedImgSrc}" alt="${escapeHtml(item.Name)}" />
      <h3 class="card__brand">${escapeHtml(item.Brand?.Name || '')}</h3>
      <h2 class="card__name">${escapeHtml(item.NameWithoutBrand || item.Name)}</h2>
      <p class="product-card__price">$${escapeHtml(item.FinalPrice)}</p>
    </a>
    <button class="add-to-cart-btn" data-id="${escapeHtml(item.Id)}">Add to Cart</button>
  </li>`;
}

function renderWishlist() {
    const wishlist = getLocalStorage('so-wishlist') || [];
    const container = qs('#wishlist-items');
    const emptyMsg = qs('.empty-wishlist');

    if (!container || !emptyMsg) return;

    if (wishlist.length === 0) {
        container.innerHTML = '';
        emptyMsg.classList.remove('hide');
    } else {
        emptyMsg.classList.add('hide');
        container.innerHTML = wishlist.map(item => wishlistItemTemplate(item)).join('');

        // Add remove functionality
        container.querySelectorAll('.remove-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                let currentList = getLocalStorage('so-wishlist') || [];
                currentList = currentList.filter(p => p.Id !== id);
                setLocalStorage('so-wishlist', currentList);
                renderWishlist();
            });
        });

        // Add to cart functionality
        container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                const wishlist = getLocalStorage('so-wishlist') || [];
                const item = wishlist.find(p => p.Id === id);
                if (item) {
                    let cart = getLocalStorage('so-cart') || [];
                    const existing = cart.find(p => p.Id === id);
                    if (existing) {
                        existing.Quantity = (existing.Quantity || 1) + 1;
                    } else {
                        // Create a shallow clone to avoid mutating the original wishlist item
                        const itemCopy = { ...item, Quantity: 1 };
                        cart.push(itemCopy);
                    }
                    setLocalStorage('so-cart', cart);
                    alert('Added to cart!');
                }
            });
        });
    }
}

loadHeaderFooter()
    .catch(err => {
        console.error("Failed to load header/footer:", err);
    })
    .finally(() => {
        renderWishlist();
    });

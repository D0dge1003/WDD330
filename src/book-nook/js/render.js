const PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3e%3crect width="200" height="280" fill="%23eae6d8"/%3e%3ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="24" fill="%236d5e55"%3eNo Cover%3c/text%3e%3c/svg%3e';

/**
 * Renders a list of books to the DOM.
 * @param {Array} books - Array of book objects.
 * @param {HTMLElement} parentElement - The DOM element to render into.
 * @param {Object} actions - Callbacks for actions: { onAdd: fn, onRemove: fn, onMove: fn, isWishlist: bool, isHistory: bool }
 */
export function renderList(books, parentElement, actions = {}) {
    parentElement.innerHTML = '';

    if (!books || books.length === 0) {
        const emptyMsg = actions.emptyMessage || "No books found.";
        parentElement.innerHTML = `<div class="empty-state"><p>${emptyMsg}</p></div>`;
        return;
    }

    books.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        // Staggered animation delay
        card.style.animationDelay = `${index * 50}ms`;

        // Prepare data
        const title = book.title || 'Unknown Title';
        const authors = book.author_name ? book.author_name.slice(0, 2).join(', ') : 'Unknown Author';
        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : PLACEHOLDER_IMG;
        const year = book.publish_year ? book.publish_year[0] : 'N/A';
        const pages = book.number_of_pages_median ? `${book.number_of_pages_median} pp` : '';

        // Review Data
        let reviewHtml = '';
        if (actions.view === 'history' && book.review) {
            const starStr = '★'.repeat(book.review.rating || 0) + '☆'.repeat(5 - (book.review.rating || 0));
            reviewHtml = `
                <div class="book-review">
                    <span class="stars">${starStr}</span>
                    <span class="review-text">"${book.review.text || ''}"</span>
                </div>
            `;
        }

        // Action Buttons Logic
        let actionButtons = '';
        if (actions.view === 'search') {
            actionButtons = `<button class="action-btn add-btn" data-key="${book.key}" aria-label="Add ${title} to Wishlist">✨ Wishlist</button>`;
        } else if (actions.view === 'wishlist') {
            actionButtons = `
                <button class="action-btn move-btn" data-key="${book.key}" aria-label="Mark ${title} as read">✅ Read</button>
                <button class="action-btn delete delete-btn" data-key="${book.key}" aria-label="Remove ${title} from list">🗑 Remove</button>
             `;
        } else if (actions.view === 'history') {
            actionButtons = `
                <button class="action-btn review-btn" data-key="${book.key}" aria-label="Review ${title}">⭐ Review</button>
                <button class="action-btn delete delete-btn" data-key="${book.key}" aria-label="Remove ${title} from history">🗑 Remove</button>
             `;
        }

        const html = `
            <img src="${coverUrl}" alt="Cover of ${title}" class="book-cover" loading="lazy" style="cursor: pointer;">
            <h2 class="book-title">${title}</h2>
            <p class="author">${authors}</p>
            <div class="meta">
                <span>${year}</span>
                <span>${pages}</span>
            </div>
            ${reviewHtml}
            <div class="card-actions">
                ${actionButtons}
            </div>
        `;

        card.innerHTML = html;

        // Attach event listeners to buttons
        const addBtn = card.querySelector('.add-btn');
        if (addBtn) addBtn.addEventListener('click', () => actions.onAdd(book));

        const moveBtn = card.querySelector('.move-btn');
        if (moveBtn) moveBtn.addEventListener('click', () => actions.onMove(book));

        const reviewBtn = card.querySelector('.review-btn');
        if (reviewBtn) reviewBtn.addEventListener('click', () => actions.onReview(book));

        const deleteBtn = card.querySelector('.delete-btn');
        if (deleteBtn) deleteBtn.addEventListener('click', () => actions.onRemove(book.key));

        // Details Click
        const cover = card.querySelector('.book-cover');
        if (cover) cover.addEventListener('click', () => {
            if (actions.onDetails) actions.onDetails(book);
        });

        parentElement.appendChild(card);
    });
}

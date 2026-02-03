const PLACEHOLDER_IMG = 'https://via.placeholder.com/200x280?text=No+Cover';

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

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';

        // Prepare data
        const title = book.title || 'Unknown Title';
        const authors = book.author_name ? book.author_name.slice(0, 2).join(', ') : 'Unknown Author';
        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : PLACEHOLDER_IMG;
        const year = book.publish_year ? book.publish_year[0] : 'N/A';
        const pages = book.number_of_pages_median ? `${book.number_of_pages_median} pp` : '';

        // Action Buttons Logic
        let actionButtons = '';
        if (actions.view === 'search') {
            // Check if already in wishlist to change button state? 
            // For now, simpler implementation:
            actionButtons = `<button class="action-btn add-btn" data-key="${book.key}">✨ Add to Wishlist</button>`;
        } else if (actions.view === 'wishlist') {
            actionButtons = `
                <button class="action-btn move-btn" data-key="${book.key}">✅ Mark Read</button>
                <button class="action-btn delete delete-btn" data-key="${book.key}">🗑 Remove</button>
             `;
        } else if (actions.view === 'history') {
            actionButtons = `<button class="action-btn delete delete-btn" data-key="${book.key}">🗑 Remove</button>`;
        }

        const html = `
            <img src="${coverUrl}" alt="Cover of ${title}" class="book-cover" loading="lazy">
            <h4>${title}</h4>
            <p class="author">${authors}</p>
            <div class="meta">
                <span>${year}</span>
                <span>${pages}</span>
            </div>
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

        const deleteBtn = card.querySelector('.delete-btn');
        if (deleteBtn) deleteBtn.addEventListener('click', () => actions.onRemove(book.key));

        parentElement.appendChild(card);
    });
}

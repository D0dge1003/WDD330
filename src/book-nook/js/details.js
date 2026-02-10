import { getBookDetails } from './api.js';

export default class BookDetailsModal {
    constructor() {
        this.modal = null;
    }

    async open(book, userReview) {
        this.createModal(book, userReview);
        document.body.appendChild(this.modal);
        // Animate in
        requestAnimationFrame(() => this.modal.classList.add('show'));

        // Fetch full details (synopsis)
        this.loadDetails(book.key);
    }

    createModal(book, review) {
        this.modal = document.createElement('div');
        this.modal.className = 'details-overlay';

        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3e%3crect width="200" height="280" fill="%23eae6d8"/%3e%3ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="24" fill="%236d5e55"%3eNo Cover%3c/text%3e%3c/svg%3e';

        const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';

        let reviewSection = '';
        if (review) {
            const starStr = '★'.repeat(review.rating || 0) + '☆'.repeat(5 - (review.rating || 0));
            reviewSection = `
                <div class="user-review-section">
                    <h3>Your Review</h3>
                    <div class="stars">${starStr}</div>
                    <p class="review-comment">"${review.text || ''}"</p>
                </div>
            `;
        }

        this.modal.innerHTML = `
            <div class="details-card">
                <button class="close-details-btn" aria-label="Close">×</button>
                <div class="details-content">
                    <div class="details-image">
                        <img src="${coverUrl}" alt="${book.title}">
                    </div>
                    <div class="details-info">
                        <h2>${book.title}</h2>
                        <p class="details-author">by ${authors}</p>
                        <div class="details-meta">
                            <span>Originally Published: ${book.publish_year ? book.publish_year[0] : 'N/A'}</span>
                        </div>
                        
                        <div class="synopsis-section">
                            <h3>Synopsis</h3>
                            <p id="synopsisText" class="loading-text">Fetching synopsis...</p>
                        </div>

                        ${reviewSection}
                    </div>
                </div>
            </div>
        `;

        this.modal.querySelector('.close-details-btn').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    async loadDetails(key) {
        const data = await getBookDetails(key);
        const synopsisEl = this.modal.querySelector('#synopsisText');

        if (data && data.description) {
            // Description can be specific string or object
            let text = typeof data.description === 'string' ? data.description : data.description.value;
            synopsisEl.textContent = text;
            synopsisEl.classList.remove('loading-text');
        } else {
            synopsisEl.textContent = "No synopsis available for this edition.";
            synopsisEl.classList.remove('loading-text');
        }
    }

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.remove();
            this.modal = null;
        }, 300);
    }
}

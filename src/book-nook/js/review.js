export default class ReviewModal {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.modal = null;
    }

    open(book, existingReview = {}) {
        this.createModal(book, existingReview);
        document.body.appendChild(this.modal);
        // Animate in
        requestAnimationFrame(() => this.modal.classList.add('show'));
    }

    createModal(book, review) {
        this.modal = document.createElement('div');
        this.modal.className = 'review-overlay';

        const rating = review.rating || 0;
        const text = review.text || '';

        this.modal.innerHTML = `
            <div class="review-card">
                <button class="close-btn" aria-label="Close">×</button>
                <h2>Review "${book.title}"</h2>
                <div class="star-rating">
                    ${[1, 2, 3, 4, 5].map(i => `
                        <span class="star ${i <= rating ? 'filled' : ''}" data-value="${i}">★</span>
                    `).join('')}
                </div>
                <textarea placeholder="Write your thoughts here..." rows="4">${text}</textarea>
                <button class="save-review-btn">Save Review</button>
            </div>
        `;

        // Event Listeners
        this.modal.querySelector('.close-btn').addEventListener('click', () => this.close());

        // Star Logic
        const stars = this.modal.querySelectorAll('.star');
        let currentRating = rating;

        stars.forEach(star => {
            star.addEventListener('click', () => {
                currentRating = parseInt(star.dataset.value);
                this.updateStars(stars, currentRating);
            });
        });

        // Save Logic
        this.modal.querySelector('.save-review-btn').addEventListener('click', () => {
            const note = this.modal.querySelector('textarea').value;
            this.onSubmit(book.key, { rating: currentRating, text: note });
            this.close();
        });

        // Close on clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    updateStars(stars, rating) {
        stars.forEach(star => {
            const val = parseInt(star.dataset.value);
            if (val <= rating) star.classList.add('filled');
            else star.classList.remove('filled');
        });
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

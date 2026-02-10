export default class WelcomeCard {
    constructor() {
        this.storageKey = 'book-nook-welcome-seen';
    }

    show() {
        // Check if already seen
        if (localStorage.getItem(this.storageKey)) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'welcome-overlay';

        const card = document.createElement('div');
        card.className = 'welcome-card';

        card.innerHTML = `
            <div class="welcome-icon">📖</div>
            <h2>Welcome to Book Nook</h2>
            <p>Your personal distraction-free library.</p>
            <ul>
                <li>🔍 <strong>Search</strong> for your favorite books</li>
                <li>✨ <strong>Add</strong> them to your Wishlist</li>
                <li>✅ <strong>Track</strong> what you've read</li>
            </ul>
            <button id="startBtn" class="welcome-btn">Start Exploring</button>
        `;

        overlay.appendChild(card);
        document.body.appendChild(overlay);

        // Animate in
        requestAnimationFrame(() => {
            overlay.classList.add('show');
            card.classList.add('show');
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            this.close(overlay);
        });
    }

    close(element) {
        element.classList.remove('show');
        setTimeout(() => {
            element.remove();
            localStorage.setItem(this.storageKey, 'true');
        }, 500);
    }
}

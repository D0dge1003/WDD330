import { searchBooks } from './api.js';
import LocalStorageHelper from './storage.js';
import { renderList } from './render.js';
import { toast } from './toast.js';
import WelcomeCard from './welcome.js';
import ReviewModal from './review.js';
import BookDetailsModal from './details.js';

// State
let currentBooks = [];
let currentView = 'search'; // 'search', 'wishlist', 'history'

// Storage Instances
const wishlistStorage = new LocalStorageHelper('book-nook-wishlist');
const historyStorage = new LocalStorageHelper('book-nook-history');

// Modals
const reviewModal = new ReviewModal(saveReview);
const detailsModal = new BookDetailsModal();

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const bookGrid = document.getElementById('bookGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const testApiBtn = document.getElementById('testApiBtn');
const sortSelect = document.getElementById('sortSelect');
const navBtns = document.querySelectorAll('.nav-btn');
const themeToggle = document.getElementById('themeToggle');

// --- Initialization ---
function init() {
    switchView('search');

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }

    // Show Welcome Card
    const welcome = new WelcomeCard();
    welcome.show();
}

// --- Event Listeners ---

themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    }
});

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        if (currentView !== 'search') switchView('search');
        performSearch(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

testApiBtn.addEventListener('click', async () => {
    const query = "Harry Potter";
    toast.show("Testing API connection...", "info");
    try {
        const results = await searchBooks(query);
        console.log("API Results:", results);
        toast.show(`API Success! Found ${results.length} books.`, "success");
    } catch (e) {
        console.error("API Test Failed", e);
        toast.show("API Connection Failed!", "error");
    }
});

navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Handle child elements click
        const target = e.target.closest('.nav-btn');
        const view = target.dataset.view;
        switchView(view);
    });
});

sortSelect.addEventListener('change', () => {
    sortBooks();
    refreshRender();
});

// --- Core Logic ---

async function performSearch(query) {
    showLoading(true);
    try {
        currentBooks = await searchBooks(query);
        sortBooks();
        refreshRender();
        if (currentBooks.length > 0) {
            toast.show(`Found ${currentBooks.length} books for "${query}"`, 'success');
        } else {
            toast.show(`No books found for "${query}"`, 'warning');
        }
    } catch (error) {
        bookGrid.innerHTML = '<div class="empty-state"><p>Something went wrong. Please try again.</p></div>';
        toast.show("Error fetching books", "error");
    } finally {
        showLoading(false);
    }
}

function switchView(view) {
    currentView = view;
    // Update active nav state
    navBtns.forEach(btn => {
        if (btn.dataset.view === view) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    // Load data specific to view
    if (view === 'wishlist') {
        currentBooks = wishlistStorage.get();
        document.querySelector('.search-bar').style.visibility = 'hidden';
    } else if (view === 'history') {
        currentBooks = historyStorage.get();
        document.querySelector('.search-bar').style.visibility = 'hidden';
    } else {
        document.querySelector('.search-bar').style.visibility = 'visible';
    }

    // Sort and Render
    sortBooks();
    refreshRender();
}

function refreshRender() {
    const config = {
        view: currentView,
        onAdd: addToWishlist,
        onRemove: removeFromList,
        onMove: markAsRead,
        onReview: openReviewModal,
        onDetails: openDetails
    };

    if (currentView === 'wishlist') config.emptyMessage = "Your wishlist is empty. Go search for books!";
    if (currentView === 'history') config.emptyMessage = "You haven't finished any books yet.";

    renderList(currentBooks, bookGrid, config);
}

function openReviewModal(book) {
    reviewModal.open(book, book.review);
}

function openDetails(book) {
    // Check if we have a review for this book (in history or just in current state)
    // If it's in history, grab that review
    let review = book.review;
    if (!review && historyStorage.has(book.key)) {
        const historyItem = historyStorage.get().find(b => b.key === book.key);
        if (historyItem) review = historyItem.review;
    }

    detailsModal.open(book, review);
}

function saveReview(key, reviewData) {
    const list = historyStorage.get();
    const index = list.findIndex(b => b.key === key);
    if (index !== -1) {
        list[index].review = reviewData;
        historyStorage.set(list);

        // Refresh
        currentBooks = list;
        refreshRender();
        toast.show("Review Saved!", "success");
    }
}

function sortBooks() {
    const sortBy = sortSelect.value;
    currentBooks.sort((a, b) => {
        if (sortBy === 'title') {
            return (a.title || '').localeCompare(b.title || '');
        } else if (sortBy === 'newest') {
            const yearA = a.publish_year ? a.publish_year[0] : 0;
            const yearB = b.publish_year ? b.publish_year[0] : 0;
            return yearB - yearA;
        } else if (sortBy === 'oldest') {
            const yearA = a.publish_year ? a.publish_year[0] : 0;
            const yearB = b.publish_year ? b.publish_year[0] : 0;
            return yearA - yearB;
        }
        return 0;
    });
}

function showLoading(show) {
    if (show) {
        loadingIndicator.classList.remove('hidden');
        bookGrid.classList.add('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
        bookGrid.classList.remove('hidden');
    }
}

// --- Actions ---

function addToWishlist(book) {
    const added = wishlistStorage.add(book);
    if (added) {
        toast.show(`Added "${book.title}" to Wishlist!`, 'success');
    } else {
        toast.show(`"${book.title}" is already in your Wishlist.`, 'warning');
    }
}

function removeFromList(key) {
    if (currentView === 'wishlist') {
        wishlistStorage.remove(key);
        currentBooks = wishlistStorage.get();
        toast.show("Removed from Wishlist", "info");
    } else if (currentView === 'history') {
        historyStorage.remove(key);
        currentBooks = historyStorage.get();
        toast.show("Removed from History", "info");
    }
    refreshRender();
}

function markAsRead(book) {
    historyStorage.add(book);
    wishlistStorage.remove(book.key);
    currentBooks = wishlistStorage.get();
    refreshRender();
    toast.show(`Marked "${book.title}" as Read!`, 'success');
}

// Start
init();

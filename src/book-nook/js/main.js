import { searchBooks } from './api.js';
import LocalStorageHelper from './storage.js';
import { renderList } from './render.js';

// State
let currentBooks = [];
let currentView = 'search'; // 'search', 'wishlist', 'history'

// Storage Instances
const wishlistStorage = new LocalStorageHelper('book-nook-wishlist');
const historyStorage = new LocalStorageHelper('book-nook-history');

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const bookGrid = document.getElementById('bookGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const testApiBtn = document.getElementById('testApiBtn');
const sortSelect = document.getElementById('sortSelect');
const navBtns = document.querySelectorAll('.nav-btn');

// --- Initialization ---
function init() {
    // Determine initial view or load search
    // For now, start empty or defined view
    switchView('search');
}

// --- Event Listeners ---

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        // Switch to search view if not already
        if (currentView !== 'search') switchView('search');
        performSearch(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

testApiBtn.addEventListener('click', async () => {
    console.log("Test API Clicked");
    const query = "Harry Potter";
    try {
        const results = await searchBooks(query);
        console.log("API Results:", results);
        alert(`API Test Successful! Found ${results.length} books. Check console details.`);
    } catch (e) {
        console.error("API Test Failed", e);
        alert("API Test Failed. Check console.");
    }
});

navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
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
        sortBooks(); // Apply current sort
        refreshRender();
    } catch (error) {
        bookGrid.innerHTML = '<div class="empty-state"><p>Something went wrong. Please try again.</p></div>';
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
        // Search view - keep existing results or clear?
        // Let's keep existing if any, else empty
        // And show search bar
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
        onMove: markAsRead
    };

    if (currentView === 'wishlist') config.emptyMessage = "Your wishlist is empty. Go search for books!";
    if (currentView === 'history') config.emptyMessage = "You haven't finished any books yet.";

    renderList(currentBooks, bookGrid, config);
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
        alert(`Added "${book.title}" to Wishlist!`);
    } else {
        alert(`"${book.title}" is already in your Wishlist.`);
    }
}

function removeFromList(key) {
    if (currentView === 'wishlist') {
        wishlistStorage.remove(key);
        currentBooks = wishlistStorage.get(); // Refresh local list
    } else if (currentView === 'history') {
        historyStorage.remove(key);
        currentBooks = historyStorage.get();
    }
    refreshRender();
}

function markAsRead(book) {
    // Add to history
    historyStorage.add(book);
    // Remove from wishlist
    wishlistStorage.remove(book.key);
    // Refresh current view (which is wishlist)
    currentBooks = wishlistStorage.get();
    refreshRender();
    alert(`Marked "${book.title}" as Read!`);
}

// Start
init();

const BASE_URL = 'https://openlibrary.org/search.json';

export async function searchBooks(query) {
    if (!query) return [];

    // Replace spaces with + for the query
    const q = encodeURIComponent(query);
    const url = `${BASE_URL}?q=${q}&fields=key,title,author_name,cover_i,publish_year,publisher,language,number_of_pages_median&limit=24`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.docs;
    } catch (error) {
        console.error("Failed to fetch books:", error);
        throw error;
    }
}

export async function getBookDetails(key) {
    const url = `https://openlibrary.org${key}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch details');
        return await response.json();
    } catch (error) {
        console.error("Error fetching details:", error);
        return null;
    }
}

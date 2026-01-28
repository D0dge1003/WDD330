import "../css/style.css";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { renderBreadcrumbs } from "./breadcrumbs.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
const query = getParam("q");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

// Use query as key if present, otherwise category
const searchKey = query || category;

// If no search key, show error
if (!searchKey) {
  const titleElement = document.querySelector(".title");
  if (titleElement) {
    titleElement.textContent = "No category or search term provided";
  }
  if (listElement) {
    listElement.textContent = "Please select a category or use the search bar.";
  }
} else {
  const myList = new ProductList(searchKey, dataSource, listElement);

  // Set the title to show the category name
  const titleElement = document.querySelector(".title");
  if (titleElement) {
    if (query) {
      titleElement.textContent = `Search Results: ${query}`;
    } else if (category) {
      titleElement.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
  }

  (async () => {
    try {
      await myList.init();

      // Breadcrumb rendering: prefer query (search) over category
      if (query) {
        renderBreadcrumbs("Search", myList.products.length);
      } else if (category) {
        renderBreadcrumbs(category, myList.products.length);
      }

      // Move sort listener here to ensure myList is initialized
      const sortSelect = document.getElementById("sort-select");
      if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
          myList.sortBy(e.target.value);
        });
      }
    } catch (err) {
      console.error('Initialization error:', err);
      if (listElement) {
        listElement.textContent = "Error loading products. Please try again later.";
      }
    }
  })();
}

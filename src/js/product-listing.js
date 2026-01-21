import "../css/style.css";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
const query = getParam("q");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

// Use query as key if present, otherwise category
const searchKey = query || category;
const myList = new ProductList(searchKey, dataSource, listElement);

// Set the title
const titleElement = document.querySelector(".title");
if (titleElement) {
    if (query) {
        titleElement.innerHTML = `Search Results: ${query}`;
    } else if (category) {
        titleElement.innerHTML = category.charAt(0).toUpperCase() + category.slice(1);
    }
}

myList.init();

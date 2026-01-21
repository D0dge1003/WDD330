import "../css/style.css";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);

// Set the title to show the category name
const titleElement = document.querySelector(".title");
if (titleElement) {
    titleElement.innerHTML = category.charAt(0).toUpperCase() + category.slice(1);
}

myList.init();

import "../css/style.css";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

(async function () {
  const dataSource = new ProductData("tents");
  const listEl = document.querySelector(".product-list");
  if (!listEl) return;
  const list = new ProductList("tents", dataSource, listEl);
  await list.init();
})();

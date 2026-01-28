import "../css/style.css";
import { getParam, loadHeaderFooter } from "./utils.mjs";
import { renderBreadcrumbs } from "./breadcrumbs.mjs";

loadHeaderFooter();
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");

if (productId) {
  (async () => {
    try {
      const product = new ProductDetails(productId, dataSource);
      await product.init();
      if (product.product.Category) {
        renderBreadcrumbs(product.product.Category);
      }
    } catch (err) {
      console.error("Product load error:", err);
      const main = document.querySelector("main");
      if (main) {
        main.innerHTML = "<p>Error loading product details.</p>";
      }
    }
  })();
}

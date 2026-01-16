import "../css/style.css";
import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");

if (productId) {
  (async () => {
    const product = new ProductDetails(productId, dataSource);
    await product.init();
  })();
}

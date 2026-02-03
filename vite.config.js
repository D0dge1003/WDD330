import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  base: "/WDD330/",
  publicDir: "../src/public",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        listing: resolve(__dirname, "src/product_listing/index.html"),
        login: resolve(__dirname, "src/login/index.html"),
        orders: resolve(__dirname, "src/orders/index.html"),
        register: resolve(__dirname, "src/register/index.html"),
        success: resolve(__dirname, "src/checkout/success.html"),
        wishlist: resolve(__dirname, "src/wishlist/index.html"),
        book_nook: resolve(__dirname, "src/book-nook/index.html"),
      },
    },
  },
});

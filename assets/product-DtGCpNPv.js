import { q as o, g as C, s as D, a as S, P as x } from "./main-Br8REdZM.js";
class E {
  constructor(t, c) {
    (this.productId = t), (this.product = {}), (this.dataSource = c);
  }
  async init() {
    (this.product = await this.dataSource.findProductById(this.productId)),
      this.renderProductDetails();
    const t = o("#addToCart");
    t && t.addEventListener("click", this.addProductToCart.bind(this));
  }
  addProductToCart() {
    const t = C("so-cart") || [];
    t.push(this.product), D("so-cart", t);
  }
  renderProductDetails() {
    var h, l, m;
    if (!this.product) return;
    const t = o("#productBrand"),
      c = o("#productName"),
      s = o("#productImage"),
      e = o("#productPrice"),
      i = o("#productDiscount"),
      a = o("#productColor"),
      n = o("#productDescription"),
      u = o("#addToCart");
    if (
      (t &&
        (t.textContent =
          ((h = this.product.Brand) == null ? void 0 : h.Name) || ""),
      c &&
        (c.textContent =
          this.product.NameWithoutBrand || this.product.Name || ""),
      s)
    ) {
      const r = (this.product.Image || "").replace(
        /^\.\.\/images/,
        "/WDD330/images",
      );
      (s.src = r), (s.alt = this.product.Name || "");
    }
    e &&
      (e.textContent = `$${(this.product.FinalPrice ?? this.product.ListPrice ?? 0).toFixed(2)}`);
    const d = this.product.SuggestedRetailPrice ?? this.product.ListPrice ?? 0,
      p = this.product.FinalPrice ?? this.product.ListPrice ?? 0;
    if (i && d > p) {
      const r = d - p,
        g = Math.round((r / d) * 100);
      i.textContent = `Save ${g}% ($${r.toFixed(2)} off)`;
    } else i && (i.textContent = "");
    a &&
      (a.textContent =
        ((m = (l = this.product.Colors) == null ? void 0 : l[0]) == null
          ? void 0
          : m.ColorName) || ""),
      n &&
        (n.innerHTML =
          this.product.DescriptionHtmlSimple || this.product.Description || ""),
      u && (u.dataset.id = this.product.Id || "");
  }
}
const P = S("product"),
  I = new x("tents");
P && (async () => await new E(P, I).init())();

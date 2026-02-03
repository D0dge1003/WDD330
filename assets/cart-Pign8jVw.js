import"./modulepreload-polyfill-B5Qt9EMX.js";import{g as m,r as y,s as g,l as f}from"./utils-B75w2TNQ.js";function i(r){const t=document.createElement("div");return t.textContent=String(r),t.innerHTML}function I(r){var o,s,l,d;const t=r.SelectedColor?r.SelectedColor.ColorName:((s=(o=r.Colors)==null?void 0:o[0])==null?void 0:s.ColorName)||"",e=((l=r.Images)==null?void 0:l.PrimaryMedium)||((d=r.Images)==null?void 0:d.PrimaryLarge)||r.Image||"",c=i(e),a=`/WDD330/product_pages/index.html?product=${encodeURIComponent(r.Id)}`;return`<li class="cart-card">
  <span class="remove-item" data-id="${i(r.Id)}" data-color="${i(t)}">X</span>
  <a href="${a}" class="cart-card__image">
    <img
      src="${c}"
      alt="${i(r.Name)}"
      class="cart-image"
    />
  </a>
  <a href="${a}">
    <h2 class="card__name">${i(r.Name)}</h2>
  </a>
  <p class="cart-card__color">${i(t)}</p>
  <div class="cart-card__quantity item-quantity">
    <button class="qty-btn minus" data-id="${i(r.Id)}" data-color="${i(t)}">-</button>
    <span>${r.Quantity}</span>
    <button class="qty-btn plus" data-id="${i(r.Id)}" data-color="${i(t)}">+</button>
  </div>
  <p class="cart-card__price">$${(r.FinalPrice*r.Quantity).toFixed(2)}</p>
</li>`}class S{constructor(t,e){this.key=t,this.parentSelector=e}renderCartContents(){const t=m(this.key),e=document.querySelector(this.parentSelector);if(!t||t.length===0){e.innerHTML="<p>Your cart is empty.</p>",document.querySelector(".cart-footer").classList.add("hide");return}const c=[];t.forEach(a=>{var s,l,d;const n=a.SelectedColor?a.SelectedColor.ColorName:((l=(s=a.Colors)==null?void 0:s[0])==null?void 0:l.ColorName)||"",o=c.find(u=>{var C,p,h;return u.Id===a.Id&&(((C=u.SelectedColor)==null?void 0:C.ColorName)||((h=(p=u.Colors)==null?void 0:p[0])==null?void 0:h.ColorName)||"")===n});if(o)o.Quantity+=1;else{const u={...a,Quantity:1};!u.SelectedColor&&((d=u.Colors)!=null&&d[0]),c.push(u)}}),y(I,e,c,"afterbegin",!0),document.querySelector(".cart-footer").classList.remove("hide"),this.calculateTotal(t),this.addEventListeners()}calculateTotal(t){const e=t.reduce((c,a)=>c+a.FinalPrice,0);document.querySelector("#total-amount").innerText=`$${e.toFixed(2)}`}addEventListeners(){if(this._listenersAttached)return;const t=document.querySelector(this.parentSelector);t&&(t.addEventListener("click",e=>{e.target.classList.contains("remove-item")?this.removeItem(e.target.dataset.id,e.target.dataset.color):e.target.classList.contains("plus")?this.updateQuantity(e.target.dataset.id,e.target.dataset.color,1):e.target.classList.contains("minus")&&this.updateQuantity(e.target.dataset.id,e.target.dataset.color,-1)}),this._listenersAttached=!0)}updateQuantity(t,e,c){let a=m(this.key);if(c>0){const n=a.find(o=>{var s,l,d;return o.Id===t&&(((s=o.SelectedColor)==null?void 0:s.ColorName)||((d=(l=o.Colors)==null?void 0:l[0])==null?void 0:d.ColorName)||"")===e});if(n){const o=JSON.parse(JSON.stringify(n));a.push(o)}}else{const n=a.findIndex(o=>{var s,l,d;return o.Id===t&&(((s=o.SelectedColor)==null?void 0:s.ColorName)||((d=(l=o.Colors)==null?void 0:l[0])==null?void 0:d.ColorName)||"")===e});n>=0&&a.splice(n,1)}g(this.key,a),this.renderCartContents()}removeItem(t,e){let c=m(this.key);c=c.filter(a=>{var n,o,s;return!(a.Id===t&&(((n=a.SelectedColor)==null?void 0:n.ColorName)||((s=(o=a.Colors)==null?void 0:o[0])==null?void 0:s.ColorName)||"")===e)}),g(this.key,c),this.renderCartContents()}}f();const $=new S("so-cart",".product-list");$.renderCartContents();

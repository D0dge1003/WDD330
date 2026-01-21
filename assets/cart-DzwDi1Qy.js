import{g as o,r as s,s as n,l as i}from"./utils-D1eAuZrk.js";function l(r){return`<li class="cart-card divider">
  <span class="remove-item" data-id="${r.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${r.Image}"
      alt="${r.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${r.Name}</h2>
  </a>
  <p class="cart-card__color">${r.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${r.FinalPrice}</p>
</li>`}class d{constructor(e,t){this.key=e,this.parentSelector=t}renderCartContents(){const e=o(this.key),t=document.querySelector(this.parentSelector);if(!e||e.length===0){t.innerHTML="<p>Your cart is empty.</p>",document.querySelector(".cart-footer").classList.add("hide");return}s(l,t,e,"afterbegin",!0),document.querySelector(".cart-footer").classList.remove("hide"),this.calculateTotal(e),this.addRemoveListeners()}calculateTotal(e){const t=e.reduce((a,c)=>a+c.FinalPrice,0);document.querySelector("#total-amount").innerText=`$${t.toFixed(2)}`}addRemoveListeners(){document.querySelectorAll(".remove-item").forEach(t=>{t.addEventListener("click",a=>{const c=a.target.dataset.id;this.removeItem(c)})})}removeItem(e){const t=o(this.key),a=t.findIndex(c=>c.Id===e);a>-1&&(t.splice(a,1),n(this.key,t),this.renderCartContents())}}i();const m=new d("so-cart",".product-list");m.renderCartContents();

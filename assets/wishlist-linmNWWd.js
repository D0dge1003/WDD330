import{l as g,g as l,q as p,s as m}from"./utils-DycB6jvq.js";function a(t){const s=document.createElement("div");return s.textContent=String(t),s.innerHTML.replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function w(t){var e,r,i;let s=((e=t.Images)==null?void 0:e.PrimaryMedium)||((r=t.Images)==null?void 0:r.PrimaryLarge)||t.Image||"";s&&!s.startsWith("http")&&!s.startsWith("data:")&&!s.startsWith("/")&&!s.startsWith(".")&&(s="");const c=a(s);return`<li class="product-card">
    <span class="remove-wishlist" data-id="${a(t.Id)}">✕</span>
    <a href="/WDD330/product_pages/index.html?product=${a(t.Id)}">
      <img src="${c}" alt="${a(t.Name)}" />
      <h3 class="card__brand">${a(((i=t.Brand)==null?void 0:i.Name)||"")}</h3>
      <h2 class="card__name">${a(t.NameWithoutBrand||t.Name)}</h2>
      <p class="product-card__price">$${a(t.FinalPrice)}</p>
    </a>
    <button class="add-to-cart-btn" data-id="${a(t.Id)}">Add to Cart</button>
  </li>`}function f(){const t=l("so-wishlist")||[],s=p("#wishlist-items"),c=p(".empty-wishlist");!s||!c||(t.length===0?(s.innerHTML="",c.classList.remove("hide")):(c.classList.add("hide"),s.innerHTML=t.map(e=>w(e)).join(""),s.querySelectorAll(".remove-wishlist").forEach(e=>{e.addEventListener("click",r=>{r.preventDefault();const i=e.dataset.id;let o=l("so-wishlist")||[];o=o.filter(d=>d.Id!==i),m("so-wishlist",o),f()})}),s.querySelectorAll(".add-to-cart-btn").forEach(e=>{e.addEventListener("click",r=>{r.preventDefault();const i=e.dataset.id,d=(l("so-wishlist")||[]).find(n=>n.Id===i);if(d){let n=l("so-cart")||[];const h=n.find(u=>u.Id===i);if(h)h.Quantity=(h.Quantity||1)+1;else{const u={...d,Quantity:1};n.push(u)}m("so-cart",n),alert("Added to cart!")}})})))}g().catch(t=>{console.error("Failed to load header/footer:",t)}).finally(()=>{f()});

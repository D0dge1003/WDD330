import"./modulepreload-polyfill-B5Qt9EMX.js";import{M as P,r as $,l as w,b as y}from"./utils-B75w2TNQ.js";import{r as g,P as S}from"./ProductData-BeRx2sQe.js";function a(t){const r=document.createElement("div");return r.textContent=String(t),r.innerHTML}function L(t){var d,h;const r=a(((d=t.Images)==null?void 0:d.PrimaryMedium)||t.Image||""),e=typeof t.SuggestedRetailPrice=="number"&&t.SuggestedRetailPrice>0&&t.FinalPrice<t.SuggestedRetailPrice,i=e?t.SuggestedRetailPrice-t.FinalPrice:0,s=e?`<p class="product__discount">-${Math.round(i/t.SuggestedRetailPrice*100)}% Off</p>`:"";let o="";if(t.Images){const n=[];t.Images.PrimarySmall&&n.push(`${a(t.Images.PrimarySmall)} 300w`),t.Images.PrimaryMedium&&n.push(`${a(t.Images.PrimaryMedium)} 500w`),t.Images.PrimaryLarge&&n.push(`${a(t.Images.PrimaryLarge)} 1000w`),t.Images.PrimaryExtraLarge&&n.push(`${a(t.Images.PrimaryExtraLarge)} 1500w`),o=n.join(", ")}return`
    <li class="product-card">
      <a href="/WDD330/product_pages/index.html?product=${a(t.Id)}">
        <img src="${r}" srcset="${o}" sizes="(max-width: 600px) 300px, 500px" alt="${a(t.Name)}" />
        <h3 class="card__brand">${a(((h=t.Brand)==null?void 0:h.Name)||"")}</h3>
        <h2 class="card__name">${a(t.NameWithoutBrand||t.Name)}</h2>
        <p class="product-card__price">$${a(t.ListPrice)}</p>
        ${s}
      </a>
      <button class="quick-view" data-id="${a(t.Id)}">Quick View</button>
    </li>
  `}class I{constructor(r,e,i){this.category=r,this.dataSource=e,this.listElement=i,this.products=[]}async init(){var r;try{if(this.products=await this.dataSource.getData(this.category),console.log(`Loaded ${((r=this.products)==null?void 0:r.length)||0} products for category: ${this.category} `),!this.products||this.products.length===0){console.warn(`No products found for category: ${this.category} `),this.listElement.innerHTML="<p>No products found.</p>";return}this.renderList(this.products),this._initialized||(this.listElement.addEventListener("click",e=>{if(e.target.classList.contains("quick-view")){e.preventDefault();const i=e.target.dataset.id;this.quickView(i)}}),this._initialized=!0)}catch(e){console.error("Error loading products:",e),this.listElement.innerHTML="<p>Error loading products. Please try again.</p>"}}async quickView(r){var e,i;try{const s=this.products.find(m=>m.Id===r)||await this.dataSource.findProductById(r);if(!s){alert("Product not found.");return}const o=new P,d=s.DescriptionHtmlSimple||"",n=new DOMParser().parseFromString(d,"text/html");n.querySelectorAll("a.glossaryTermLink").forEach(m=>m.replaceWith(m.textContent));const f=`
        <div class="product-detail quick-view-detail">
          <h3>${a(((e=s.Brand)==null?void 0:e.Name)||"")}</h3>
          <h2>${a(s.NameWithoutBrand||s.Name)}</h2>
          <img src="${a(((i=s.Images)==null?void 0:i.PrimaryLarge)||s.Image||"")}" alt="${a(s.Name)}" />
          <p class="product-card__price">$${a(s.FinalPrice)}</p>
          <p>${a(n.body.textContent)}</p>
          <div class="product-detail__add">
             <a href="/WDD330/product_pages/index.html?product=${a(s.Id)}" class="btn add-to-cart-btn">View Full Details</a>
          </div>
        </div>
      `;o.render("Quick View",f)}catch(s){console.error("Quick view error:",s),alert("Sorry, we could not load the product details right now.")}}renderList(r,e="afterbegin",i=!0){$(L,this.listElement,r,e,i)}sortBy(r){r==="name"?this.products.sort((e,i)=>{const s=e.NameWithoutBrand||e.Name,o=i.NameWithoutBrand||i.Name;return s.localeCompare(o)}):r==="price"&&this.products.sort((e,i)=>e.FinalPrice-i.FinalPrice),this.renderList(this.products)}}w();const c=y("category"),u=y("q"),E=new S,l=document.querySelector(".product-list"),p=u||c;if(p){const t=new I(p,E,l),r=document.querySelector(".title");r&&(u?r.textContent=`Search Results: ${u}`:c&&(r.textContent=c.charAt(0).toUpperCase()+c.slice(1))),(async()=>{try{await t.init(),u?g("Search",t.products.length):c&&g(c,t.products.length);const e=document.getElementById("sort-select");e&&e.addEventListener("change",i=>{t.sortBy(i.target.value)})}catch(e){console.error("Initialization error:",e),l&&(l.textContent="Error loading products. Please try again later.")}})()}else{const t=document.querySelector(".title");t&&(t.textContent="No category or search term provided"),l&&(l.textContent="Please select a category or use the search bar.")}

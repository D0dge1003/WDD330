import{M as P,r as $,l as w,b as y}from"./utils-DycB6jvq.js";import{r as g,P as S}from"./ProductData-BF7rp3fH.js";function a(e){const r=document.createElement("div");return r.textContent=String(e),r.innerHTML}function L(e){var d,h;const r=a(((d=e.Images)==null?void 0:d.PrimaryMedium)||e.Image||""),t=typeof e.SuggestedRetailPrice=="number"&&e.SuggestedRetailPrice>0&&e.FinalPrice<e.SuggestedRetailPrice,i=t?e.SuggestedRetailPrice-e.FinalPrice:0,s=t?`<p class="product__discount">-${Math.round(i/e.SuggestedRetailPrice*100)}% Off</p>`:"";let o="";if(e.Images){const n=[];e.Images.PrimarySmall&&n.push(`${a(e.Images.PrimarySmall)} 300w`),e.Images.PrimaryMedium&&n.push(`${a(e.Images.PrimaryMedium)} 500w`),e.Images.PrimaryLarge&&n.push(`${a(e.Images.PrimaryLarge)} 1000w`),e.Images.PrimaryExtraLarge&&n.push(`${a(e.Images.PrimaryExtraLarge)} 1500w`),o=n.join(", ")}return`
    <li class="product-card">
      <a href="/WDD330/product_pages/index.html?product=${a(e.Id)}">
        <img src="${r}" srcset="${o}" sizes="(max-width: 600px) 300px, 500px" alt="${a(e.Name)}" />
        <h3 class="card__brand">${a(((h=e.Brand)==null?void 0:h.Name)||"")}</h3>
        <h2 class="card__name">${a(e.NameWithoutBrand||e.Name)}</h2>
        <p class="product-card__price">$${a(e.ListPrice)}</p>
        ${s}
      </a>
      <button class="quick-view" data-id="${a(e.Id)}">Quick View</button>
    </li>
  `}class I{constructor(r,t,i){this.category=r,this.dataSource=t,this.listElement=i,this.products=[]}async init(){var r;try{if(this.products=await this.dataSource.getData(this.category),console.log(`Loaded ${((r=this.products)==null?void 0:r.length)||0} products for category: ${this.category} `),!this.products||this.products.length===0){console.warn(`No products found for category: ${this.category} `),this.listElement.innerHTML="<p>No products found.</p>";return}this.renderList(this.products),this._initialized||(this.listElement.addEventListener("click",t=>{if(t.target.classList.contains("quick-view")){t.preventDefault();const i=t.target.dataset.id;this.quickView(i)}}),this._initialized=!0)}catch(t){console.error("Error loading products:",t),this.listElement.innerHTML="<p>Error loading products. Please try again.</p>"}}async quickView(r){var t,i;try{const s=this.products.find(m=>m.Id===r)||await this.dataSource.findProductById(r);if(!s){alert("Product not found.");return}const o=new P,d=s.DescriptionHtmlSimple||"",n=new DOMParser().parseFromString(d,"text/html");n.querySelectorAll("a.glossaryTermLink").forEach(m=>m.replaceWith(m.textContent));const f=`
        <div class="product-detail quick-view-detail">
          <h3>${a(((t=s.Brand)==null?void 0:t.Name)||"")}</h3>
          <h2>${a(s.NameWithoutBrand||s.Name)}</h2>
          <img src="${a(((i=s.Images)==null?void 0:i.PrimaryLarge)||s.Image||"")}" alt="${a(s.Name)}" />
          <p class="product-card__price">$${a(s.FinalPrice)}</p>
          <p>${a(n.body.textContent)}</p>
          <div class="product-detail__add">
             <a href="/WDD330/product_pages/index.html?product=${a(s.Id)}" class="btn add-to-cart-btn">View Full Details</a>
          </div>
        </div>
      `;o.render("Quick View",f)}catch(s){console.error("Quick view error:",s),alert("Sorry, we could not load the product details right now.")}}renderList(r,t="afterbegin",i=!0){$(L,this.listElement,r,t,i)}sortBy(r){r==="name"?this.products.sort((t,i)=>{const s=t.NameWithoutBrand||t.Name,o=i.NameWithoutBrand||i.Name;return s.localeCompare(o)}):r==="price"&&this.products.sort((t,i)=>t.FinalPrice-i.FinalPrice),this.renderList(this.products)}}w();const c=y("category"),u=y("q"),E=new S,l=document.querySelector(".product-list"),p=u||c;if(p){const e=new I(p,E,l),r=document.querySelector(".title");r&&(u?r.textContent=`Search Results: ${u}`:c&&(r.textContent=c.charAt(0).toUpperCase()+c.slice(1))),(async()=>{try{await e.init(),u?g("Search",e.products.length):c&&g(c,e.products.length);const t=document.getElementById("sort-select");t&&t.addEventListener("change",i=>{e.sortBy(i.target.value)})}catch(t){console.error("Initialization error:",t),l&&(l.textContent="Error loading products. Please try again later.")}})()}else{const e=document.querySelector(".title");e&&(e.textContent="No category or search term provided"),l&&(l.textContent="Please select a category or use the search bar.")}

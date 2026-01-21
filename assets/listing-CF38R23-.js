import{r as h,l as m,a as d}from"./utils-B3GCnpRJ.js";import{P as g}from"./ProductData-Ci8lvGAC.js";function p(e){var c,n;const t=((c=e.Images)==null?void 0:c.PrimaryMedium)||e.Image||"",r=e.FinalPrice<e.SuggestedRetailPrice,s=e.SuggestedRetailPrice-e.FinalPrice,u=r?`<p class="product__discount">-${Math.round(s/e.SuggestedRetailPrice*100)}% Off</p>`:"";return`
    <li class="product-card">
      <a href="/WDD330/product_pages/index.html?product=${e.Id}">
        <img src="${t}" alt="${e.Name}" />
        <h3 class="card__brand">${((n=e.Brand)==null?void 0:n.Name)||""}</h3>
        <h2 class="card__name">${e.NameWithoutBrand||e.Name}</h2>
        <p class="product-card__price">$${e.ListPrice}</p>
        ${u}
      </a>
    </li>
  `}class y{constructor(t,r,s){this.category=t,this.dataSource=r,this.listElement=s,this.products=[]}async init(){var t;try{if(this.products=await this.dataSource.getData(this.category),console.log(`Loaded ${((t=this.products)==null?void 0:t.length)||0} products for category: ${this.category}`),!this.products||this.products.length===0){console.warn(`No products found for category: ${this.category}`),this.listElement.innerHTML="<p>No products found.</p>";return}this.renderList(this.products)}catch(r){console.error("Error loading products:",r),this.listElement.innerHTML="<p>Error loading products. Please try again.</p>"}}renderList(t,r="afterbegin",s=!0){h(p,this.listElement,t,r,s)}}m();const i=d("category"),o=d("q"),f=new g,a=document.querySelector(".product-list"),l=o||i;if(l){const e=new y(l,f,a),t=document.querySelector(".title");t&&(o?t.innerHTML=`Search Results: ${o}`:i&&(t.innerHTML=i.charAt(0).toUpperCase()+i.slice(1))),e.init()}else{const e=document.querySelector(".title");e&&(e.innerHTML="No category or search term provided"),a&&(a.innerHTML="<p>Please select a category or use the search bar.</p>")}

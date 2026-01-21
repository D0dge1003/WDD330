import{r as l,l as d,a as u}from"./utils-B3GCnpRJ.js";import{P as h}from"./ProductData-Ci8lvGAC.js";function m(t){var i,o;const e=((i=t.Images)==null?void 0:i.PrimaryMedium)||t.Image||"",r=t.FinalPrice<t.SuggestedRetailPrice,s=t.SuggestedRetailPrice-t.FinalPrice,n=r?`<p class="product__discount">-${Math.round(s/t.SuggestedRetailPrice*100)}% Off</p>`:"";return`
    <li class="product-card">
      <a href="/WDD330/product_pages/index.html?product=${t.Id}">
        <img src="${e}" alt="${t.Name}" />
        <h3 class="card__brand">${((o=t.Brand)==null?void 0:o.Name)||""}</h3>
        <h2 class="card__name">${t.NameWithoutBrand||t.Name}</h2>
        <p class="product-card__price">$${t.ListPrice}</p>
        ${n}
      </a>
    </li>
  `}class g{constructor(e,r,s){this.category=e,this.dataSource=r,this.listElement=s,this.products=[]}async init(){var e;try{if(this.products=await this.dataSource.getData(this.category),console.log(`Loaded ${((e=this.products)==null?void 0:e.length)||0} products for category: ${this.category}`),!this.products||this.products.length===0){console.warn(`No products found for category: ${this.category}`),this.listElement.innerHTML="<p>No products found.</p>";return}this.renderList(this.products)}catch(r){console.error("Error loading products:",r),this.listElement.innerHTML="<p>Error loading products. Please try again.</p>"}}renderList(e,r="afterbegin",s=!0){l(m,this.listElement,e,r,s)}}d();const a=u("category"),p=new h,y=document.querySelector(".product-list"),f=new g(a,p,y),c=document.querySelector(".title");c&&(c.innerHTML=a.charAt(0).toUpperCase()+a.slice(1));f.init();

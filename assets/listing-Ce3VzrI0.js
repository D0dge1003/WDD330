import{r as l,l as d,a as m}from"./utils-B3GCnpRJ.js";import{P as u}from"./ProductData-B1aYoRqE.js";function h(t){var r,c;const e=((r=t.Images)==null?void 0:r.PrimaryMedium)||t.Image||"",a=t.FinalPrice<t.SuggestedRetailPrice,s=t.SuggestedRetailPrice-t.FinalPrice,o=a?`<p class="product__discount">-${Math.round(s/t.SuggestedRetailPrice*100)}% Off</p>`:"";return`
    <li class="product-card">
      <a href="/WDD330/product_pages/index.html?product=${t.Id}">
        <img src="${e}" alt="${t.Name}" />
        <h3 class="card__brand">${((c=t.Brand)==null?void 0:c.Name)||""}</h3>
        <h2 class="card__name">${t.NameWithoutBrand||t.Name}</h2>
        <p class="product-card__price">$${t.ListPrice}</p>
        ${o}
      </a>
    </li>
  `}class g{constructor(e,a,s){this.category=e,this.dataSource=a,this.listElement=s,this.products=[]}async init(){this.products=await this.dataSource.getData(this.category),this.renderList(this.products)}renderList(e,a="afterbegin",s=!0){l(h,this.listElement,e,a,s)}}d();const i=m("category"),P=new u,p=document.querySelector(".product-list"),$=new g(i,P,p),n=document.querySelector(".title");n&&(n.innerHTML=i.charAt(0).toUpperCase()+i.slice(1));$.init();

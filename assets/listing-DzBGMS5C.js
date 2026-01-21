import{r as m,l as u,a as l}from"./utils-D1eAuZrk.js";import{P as h}from"./ProductData-B1aYoRqE.js";function g(t){var n,o;const e=((n=t.Images)==null?void 0:n.PrimaryMedium)||t.Image||"",s=t.FinalPrice<t.SuggestedRetailPrice,a=t.SuggestedRetailPrice-t.FinalPrice,d=s?`<p class="product__discount">-${Math.round(a/t.SuggestedRetailPrice*100)}% Off</p>`:"";return`
    <li class="product-card">
      <a href="/WDD330/product_pages/index.html?product=${t.Id}">
        <img src="${e}" alt="${t.Name}" />
        <h3 class="card__brand">${((o=t.Brand)==null?void 0:o.Name)||""}</h3>
        <h2 class="card__name">${t.NameWithoutBrand||t.Name}</h2>
        <p class="product-card__price">$${t.ListPrice}</p>
        ${d}
      </a>
    </li>
  `}class y{constructor(e,s,a){this.category=e,this.dataSource=s,this.listElement=a,this.products=[]}async init(){this.products=await this.dataSource.getData(this.category),this.renderList(this.products)}renderList(e,s="afterbegin",a=!0){m(g,this.listElement,e,s,a)}}u();const i=l("category"),c=l("q"),P=new h,$=document.querySelector(".product-list"),f=c||i,p=new y(f,P,$),r=document.querySelector(".title");r&&(c?r.innerHTML=`Search Results: ${c}`:i&&(r.innerHTML=i.charAt(0).toUpperCase()+i.slice(1)));p.init();

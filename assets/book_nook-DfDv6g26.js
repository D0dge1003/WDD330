import"./modulepreload-polyfill-B5Qt9EMX.js";const F="https://openlibrary.org/search.json";async function _(i){if(!i)return[];const e=encodeURIComponent(i),t=`${F}?q=${e}&fields=key,title,author_name,cover_i,publish_year,publisher,language,number_of_pages_median&limit=24`;try{const s=await fetch(t);if(!s.ok)throw new Error(`API Error: ${s.statusText}`);return(await s.json()).docs}catch(s){throw console.error("Failed to fetch books:",s),s}}async function H(i){const e=`https://openlibrary.org${i}.json`;try{const t=await fetch(e);if(!t.ok)throw new Error("Failed to fetch details");return await t.json()}catch(t){return console.error("Error fetching details:",t),null}}class B{constructor(e){this.key=e}get(){const e=localStorage.getItem(this.key);return e?JSON.parse(e):[]}set(e){localStorage.setItem(this.key,JSON.stringify(e))}add(e){const t=this.get();return t.some(s=>s.key===e.key)?!1:(t.push(e),this.set(t),!0)}remove(e){let t=this.get();t=t.filter(s=>s.key!==e),this.set(t)}has(e){return this.get().some(s=>s.key===e)}}const D='data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3e%3crect width="200" height="280" fill="%23eae6d8"/%3e%3ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="24" fill="%236d5e55"%3eNo Cover%3c/text%3e%3c/svg%3e';function P(i,e,t={}){if(e.innerHTML="",!i||i.length===0){const s=t.emptyMessage||"No books found.";e.innerHTML=`<div class="empty-state"><p>${s}</p></div>`;return}i.forEach((s,a)=>{const o=document.createElement("div");o.className="book-card",o.style.animationDelay=`${a*50}ms`;const n=s.title||"Unknown Title",l=s.author_name?s.author_name.slice(0,2).join(", "):"Unknown Author",T=s.cover_i?`https://covers.openlibrary.org/b/id/${s.cover_i}-M.jpg`:D,C=s.publish_year?s.publish_year[0]:"N/A",q=s.number_of_pages_median?`${s.number_of_pages_median} pp`:"";let w="";t.view==="history"&&s.review&&(w=`
                <div class="book-review">
                    <span class="stars">${"★".repeat(s.review.rating||0)+"☆".repeat(5-(s.review.rating||0))}</span>
                    <span class="review-text">"${s.review.text||""}"</span>
                </div>
            `);let v="";t.view==="search"?v=`<button class="action-btn add-btn" data-key="${s.key}" aria-label="Add ${n} to Wishlist">✨ Wishlist</button>`:t.view==="wishlist"?v=`
                <button class="action-btn move-btn" data-key="${s.key}" aria-label="Mark ${n} as read">✅ Read</button>
                <button class="action-btn delete delete-btn" data-key="${s.key}" aria-label="Remove ${n} from list">🗑 Remove</button>
             `:t.view==="history"&&(v=`
                <button class="action-btn review-btn" data-key="${s.key}" aria-label="Review ${n}">⭐ Review</button>
                <button class="action-btn delete delete-btn" data-key="${s.key}" aria-label="Remove ${n} from history">🗑 Remove</button>
             `);const N=`
            <img src="${T}" alt="Cover of ${n}" class="book-cover" loading="lazy" style="cursor: pointer;">
            <h2 class="book-title">${n}</h2>
            <p class="author">${l}</p>
            <div class="meta">
                <span>${C}</span>
                <span>${q}</span>
            </div>
            ${w}
            <div class="card-actions">
                ${v}
            </div>
        `;o.innerHTML=N;const b=o.querySelector(".add-btn");b&&b.addEventListener("click",()=>t.onAdd(s));const L=o.querySelector(".move-btn");L&&L.addEventListener("click",()=>t.onMove(s));const $=o.querySelector(".review-btn");$&&$.addEventListener("click",()=>t.onReview(s));const k=o.querySelector(".delete-btn");k&&k.addEventListener("click",()=>t.onRemove(s.key));const E=o.querySelector(".book-cover");E&&E.addEventListener("click",()=>{t.onDetails&&t.onDetails(s)}),e.appendChild(o)})}class W{constructor(){this.container=document.createElement("div"),this.container.className="toast-container",document.body.appendChild(this.container)}show(e,t="info"){const s=document.createElement("div");s.className=`toast toast-${t}`;let a="ℹ️";t==="success"&&(a="✅"),t==="error"&&(a="⚠️"),t==="warning"&&(a="🔔"),s.innerHTML=`
            <span class="toast-icon">${a}</span>
            <span class="toast-message">${e}</span>
        `,this.container.appendChild(s),requestAnimationFrame(()=>{s.classList.add("show")}),setTimeout(()=>{s.classList.remove("show"),s.addEventListener("transitionend",()=>{s.remove()})},3e3)}}const r=new W;class j{constructor(){this.storageKey="book-nook-welcome-seen"}show(){if(localStorage.getItem(this.storageKey))return;const e=document.createElement("div");e.className="welcome-overlay";const t=document.createElement("div");t.className="welcome-card",t.innerHTML=`
            <div class="welcome-icon">📖</div>
            <h2>Welcome to Book Nook</h2>
            <p>Your personal distraction-free library.</p>
            <ul>
                <li>🔍 <strong>Search</strong> for your favorite books</li>
                <li>✨ <strong>Add</strong> them to your Wishlist</li>
                <li>✅ <strong>Track</strong> what you've read</li>
            </ul>
            <button id="startBtn" class="welcome-btn">Start Exploring</button>
        `,e.appendChild(t),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("show"),t.classList.add("show")}),document.getElementById("startBtn").addEventListener("click",()=>{this.close(e)})}close(e){e.classList.remove("show"),setTimeout(()=>{e.remove(),localStorage.setItem(this.storageKey,"true")},500)}}class U{constructor(e){this.onSubmit=e,this.modal=null}open(e,t={}){this.createModal(e,t),document.body.appendChild(this.modal),requestAnimationFrame(()=>this.modal.classList.add("show"))}createModal(e,t){this.modal=document.createElement("div"),this.modal.className="review-overlay";const s=t.rating||0,a=t.text||"";this.modal.innerHTML=`
            <div class="review-card">
                <button class="close-btn" aria-label="Close">×</button>
                <h2>Review "${e.title}"</h2>
                <div class="star-rating">
                    ${[1,2,3,4,5].map(l=>`
                        <span class="star ${l<=s?"filled":""}" data-value="${l}">★</span>
                    `).join("")}
                </div>
                <textarea placeholder="Write your thoughts here..." rows="4">${a}</textarea>
                <button class="save-review-btn">Save Review</button>
            </div>
        `,this.modal.querySelector(".close-btn").addEventListener("click",()=>this.close());const o=this.modal.querySelectorAll(".star");let n=s;o.forEach(l=>{l.addEventListener("click",()=>{n=parseInt(l.dataset.value),this.updateStars(o,n)})}),this.modal.querySelector(".save-review-btn").addEventListener("click",()=>{const l=this.modal.querySelector("textarea").value;this.onSubmit(e.key,{rating:n,text:l}),this.close()}),this.modal.addEventListener("click",l=>{l.target===this.modal&&this.close()})}updateStars(e,t){e.forEach(s=>{parseInt(s.dataset.value)<=t?s.classList.add("filled"):s.classList.remove("filled")})}close(){this.modal&&(this.modal.classList.remove("show"),setTimeout(()=>{this.modal.remove(),this.modal=null},300))}}class G{constructor(){this.modal=null}async open(e,t){this.createModal(e,t),document.body.appendChild(this.modal),requestAnimationFrame(()=>this.modal.classList.add("show")),this.loadDetails(e.key)}createModal(e,t){this.modal=document.createElement("div"),this.modal.className="details-overlay";const s=e.cover_i?`https://covers.openlibrary.org/b/id/${e.cover_i}-L.jpg`:'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3e%3crect width="200" height="280" fill="%23eae6d8"/%3e%3ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="24" fill="%236d5e55"%3eNo Cover%3c/text%3e%3c/svg%3e',a=e.author_name?e.author_name.join(", "):"Unknown Author";let o="";t&&(o=`
                <div class="user-review-section">
                    <h3>Your Review</h3>
                    <div class="stars">${"★".repeat(t.rating||0)+"☆".repeat(5-(t.rating||0))}</div>
                    <p class="review-comment">"${t.text||""}"</p>
                </div>
            `),this.modal.innerHTML=`
            <div class="details-card">
                <button class="close-details-btn" aria-label="Close">×</button>
                <div class="details-content">
                    <div class="details-image">
                        <img src="${s}" alt="${e.title}">
                    </div>
                    <div class="details-info">
                        <h2>${e.title}</h2>
                        <p class="details-author">by ${a}</p>
                        <div class="details-meta">
                            <span>Originally Published: ${e.publish_year?e.publish_year[0]:"N/A"}</span>
                        </div>
                        
                        <div class="synopsis-section">
                            <h3>Synopsis</h3>
                            <p id="synopsisText" class="loading-text">Fetching synopsis...</p>
                        </div>

                        ${o}
                    </div>
                </div>
            </div>
        `,this.modal.querySelector(".close-details-btn").addEventListener("click",()=>this.close()),this.modal.addEventListener("click",n=>{n.target===this.modal&&this.close()})}async loadDetails(e){const t=await H(e),s=this.modal.querySelector("#synopsisText");if(t&&t.description){let a=typeof t.description=="string"?t.description:t.description.value;s.textContent=a,s.classList.remove("loading-text")}else s.textContent="No synopsis available for this edition.",s.classList.remove("loading-text")}close(){this.modal&&(this.modal.classList.remove("show"),setTimeout(()=>{this.modal.remove(),this.modal=null},300))}}let c=[],h="search";const m=new B("book-nook-wishlist"),d=new B("book-nook-history"),O=new U(X),Y=new G,A=document.getElementById("searchInput"),I=document.getElementById("searchBtn"),g=document.getElementById("bookGrid"),S=document.getElementById("loadingIndicator"),z=document.getElementById("testApiBtn"),R=document.getElementById("sortSelect"),M=document.querySelectorAll(".nav-btn"),y=document.getElementById("themeToggle");function K(){f("search"),localStorage.getItem("theme")==="dark"&&(document.body.setAttribute("data-theme","dark"),y.textContent="☀️"),new j().show()}y.addEventListener("click",()=>{document.body.getAttribute("data-theme")==="dark"?(document.body.removeAttribute("data-theme"),localStorage.setItem("theme","light"),y.textContent="🌙"):(document.body.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),y.textContent="☀️")});I.addEventListener("click",()=>{const i=A.value.trim();i&&(h!=="search"&&f("search"),J(i))});A.addEventListener("keypress",i=>{i.key==="Enter"&&I.click()});z.addEventListener("click",async()=>{const i="Harry Potter";r.show("Testing API connection...","info");try{const e=await _(i);console.log("API Results:",e),r.show(`API Success! Found ${e.length} books.`,"success")}catch(e){console.error("API Test Failed",e),r.show("API Connection Failed!","error")}});M.forEach(i=>{i.addEventListener("click",e=>{const s=e.target.closest(".nav-btn").dataset.view;f(s)})});R.addEventListener("change",()=>{p(),u()});async function J(i){x(!0);try{c=await _(i),p(),u(),c.length>0?r.show(`Found ${c.length} books for "${i}"`,"success"):r.show(`No books found for "${i}"`,"warning")}catch{g.innerHTML='<div class="empty-state"><p>Something went wrong. Please try again.</p></div>',r.show("Error fetching books","error")}finally{x(!1)}}function f(i){h=i,M.forEach(e=>{e.dataset.view===i?e.classList.add("active"):e.classList.remove("active")}),i==="wishlist"?(c=m.get(),document.querySelector(".search-bar").style.visibility="hidden"):i==="history"?(c=d.get(),document.querySelector(".search-bar").style.visibility="hidden"):document.querySelector(".search-bar").style.visibility="visible",p(),u()}function u(){const i={view:h,onAdd:Z,onRemove:ee,onMove:te,onReview:V,onDetails:Q};h==="wishlist"&&(i.emptyMessage="Your wishlist is empty. Go search for books!"),h==="history"&&(i.emptyMessage="You haven't finished any books yet."),P(c,g,i)}function V(i){O.open(i,i.review)}function Q(i){let e=i.review;if(!e&&d.has(i.key)){const t=d.get().find(s=>s.key===i.key);t&&(e=t.review)}Y.open(i,e)}function X(i,e){const t=d.get(),s=t.findIndex(a=>a.key===i);s!==-1&&(t[s].review=e,d.set(t),c=t,u(),r.show("Review Saved!","success"))}function p(){const i=R.value;c.sort((e,t)=>{if(i==="title")return(e.title||"").localeCompare(t.title||"");if(i==="newest"){const s=e.publish_year?e.publish_year[0]:0;return(t.publish_year?t.publish_year[0]:0)-s}else if(i==="oldest"){const s=e.publish_year?e.publish_year[0]:0,a=t.publish_year?t.publish_year[0]:0;return s-a}return 0})}function x(i){i?(S.classList.remove("hidden"),g.classList.add("hidden")):(S.classList.add("hidden"),g.classList.remove("hidden"))}function Z(i){m.add(i)?r.show(`Added "${i.title}" to Wishlist!`,"success"):r.show(`"${i.title}" is already in your Wishlist.`,"warning")}function ee(i){h==="wishlist"?(m.remove(i),c=m.get(),r.show("Removed from Wishlist","info")):h==="history"&&(d.remove(i),c=d.get(),r.show("Removed from History","info")),u()}function te(i){d.add(i),m.remove(i.key),c=m.get(),u(),r.show(`Marked "${i.title}" as Read!`,"success")}K();

import{l as m}from"./utils-DycB6jvq.js";import{c as u,o as g}from"./auth-CYUQ_HqM.js";m();const s=u();function n(o){const e=document.createElement("div");return e.textContent=String(o),e.innerHTML}s&&p(s);async function p(o){try{const{unauthorized:e,data:t}=await g(o);if(e){window.location.href="/WDD330/login/index.html?message=Session expired. Please login again.";return}const i=document.querySelector("#orders-list");if(!i)return;if(!t||t.length===0){i.innerHTML="<p>No orders found.</p>";return}const c=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});i.innerHTML=t.map(r=>{const a=new Date(r.orderDate),l=isNaN(a.getTime())?"N/A":a.toLocaleDateString(),d=c.format(r.orderTotal||0);return`
            <li class="order-card">
                <h3>Order #${n(r.id)}</h3>
                <p>Date: ${n(l)}</p>
                <p>Total: ${n(d)}</p>
                <p>Items: ${n(r.items?r.items.length:0)}</p>
            </li>
          `}).join("")}catch(e){console.error("Failed to load orders:",e);const t=document.querySelector("#orders-list");t&&(t.textContent="Error loading orders. Please try again later.")}}

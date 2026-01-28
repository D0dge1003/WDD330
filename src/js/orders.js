import { loadHeaderFooter, renderListWithTemplate } from "./utils.mjs";
import { checkLogin, ordersRequest } from "./auth.mjs";

loadHeaderFooter();

const token = checkLogin();

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

if (token) {
  initOrders(token);
}

async function initOrders(token) {
  try {
    const { unauthorized, data } = await ordersRequest(token);

    if (unauthorized) {
      window.location.href = "/WDD330/login/index.html?message=Session expired. Please login again.";
      return;
    }

    const listEl = document.querySelector("#orders-list");
    if (!listEl) return;

    if (!data || data.length === 0) {
      listEl.innerHTML = "<p>No orders found.</p>";
      return;
    }

    const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    listEl.innerHTML = data
      .map(
        (order) => {
          const orderDate = new Date(order.orderDate);
          const dateString = isNaN(orderDate.getTime()) ? "N/A" : orderDate.toLocaleDateString();
          const totalFormatted = currencyFormat.format(order.orderTotal || 0);

          return `
            <li class="order-card">
                <h3>Order #${escapeHtml(order.id)}</h3>
                <p>Date: ${escapeHtml(dateString)}</p>
                <p>Total: ${escapeHtml(totalFormatted)}</p>
                <p>Items: ${escapeHtml(order.items ? order.items.length : 0)}</p>
            </li>
          `;
        }
      )
      .join("");
  } catch (err) {
    console.error('Failed to load orders:', err);
    const listEl = document.querySelector("#orders-list");
    if (listEl) {
      listEl.textContent = "Error loading orders. Please try again later.";
    }
  }
}

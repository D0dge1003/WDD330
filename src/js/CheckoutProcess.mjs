import { getLocalStorage, setLocalStorage } from "./utils.mjs";
// We need a way to submit the order. We can use ExternalServices (if it existed) or similar logic.
// I will assume I need to implement a 'checkout' method that calls the API.

const baseURL = (import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/").replace(/\/$/, "") + "/";

function packageItems(items) {
    // Convert cart items to simplified structure expected by API
    return items.map((item) => ({
        id: item.Id,
        price: item.FinalPrice,
        name: item.Name,
        quantity: item.Quantity || 1, // Ensure quantity is handled if our cart uses it
    }));
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSummary();
        this.calculateOrdertotal();
    }

    calculateItemSummary() {
        // calculate summary of items
        this.itemTotal = this.list.reduce((sum, item) => sum + (item.FinalPrice * (item.Quantity || 1)), 0);

        // display subtotal with null guard
        const subtotalEl = document.querySelector(this.outputSelector + " #item-subtotal");
        if (subtotalEl) {
            subtotalEl.innerText = "$" + this.itemTotal.toFixed(2);
        }
    }

    calculateOrdertotal() {
        // Shipping: $10 for first item, $2 for each additional
        const quantity = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);
        this.shipping = 10 + (quantity - 1) * 2;
        // prevent negative shipping if empty
        if (quantity === 0) this.shipping = 0;

        // Tax: 6%
        this.tax = this.itemTotal * 0.06;

        this.orderTotal = this.itemTotal + this.shipping + this.tax;

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const shippingEl = document.querySelector(this.outputSelector + " #shipping-est");
        const taxEl = document.querySelector(this.outputSelector + " #tax-amount");
        const totalEl = document.querySelector(this.outputSelector + " #order-total");

        if (shippingEl) shippingEl.innerText = "$" + this.shipping.toFixed(2);
        if (taxEl) taxEl.innerText = "$" + this.tax.toFixed(2);
        if (totalEl) totalEl.innerText = "$" + this.orderTotal.toFixed(2);
    }

    async checkout() {
        const form = document.forms["checkout-form"]; // HTMLFormElement
        if (!form) {
            console.error("Checkout form not found.");
            alert("Checkout form is missing. Please refresh the page.");
            return;
        }

        const json = formDataToJSON(form);
        // Add calculated fields
        json.orderDate = new Date();
        json.orderTotal = this.orderTotal.toFixed(2);
        json.tax = this.tax.toFixed(2);
        json.shipping = this.shipping.toFixed(2);
        json.items = packageItems(this.list);

        try {
            const res = await checkoutRequest(json);
            // Success: notify then navigate
            alert("Order Placed Successfully!");
            setLocalStorage(this.key, []); // clear cart
            location.assign("/WDD330/checkout/success.html");
        } catch (err) {
            // Error handling as per requirement
            // The error object from my refactored convertToJson will have name and message (json response)
            // I should display these alerts nicely
            console.log(err);

            // Parse the error messages if possible
            let messages = [];
            if (err.message) {
                if (typeof err.message === 'object') {
                    messages.push(err.message.message || JSON.stringify(err.message));
                } else {
                    messages.push(err.message);
                }
            }

            alert("Order Failed: " + messages.join("\n"));
        }
    }
}

// Helpers
function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON;
}

// Network Request (could be in ExternalServices)
async function checkoutRequest(payload) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    };
    const response = await fetch(baseURL + 'checkout', options);
    // Use the improved error handling logic here
    if (response.ok) {
        return response.json();
    } else {
        const json = await response.json();
        throw { name: 'servicesError', message: json };
    }
}

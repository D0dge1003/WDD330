import { setLocalStorage, getLocalStorage } from "./utils.mjs";

const baseURL = import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

export async function loginRequest(creds, redirect = "/") {
    // Validate redirect to prevent open-redirect vulnerabilities
    const safeRedirect = (redirect.startsWith("/") && !redirect.startsWith("//")) ? redirect : "/";

    try {
        const response = await fetch(baseURL + "login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(creds),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            alert(errorData.message || "Login failed");
            return;
        }

        const data = await response.json();
        setLocalStorage("so_token", data.accessToken);
        window.location.href = safeRedirect;
    } catch (err) {
        console.error(err);
        alert("Login failed due to a network error.");
    }
}

export function checkLogin() {
    const token = getLocalStorage("so_token");
    if (!token) {
        const currentPath = window.location.pathname;
        window.location.href = `/WDD330/login/index.html?redirect=${encodeURIComponent(currentPath)}`;
        return false;
    }
    return token;
}

export async function ordersRequest(token) {
    try {
        const response = await fetch(baseURL + "orders", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            return { unauthorized: true, data: [] };
        }

        if (!response.ok) {
            throw new Error(`Orders request failed: ${response.status}`);
        }

        const data = await response.json();
        return { unauthorized: false, data: Array.isArray(data) ? data : [] };
    } catch (err) {
        console.error(err);
        return { unauthorized: false, data: [] };
    }
}

export async function registerRequest(user, redirect = "/") {
    const safeRedirect = (redirect.startsWith("/") && !redirect.startsWith("//")) ? redirect : "/";

    try {
        const response = await fetch(baseURL + "users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            alert(errorData.message || "Registration failed");
            return;
        }

        alert("Registration successful! Please login.");
        window.location.href = safeRedirect;
    } catch (err) {
        console.error(err);
        alert("Registration failed due to a network error.");
    }
}

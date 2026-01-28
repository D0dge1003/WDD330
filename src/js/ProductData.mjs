const baseURL = import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ProductData {
  constructor() { }
  async getData(category) {
    try {
      const url = baseURL + `products/search/${category}`;
      const response = await fetch(url);
      const data = await convertToJson(response);
      return data.Result || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error; // Re-throw so callers can distinguish between an empty result and a failure
    }
  }
  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}

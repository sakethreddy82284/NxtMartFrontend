
import { BASE_URL } from "../../config.js";

export const addToCart = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("🛒 Added to cart");
    } else {
      alert(data.message);
    }
  } catch {
    alert("Something went wrong");
  }
};


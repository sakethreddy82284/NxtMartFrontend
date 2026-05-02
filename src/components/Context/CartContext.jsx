import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./User";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:2000/cart", {
        withCredentials: true,
      });
      setCart(res.data); // Fixed: res.data is the cart object
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    console.log("Adding to cart:", productId, quantity);
    try {
      const res = await axios.post("http://localhost:2000/cart/add", 
        { productId, quantity }, 
        { withCredentials: true }
      );
      console.log("Add response:", res.data);
      setCart(res.data);
      return { success: true };
    } catch (err) {
      console.error("Error adding to cart:", err);
      return { success: false, message: err.response?.data?.message || "Failed to add to cart" };
    }
  };


  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    try {
      const res = await axios.put("http://localhost:2000/cart/update", 
        { productId, quantity }, 
        { withCredentials: true }
      );
      setCart(res.data);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Place Order
  const placeOrder = async () => {
    try {
      const res = await axios.post("http://localhost:2000/orders/create", {}, { withCredentials: true });
      setCart({ items: [] }); // Clear local cart state
      return res.data; // Should contain the new order object
    } catch (err) {
      console.error("Error placing order:", err);
      throw err;
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(`http://localhost:2000/cart/remove/${productId}`, {
        withCredentials: true,
      });
      setCart(res.data); // Fixed: res.data is the cart object
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };


  // Clear cart
  const clearCart = async () => {
    try {
      const res = await axios.delete("http://localhost:2000/cart/clear", {
        withCredentials: true,
      });
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0 });
      setLoading(false);
    }
  }, [user]);

  const cartCount = cart?.items?.reduce((acc, item) => {
    if (!item.productId) return acc;
    return acc + item.quantity;
  }, 0) || 0;
  const cartTotal = cart?.totalAmount || 0;

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      placeOrder,
      cartCount, 
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;

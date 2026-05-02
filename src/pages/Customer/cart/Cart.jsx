import React, { useState } from 'react';
import { useCart } from '../../../components/Context/CartContext.jsx';
import Navbar from '../../../components/common/navbar/Navbar.jsx';
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft, ShieldCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount, placeOrder } = useCart();
  const navigate = useNavigate();
  const [isPlacing, setIsPlacing] = useState(false);

  const deliveryFee = cartCount > 0 ? 25 : 0;
  const handlingFee = cartCount > 0 ? 5 : 0;
  const finalTotal = cartTotal + deliveryFee + handlingFee;

  const handleCheckout = async () => {
    if (cartCount === 0) return;
    setIsPlacing(true);
    try {
      const data = await placeOrder();
      navigate('/order-success', { state: { order: data.order } });
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="minimal-cart-page">
        <Navbar />
        <div className="m-empty-state">
          <ShoppingBag size={60} strokeWidth={1.2} color="#D1D1D1" />
          <h2>Your cart is empty</h2>
          <p>We have lots of fresh stuff waiting for you!</p>
          <button className="m-shop-btn" onClick={() => navigate('/customer')}>
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="minimal-cart-page">
      <Navbar hideSearch={true} />
      
      <div className="m-cart-container">
        {/* Simple Header */}
        <div className="m-header">
          <button className="m-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            <span>Products</span>
          </button>
          <h1>Checkout ({cartCount} Items)</h1>
        </div>

        <div className="m-layout">
          {/* Main Items List */}
          <div className="m-items-list">
            <div className="m-delivery-hint">
              <Clock size={16} />
              <span>Arriving in <b>10-15 mins</b></span>
            </div>

            {cart.items.filter(item => item.productId).map((item) => {
              const product = item.productId;
              return (
                <div key={product._id || Math.random()} className="m-item-row">
                  <div className="m-item-img">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="m-img-placeholder" />
                    )}
                  </div>
                  <div className="m-item-main">
                    <div className="m-item-top">
                      <h3>{product.name || 'Product'}</h3>
                      <button className="m-remove" onClick={() => removeFromCart(product._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="m-item-meta">250g • ₹{item.price}</p>
                    
                    <div className="m-item-bottom">
                      <span className="m-item-total">₹{item.price * item.quantity}</span>
                      <div className="m-qty">
                        <button onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(product._id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bill Details Side Card */}
          <div className="m-sidebar">
            <div className="m-bill-card">
              <h3>Bill Details</h3>
              <div className="m-bill-row">
                <div className="m-bill-label">
                  <ShoppingBag size={14} />
                  <span>Item Total</span>
                </div>
                <span>₹{cartTotal}</span>
              </div>
              <div className="m-bill-row">
                <div className="m-bill-label">
                  <Clock size={14} />
                  <span>Delivery Fee</span>
                </div>
                <span className="m-strikethrough">₹40</span>
                <span className="m-free">₹{deliveryFee}</span>
              </div>
              <div className="m-bill-row">
                <div className="m-bill-label">
                  <span>Handling Fee</span>
                </div>
                <span>₹{handlingFee}</span>
              </div>

              <div className="m-bill-divider" />

              <div className="m-bill-row m-total-row">
                <span>To Pay</span>
                <span>₹{finalTotal}</span>
              </div>

              <div className="m-safety-badge">
                <ShieldCheck size={16} />
                <span>100% Safe and Secure Payments</span>
              </div>
            </div>

            <button 
              className="m-checkout-btn" 
              onClick={handleCheckout}
              disabled={isPlacing}
            >
              <div className="m-btn-left">
                <span>₹{finalTotal}</span>
                <span>TOTAL</span>
              </div>
              <div className="m-btn-right">
                <span>{isPlacing ? "Processing..." : "Proceed to Pay"}</span>
                <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useCart } from '../../../components/Context/CartContext.jsx';
import { useAuth } from '../../../components/Context/User.jsx';
import Navbar from '../../../components/common/navbar/Navbar.jsx';
import { 
  Trash2, Plus, Minus, ShoppingBag, ChevronLeft, 
  ShieldCheck, Clock, MapPin, Edit3, X,
  Wallet, CreditCard, Banknote, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../config.js';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount, placeOrder } = useCart();
  const { user, getUser } = useAuth();
  const navigate = useNavigate();
  
  const [isPlacing, setIsPlacing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentStep, setPaymentStep] = useState('idle'); // idle, scanning, verifying


  const deliveryFee = cartCount > 0 ? 25 : 0;
  const handlingFee = cartCount > 0 ? 5 : 0;
  const finalTotal = cartTotal + deliveryFee + handlingFee;

  const handleUpdateAddress = async (e) => {
    e?.preventDefault();
    try {
      await axios.put(`${BASE_URL}/auth/update-profile`, 
        { address: addressInput }, 
        { withCredentials: true }
      );
      await getUser();
      setIsEditingAddress(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update address.");
    }
  };


  const handleCheckout = async () => {
    if (cartCount === 0) return;
    if (!user?.address) {
      setIsEditingAddress(true);
      return;
    }

    if (paymentMethod === 'online') {
      setPaymentStep('scanning');
      setShowPaymentGateway(true);
    } else {
      await executeOrderPlacement();
    }
  };

  const handleVerifyPayment = async () => {
    setPaymentStep('verifying');
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    await executeOrderPlacement();
    setShowPaymentGateway(false);
    setPaymentStep('idle');
  };

  const executeOrderPlacement = async () => {
    setIsPlacing(true);
    try {
      const data = await placeOrder(paymentMethod);
      navigate('/order-success', { state: { order: data.order } });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  const [removingId, setRemovingId] = useState(null);

  const handleRemove = (productId) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingId(null);
    }, 400); // Match slideOutLeft duration
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="minimal-cart-page anim-reveal-up">
        <Navbar />
        <div className="m-empty-state">
          <ShoppingBag size={60} strokeWidth={1.2} color="#D1D1D1" className="anim-float" />
          <h2>Your cart is empty</h2>
          <p>We have lots of fresh stuff waiting for you!</p>
          <button className="m-shop-btn haptic-tap" onClick={() => navigate('/customer')}>
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="minimal-cart-page">
      <Navbar hideSearch={true} />
      
      <div className="m-cart-container anim-reveal-up">
        {/* Simple Header */}
        <div className="m-header">
          <button className="m-back haptic-tap" onClick={() => navigate(-1)}>
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

            {cart.items.filter(item => item.productId).map((item, index) => {
              const product = item.productId;
              const isRemoving = removingId === product._id;
              return (
                <div 
                  key={product._id || Math.random()} 
                  className={`m-item-row stagger-item ${isRemoving ? 'removing' : ''}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
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
                      <button className="m-remove haptic-tap" onClick={() => handleRemove(product._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="m-item-meta">{product.packSize || '1 unit'} • ₹{item.price}</p>
                    
                    <div className="m-item-bottom">
                      <span className="m-item-total">₹{item.price * item.quantity}</span>
                      <div className="m-qty">
                        <button className="haptic-tap" onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button className="haptic-tap" onClick={() => updateQuantity(product._id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="m-sidebar">
            

            <div className="m-address-card">
              <div className="m-card-head">
                <div className="m-head-left">
                  <MapPin size={18} className="m-icon-pin" />
                  <h3>Delivery Address</h3>
                </div>
                <button className="m-edit-btn" onClick={() => {
                  setAddressInput(user?.address || '');
                  setIsEditingAddress(true);
                }}>
                  {user?.address ? 'Change' : 'Add'}
                </button>
              </div>
              
              <div className="m-address-box">
                {user?.address ? (
                  <p className="m-address-text">{user.address}</p>
                ) : (
                  <p className="m-address-empty">Please add a delivery address to proceed.</p>
                )}
              </div>
            </div>


            <div className="m-payment-card">
              <div className="m-card-head">
                 <h3>Choose Payment Mode</h3>
              </div>
              <div className="m-pay-options">
                <div 
                  className={`m-pay-opt ${paymentMethod === 'COD' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <Banknote size={20} />
                  <div className="opt-txt">
                    <h4>Cash on Delivery</h4>
                    <span>Pay at your doorstep</span>
                  </div>
                </div>

                <div 
                  className={`m-pay-opt ${paymentMethod === 'online' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('online')}
                >
                  <CreditCard size={20} />
                  <div className="opt-txt">
                    <h4>Online Payment / UPI</h4>
                    <span>Scan QR to Pay</span>
                  </div>
                </div>
              </div>
            </div>

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
              className={`m-checkout-btn ${!user?.address ? 'disabled' : 'anim-pulse-glow haptic-tap'}`}
              onClick={handleCheckout}
              disabled={isPlacing || showPaymentGateway}
            >
              <div className="m-btn-left">
                <span>₹{finalTotal}</span>
                <span>TOTAL</span>
              </div>
              <div className="m-btn-right">
                <span>{isPlacing || showPaymentGateway ? "Processing..." : "Proceed to Pay"}</span>
                <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </button>
          </div>
        </div>
      </div>


      {showPaymentGateway && (
        <div className="gateway-overlay">
          <div className="gateway-card anim-pop-in">
            <div className="gateway-close" onClick={() => setShowPaymentGateway(false)}>
              <X size={20} />
            </div>
            <div className="bank-logo">NxtMart Pay</div>
            
            {paymentStep === 'scanning' ? (
              <div className="premium-pay-section">
                <div className="pay-header-new">
                  <div className="pay-brand">
                    <img src="/favicon.svg" alt="logo" />
                    <span>NxtMart Pay</span>
                  </div>
                  <div className="test-badge">TEST MODE</div>
                </div>

                <div className="pay-amount-section">
                   <div className="amount-info">
                      <p>Paying NxtMart Store</p>
                      <h1>₹1.00</h1>
                   </div>
                </div>

                <div className="qr-card-premium">
                  <div className="qr-frame">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=9398215724-4@ybl&pn=NxtMart (Saketh)&am=1&cu=INR&tn=Order_Payment_Test`)}`} 
                      alt="Scan to Pay" 
                    />
                    <div className="qr-inner-logo">
                       <img src="/favicon.svg" alt="logo" />
                    </div>
                  </div>
                  
                  <div className="vpa-pill">
                     <span>9398215724-4@ybl</span>
                     <button onClick={() => {
                        navigator.clipboard.writeText('9398215724-4@ybl');
                        alert("VPA Copied!");
                     }}>COPY</button>
                  </div>
                </div>

                <div className="pay-footer-actions">
                  <p className="scan-hint">Scan with any UPI App</p>
                  <button className="confirm-pay-btn haptic-tap" onClick={handleVerifyPayment}>
                    Confirm Payment
                  </button>
                </div>

                <div className="trust-footer">
                   <div className="trust-logos">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay_logo.svg/1200px-RuPay_logo.svg.png" alt="RuPay" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/1200px-UPI-Logo.png" alt="UPI" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" />
                   </div>
                </div>
              </div>
            ) : (
              <div className="gateway-loader">
                <Loader2 className="spin-icon" size={40} />
                <h3>Verifying Payment...</h3>
                <p>Checking with your bank. Do not close this window.</p>
              </div>
            )}

            <div className="gateway-footer">
              <ShieldCheck size={14} />
              <span>Secure UPI Transaction</span>
            </div>
          </div>
        </div>
      )}


      {isEditingAddress && (
        <div className="m-modal-overlay">
          <div className="m-modal-card anim-pop-in">
            <div className="m-modal-header">
              <h3>Enter Delivery Address</h3>
              <button onClick={() => setIsEditingAddress(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateAddress}>
              <div className="m-modal-body">
                <textarea 
                  placeholder="E.g. House No. 123, 4th Floor, Green Apartments, Bangalore - 560001"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  required
                />
              </div>
              <div className="m-modal-footer">
                <button type="submit" className="m-save-addr-btn haptic-tap">Save & Continue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

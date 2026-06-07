import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ShoppingBag, Timer, ShieldCheck, 
  Minus, Plus, Star, Info, ArrowRight, Package
} from 'lucide-react';
import { useCart } from '../../../components/Context/CartContext';
import Navbar from '../../../components/common/navbar/Navbar';
import { BASE_URL } from '../../../config';
import './singleProduct.css';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products/single/${id}`);
        const data = await res.json();
        setProduct(data.data || data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const cartItem = cart?.items?.find(item => 
    item.productId && (item.productId._id || item.productId) === id
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  if (loading) {
    return (
      <div className="sp-loader">
        <div className="sp-spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="sp-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/customer')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="sp-root anim-reveal-up">
      <Navbar hideSearch={true} />
      
      <div className="sp-container">
        {/* Back Button Mobile */}
        <button className="sp-back-btn haptic-tap" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>

        <div className="sp-layout">
          {/* Left: Image Gallery */}
          <div className="sp-image-section">
            <div className="sp-main-img-wrap">
              <img 
                src={product.image || "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600"} 
                alt={product.name} 
                className="sp-main-img anim-pop-in"
              />
              {product.stock === 0 && <span className="sp-oos-badge">Out of Stock</span>}
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="sp-info-section">
            <div className="sp-pull-bar" />
            <div className="sp-brand-tag">NxtMart Premium</div>
            <h1 className="sp-title">{product.name}</h1>
            <div className="sp-meta">
              <div className="sp-rating">
                <Star size={16} fill="#FFC107" color="#FFC107" />
                <span>4.8 (1.2k ratings)</span>
              </div>
              <span className="sp-divider">•</span>
              <span className="sp-pack-size">{product.packSize || "500 ml"}</span>
            </div>

            <div className="sp-price-box">
              <span className="sp-curr-price">₹{product.price}</span>
              <span className="sp-old-price">₹{Math.round(product.price * 1.2)}</span>
              <span className="sp-discount">15% OFF</span>
            </div>

            <div className="sp-delivery-card">
              <div className="sp-del-top">
                <div className="sp-del-icon">⚡</div>
                <div className="sp-del-info">
                  <p>Delivered in <b>10-15 mins</b></p>
                  <span>Fastest in your area</span>
                </div>
              </div>
            </div>

            <div className="sp-actions">
              {quantity > 0 ? (
                <div className="sp-qty-selector anim-pop-in">
                  <button className="haptic-tap" onClick={() => updateQuantity(product._id, quantity - 1)}>
                    <Minus size={20} />
                  </button>
                  <span>{quantity}</span>
                  <button className="haptic-tap" onClick={() => updateQuantity(product._id, quantity + 1)}>
                    <Plus size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  className="sp-add-btn haptic-tap anim-pulse-glow" 
                  onClick={() => addToCart(product._id, 1)}
                  disabled={product.stock === 0}
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
              )}
            </div>

            <div className="sp-features">
              <div className="sp-feat">
                <ShieldCheck size={20} color="var(--z-green)" />
                <span>100% Quality Assurance</span>
              </div>
              <div className="sp-feat">
                <Package size={20} color="var(--z-green)" />
                <span>Hygienically Packed</span>
              </div>
            </div>

            <div className="sp-details-accordion">
              <div className="sp-acc-item">
                <h3><Info size={18} /> Product Details</h3>
                <p>{product.description || "Fresh and high-quality product sourced directly from local vendors. Perfect for your daily needs."}</p>
              </div>
              {product.ingredients && (
                <div className="sp-acc-item">
                  <h3><Package size={18} /> Ingredients</h3>
                  <p>{product.ingredients}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add to Cart for Mobile */}
      <div className={`sp-mobile-bar ${quantity > 0 ? 'active' : ''}`}>
        <div className="sp-bar-content">
          <div className="sp-bar-price">
            <span>₹{product.price}</span>
            <p>Unit Price</p>
          </div>
          {quantity > 0 ? (
            <div className="sp-bar-qty">
              <button onClick={() => updateQuantity(product._id, quantity - 1)}><Minus size={18} /></button>
              <span>{quantity}</span>
              <button onClick={() => updateQuantity(product._id, quantity + 1)}><Plus size={18} /></button>
            </div>
          ) : (
            <button 
              className="sp-bar-add haptic-tap" 
              onClick={() => addToCart(product._id, 1)}
              disabled={product.stock === 0}
            >
              ADD TO CART
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;

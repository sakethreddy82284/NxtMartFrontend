import { useState, useEffect } from "react";
import "./navbar.css";
import { useCart } from "../../Context/CartContext";
import { useAuth } from "../../Context/User";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Mic } from "lucide-react";

const SearchIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
  </svg>
);

const CartIcon = () => (
  <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.85" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default function Navbar({ hideSearch = false }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [badgeAnimate, setBadgeAnimate] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setBadgeAnimate(true);
      const timer = setTimeout(() => setBadgeAnimate(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      // Auto submit
      handleSearch({ preventDefault: () => {} }, transcript);
    };
    recognition.start();
  };

  const handleSearch = (e, overideQuery) => {
    e?.preventDefault();
    const finalQuery = overideQuery || query;
    if (!finalQuery.trim()) return;

    const searchTerm = encodeURIComponent(finalQuery.trim());
    
    if (user?.role === 'manager' || user?.role === 'admin') {
      navigate(`/manager/products?q=${searchTerm}`);
    } else {
      navigate(`/customer/products/search?q=${searchTerm}`);
    }
    
    setQuery("");
  };

  return (
    <header className="nb-header">

      <div className="nb-announcement">
        <span className="nb-ann-text">
          Free delivery on orders above ₹299
        </span>
      </div>


      <div className="nb-main">
        <div className="nb-container">

          <Link 
            to={user?.role === 'manager' ? "/manager/home" : user?.role === 'delivery' ? "/delivery" : "/customer"} 
            className="nb-brand" 
            aria-label="NxtMart home"
          >
            <div className="nb-brand-info">
              <span className="nb-brand-name">NxtMart Tech</span>
              <span className="nb-brand-sub">tech • express</span>
            </div>
          </Link>


          {!hideSearch && (
            <div className="nb-search-row">
              <form className={`nb-search-bar${focused ? " nb-search-active" : ""}`} onSubmit={handleSearch}>
                <span className="nb-search-icon-wrap"><SearchIcon /></span>
                <input
                  type="text"
                  className="nb-search-input"
                  placeholder={
                    user?.role === 'manager' ? "Search for products, orders..." : 
                    user?.role === 'delivery' ? "Search for pickup, orders..." : 
                    "Search for laptops, phones, accessories..."
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
                <button type="button" className={`nb-mic-btn ${isListening ? 'listening' : ''}`} onClick={startVoiceSearch}>
                  <Mic size={18} />
                </button>
                <button type="submit" className="nb-search-btn">Search</button>
              </form>
            </div>
          )}


          <div className="nb-actions">
            {user?.role !== 'manager' && user?.role !== 'delivery' && (
              <Link to="/cart" className="nb-cart-btn" aria-label="View Cart">
                <span className={`nb-cart-badge ${badgeAnimate ? 'anim-badge-bounce' : ''}`}>{cartCount}</span>
                <CartIcon />
              </Link>
            )}
            
            <Link 
              to={user?.role === 'manager' ? "/manager/profile" : user?.role === 'delivery' ? "/delivery/profile" : "/profile"} 
              className="nb-user-profile-link" 
              aria-label="View Profile"
            >
              <div className="nb-user-circle">
                {user?.name?.[0]?.toUpperCase() || "S"}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
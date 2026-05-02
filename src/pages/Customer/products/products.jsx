import { useState, useEffect, useMemo } from "react";
import { 
  Search, ShoppingBag, LayoutGrid, Timer, Minus, Plus
} from "lucide-react";
import "./product.css";
import Navbar from "../../../components/common/navbar/Navbar";
import StickyBottomNav from "../../../components/common/StickyBottomNav/StickyBottomNav";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../../components/Context/CartContext";

const API_URL = "http://localhost:2000";

/* ══════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════ */
const StockBadge = ({ stock }) => {
  if (stock === 0) return <span className="p-badge-v4 oos">Out of Stock</span>;
  return null;
};

/* ══════════════════════════════════════════
   PRODUCT CARD COMPONENT
   ══════════════════════════════════════════ */
const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const oos = product.stock === 0;
  const packSize = product.packSize || "500 ml";
  const deliveryTime = "16 MINS";

  const cartItem = cart?.items?.find(item => 
    item.productId && (item.productId._id || item.productId) === product._id
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className={`p-card-v4 ${oos ? 'oos-fade' : ''}`}>
      <div className="p-img-box-v4">
        {product.image ? (
          <img src={product.image} alt={product.name} className="p-img" loading="lazy" />
        ) : (
          <div className="p-no-img"><ShoppingBag size={32} /></div>
        )}
        <StockBadge stock={product.stock} />
      </div>

      <div className="p-info-v4">
        <div className="p-delivery-badge">
          <Timer size={12} />
          <span>{deliveryTime}</span>
        </div>

        <h3 className="p-name-v4">{product.name}</h3>
        <p className="p-pack-v4">{packSize}</p>
        
        <div className="p-footer-v4">
          <div className="p-price-v4">₹{product.price}</div>
          
          <div className="p-action-v4">
            {quantity > 0 ? (
              <div className="p-qty-pill-v4">
                <button onClick={() => updateQuantity(product._id, quantity - 1)} className="p-qty-btn">
                  <Minus size={12} strokeWidth={3} />
                </button>
                <span className="p-qty-num">{quantity}</span>
                <button onClick={() => updateQuantity(product._id, quantity + 1)} className="p-qty-btn">
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button 
                className="p-add-btn-v4" 
                onClick={() => addToCart(product._id, 1)}
                disabled={oos}
              >
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════ */
export default function ProductGrid() {
  const { category: currentCatId } = useParams();
  const navigate = useNavigate();
  const { search: searchParams } = useLocation();
  const queryParam = new URLSearchParams(searchParams).get('q');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const isSearchMode = currentCatId === 'search';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/products/category/${currentCatId}`;
        if (isSearchMode) {
          url = `${API_URL}/products?search=${encodeURIComponent(queryParam || "")}&limit=50`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || data.data || data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCatId, queryParam, isSearchMode]);

  const displayedProducts = useMemo(() => {
    let filtered = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, search, sort]);

  const categoryName = useMemo(() => {
    if (isSearchMode) return `Search: "${queryParam || ''}"`;
    const found = categories.find(c => c._id === currentCatId);
    return found ? found.name : "Products";
  }, [categories, currentCatId, isSearchMode, queryParam]);

  return (
    <div className="pg-root-v2">
      <Navbar />
      
      <div className="pg-full-layout">
        <div className="pg-content">
          <header className="pg-header-v2">
            <div className="pg-controls">
              <div className="pg-title-box">
                <h1 className="pg-category-title">{categoryName}</h1>
                <p className="pg-results-count">{displayedProducts.length} items found</p>
              </div>
              
              <div className="pg-actions-right">
                <div className="pg-search-inline">
                  <Search size={18} strokeWidth={2.5} />
                  <input 
                    type="text" 
                    placeholder="Search in category..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select className="pg-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="default">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="pg-categories-nav">
              {categories.map(cat => (
                <div 
                  key={cat._id} 
                  className={`cat-pill ${currentCatId === cat._id ? 'active' : ''}`}
                  onClick={() => navigate(`/customer/products/${cat._id}`)}
                >
                  <div className="cat-pill-icon">
                    <img src={cat.icon} alt="" />
                  </div>
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </header>

          <main className="pg-main-v2">
            {loading ? (
              <div className="skeleton-grid">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => <div key={i} className="skeleton-p-card" />)}
              </div>
            ) : displayedProducts.length > 0 ? (
              <div className="p-modern-grid">
                {displayedProducts.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="empty-products">
                <div className="empty-art">🔎</div>
                <h3>No items found</h3>
                <p>Try exploring other categories or searching for something else.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <div className="pg-mobile-nav">
        <StickyBottomNav />
      </div>
    </div>
  );
}
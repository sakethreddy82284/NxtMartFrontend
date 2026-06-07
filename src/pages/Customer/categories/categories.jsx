import { useState, useEffect, useCallback, useRef } from "react";
import './Categories.css'
import { useNavigate } from "react-router-dom";
import { Gift, Bell, Search } from "lucide-react";
import StickyBottomNav from "../../../components/common/StickyBottomNav/StickyBottomNav";
import { BASE_URL } from "../../../config.js";


const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap";
document.head.appendChild(FONT_LINK);


const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Crect x='60' y='72' width='80' height='8' rx='4' fill='%23d1d5db'/%3E%3Crect x='72' y='88' width='56' height='8' rx='4' fill='%23d1d5db'/%3E%3Crect x='84' y='104' width='32' height='8' rx='4' fill='%23d1d5db'/%3E%3C/svg%3E`;

const ACCENTS = [
  "#f97316","#3b82f6","#22c55e","#a855f7",
  "#f43f5e","#14b8a6","#eab308","#64748b",
  "#ef4444","#38a169",
];

function toTitleCase(str) {
  return str
    ? str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
    : "";
}







function CategoryCard({ category, index, onClick, listView, isNew }) {
  const [imgSrc, setImgSrc] = useState(category.icon || PLACEHOLDER_SVG);
  const accent = ACCENTS[index % ACCENTS.length];
  const name = toTitleCase(category.name);
  const delay = Math.min(index * 40, 400);
const navigate = useNavigate();

const handleClick = (id) => {
  navigate(`/customer/products/${id}`);
};
  return (
    <div
      className="cat-card"
      style={{ "--card-accent": accent, animationDelay: `${delay}ms` }}
      onClick={() => handleClick(category._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(category)}
      aria-label={`Browse ${name}`}
    >
      <img
        src={imgSrc}
        alt={name}
        className="cat-card__img"
        onError={() => setImgSrc(PLACEHOLDER_SVG)}
        loading="lazy"
        draggable={false}
      />

      {/* Hover overlay with CTA */}
      {!listView && (
        <div className="cat-card__overlay">
        <button className="cat-card__cta"
           onClick={(e) => {
                 e.stopPropagation(); // prevent parent click
                navigate(`/customer/products/${category._id}`);
          }}>
            Browse
         </button>
        </div>
      )}

      {/* Bottom name bar */}
      <div className="cat-card__bar">
        <span className="cat-card__name">{name.length > 14 ? name.substring(0, 14) + "…" : name}</span>
      </div>

      {/* Accent dot */}
      <div className="cat-card__dot" />

      {/* "New" badge for first 3 */}
      {isNew && <span className="cat-card__new">New</span>}

      {/* List view chevron */}
      <span className="cat-card__chevron">›</span>
    </div>
  );
}


function SkeletonCard() {
  return (
    <div className="cat-card cat-card--skeleton">
      <div className="skel-img" />
      <div className="cat-card__bar">
        <div className="skel-text" />
      </div>
    </div>
  );
}


export default function Categories({ isHomeView = false }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      const data = await res.json();
      setCategories(data.data);
    } catch (err) {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const filtered = categories.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayList = isHomeView ? filtered.slice(0, 8) : filtered;

  if (loading && isHomeView) return <div className="loading-dots"></div>;

  return (
    <section className={`cats-root ${isHomeView ? 'home-view' : 'full-view'}`}>
      {!isHomeView && (
        <>
          <div className="cats-full-header">
            <button className="back-btn" onClick={() => navigate(-1)}>←</button>
            <h2>Categories</h2>
            <div className="header-icons">
              <Gift size={20} />
              <Bell size={20} />
            </div>
          </div>
          <div className="cats-search-wrap">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search fresh products or brands" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="cats-grid">
        {displayList.map((cat, i) => (
          <div 
            key={cat._id} 
            className="cat-card-modern"
            onClick={() => navigate(`/customer/products/${cat._id?.toString()}`)}
          >
            <div className="cat-img-container">
              <img src={cat.icon || PLACEHOLDER_SVG} alt={cat.name} />
            </div>
            <span className="cat-name">{cat.name}</span>
          </div>
        ))}
      </div>
      
      {!isHomeView && <StickyBottomNav />}
    </section>
  );
}
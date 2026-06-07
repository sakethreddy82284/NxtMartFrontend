import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, X, Search,
  Package, ImageOff, AlertTriangle,
  Tag, IndianRupee, Archive, Layers,
  TrendingUp, ShoppingBag, AlertCircle, BarChart2
} from 'lucide-react';
import './Product.css';
import axios from 'axios';
import Navbar from '../../../components/common/navbar/Navbar';


const BASE = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'https://nxtmartbackend-2-q25g.onrender.com' : 'http://localhost:2000';

const toastOpts = {
  success: { className: 'toast-success', iconTheme: { primary: '#059669', secondary: '#fff' } },
  error:   { className: 'toast-error',   iconTheme: { primary: '#dc2626', secondary: '#fff' } },
};

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n ?? 0);

// ─────────────────────────────────────────────
// 1. Skeleton
// ─────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="prod-skeleton">
    <div className="skel-img shimmer" />
    <div className="skel-body">
      <div className="skel-line shimmer w70" />
      <div className="skel-line shimmer w45 sm" />
      <div className="skel-line shimmer w30 sm" />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 2. Stock Badge
// ─────────────────────────────────────────────
const StockBadge = ({ stock }) => {
  const s = stock ?? 0;
  if (s === 0)  return <span className="badge badge-out"><span className="badge-dot" />Out of stock</span>;
  if (s <= 10)  return <span className="badge badge-low"><span className="badge-dot" />{s} left</span>;
  return             <span className="badge badge-in"><span className="badge-dot" />{s} in stock</span>;
};

// ─────────────────────────────────────────────
// 3. Product Card
// ─────────────────────────────────────────────
const ProductCard = ({ product, onEdit, onDelete }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const catName = typeof product.category === 'object'
    ? product.category?.name : product.category;

  return (
    <div className="prod-card">
      {/* ── image zone ── */}
      <div className="prod-img-zone">
        {product.image && !imgFailed ? (
          <img
            src={product.image}
            alt={product.name}
            className="prod-img"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="prod-no-img">
            <ImageOff size={22} strokeWidth={1.3} />
            <span>No image</span>
          </div>
        )}

        {/* price pill pinned top-left */}
        <div className="prod-price-pill">{fmt(product.price)}</div>

        {/* hover action overlay */}
        <div className="prod-overlay">
          <button
            className="ov-btn ov-edit"
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
          >
            <Edit2 size={13} /> Edit
          </button>
          <button
            className="ov-btn ov-del"
            onClick={(e) => { e.stopPropagation(); onDelete(product); }}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* ── info zone ── */}
      <div className="prod-info">
        <p className="prod-name">{product.name}</p>

        <div className="prod-meta-row">
          {catName && (
            <span className="prod-cat">
              <Tag size={10} strokeWidth={2} />
              {catName}
            </span>
          )}
          <StockBadge stock={product.stock} />
        </div>

        {product.description && (
          <p className="prod-desc">{product.description}</p>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 4. Stats Bar
// ─────────────────────────────────────────────
const StatsBar = ({ products }) => {
  const total   = products.length;
  const oos     = products.filter(p => (p.stock ?? 0) === 0).length;
  const low     = products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10).length;
  const avg     = total ? products.reduce((s, p) => s + (p.price ?? 0), 0) / total : 0;

  const tiles = [
    { icon: <ShoppingBag size={16} />, value: total,        label: 'Total',       color: 'blue'   },
    { icon: <AlertCircle size={16} />, value: oos,          label: 'Out of stock',color: 'red'    },
    { icon: <Archive     size={16} />, value: low,          label: 'Low stock',   color: 'amber'  },
    { icon: <TrendingUp  size={16} />, value: fmt(Math.round(avg)), label: 'Avg price', color: 'green' },
  ];

  return (
    <div className="stats-bar">
      {tiles.map((t, i) => (
        <div key={i} className={`stat-tile stat-${t.color}`}>
          <div className="stat-icon-wrap">{t.icon}</div>
          <div>
            <div className="stat-val">{t.value}</div>
            <div className="stat-lbl">{t.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// 5. Category Filter Pills
// ─────────────────────────────────────────────
const CategoryPills = ({ categories, active, onChange }) => (
  <div className="cat-pills">
    <button
      className={`cat-pill ${active === '' ? 'active' : ''}`}
      onClick={() => onChange('')}
    >
      All
    </button>
    {categories.map(c => (
      <button
        key={c._id}
        className={`cat-pill ${active === c._id ? 'active' : ''}`}
        onClick={() => onChange(c._id)}
      >
        {c.icon && <img src={c.icon} alt="" className="pill-icon" onError={e => e.target.style.display='none'} />}
        {c.name}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// 6. Product Modal (Add / Edit)
// ─────────────────────────────────────────────
const ProductModal = ({ isOpen, onClose, onSave, product, categories }) => {
  const [form, setForm]     = useState({ name:'', price:'', category:'', stock:'', image:'', description:'' });
  const [imgErr, setImgErr] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name:        product?.name        ?? '',
        price:       product?.price       ?? '',
        category:    typeof product?.category === 'object'
                       ? product?.category?._id ?? ''
                       : product?.category      ?? '',
        stock:       product?.stock       ?? '',
        image:       product?.image       ?? '',
        description: product?.description ?? '',
      });
      setImgErr(false);
      setSaving(false);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.category) return;
    setSaving(true);
    await onSave(
      {
        name:        form.name.trim(),
        price:       Number(form.price),
        category:    form.category,
        stock:       Number(form.stock) || 0,
        image:       form.image.trim(),
        description: form.description.trim(),
      },
      product?._id
    );
    setSaving(false);
  };

  const isEditing = Boolean(product);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>

        {/* header */}
        <div className="modal-head">
          <div className="modal-head-icon">
            {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
          </div>
          <div>
            <h2 className="modal-title">{isEditing ? 'Edit product' : 'Add new product'}</h2>
            <p className="modal-sub">{isEditing ? 'Update the details below' : 'Fill in all required fields'}</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">

            {/* Name */}
            <div className="fg span2">
              <label className="fl">Product name <span className="req">*</span></label>
              <input type="text" className="fi" value={form.name} onChange={set('name')}
                placeholder="e.g. Fresh Alphonso Mangoes" maxLength={100} required autoFocus />
            </div>

            {/* Price */}
            <div className="fg">
              <label className="fl">Price <span className="req">*</span></label>
              <div className="fi-wrap">
                <span className="fi-pre">₹</span>
                <input type="number" className="fi with-pre" value={form.price} onChange={set('price')}
                  placeholder="0" min="0" step="0.01" required />
              </div>
            </div>

            {/* Stock */}
            <div className="fg">
              <label className="fl">Stock qty</label>
              <div className="fi-wrap">
                <Archive size={13} className="fi-icon" />
                <input type="number" className="fi with-pre" value={form.stock} onChange={set('stock')}
                  placeholder="0" min="0" />
              </div>
            </div>

            {/* Category */}
            <div className="fg span2">
              <label className="fl">Category <span className="req">*</span></label>
              <div className="fi-wrap">
                <Layers size={13} className="fi-icon" />
                <select className="fi with-pre" value={form.category} onChange={set('category')} required>
                  <option value="">Select a category…</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image */}
            <div className="fg span2">
              <label className="fl">Image URL <span className="opt">(optional)</span></label>
              <input type="url" className="fi" value={form.image}
                onChange={e => { set('image')(e); setImgErr(false); }}
                placeholder="https://example.com/image.jpg" />
              {form.image && (
                <div className="img-thumb">
                  {imgErr
                    ? <span className="img-err">Could not load preview</span>
                    : <img src={form.image} alt="preview" onError={() => setImgErr(true)} />}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="fg span2">
              <label className="fl">Ingredients<span className="opt">(optional)</span></label>
              <textarea className="fi ta" value={form.description} onChange={set('description')}
                placeholder="Short product description…" rows={3} maxLength={300} />
              <div className="fhint">{form.description.length}/300</div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-cta" disabled={saving}>
              {saving
                ? <span className="btn-spinner" />
                : isEditing ? <><Edit2 size={13} />Update product</> : <><Plus size={13} />Add product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 7. Confirm Delete
// ─────────────────────────────────────────────
const ConfirmDelete = ({ product, onConfirm, onCancel }) => {
  if (!product) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">
          <AlertTriangle size={24} strokeWidth={1.8} />
        </div>
        <h3>Delete "{product.name}"?</h3>
        <p>This will permanently remove the product and cannot be undone.</p>
        <div className="confirm-btns">
          <button className="btn-ghost" onClick={onCancel}>Keep it</button>
          <button className="btn-danger" onClick={onConfirm}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 8. Main Page
// ─────────────────────────────────────────────
const ProductsPage = () => {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [toDelete,    setToDelete]    = useState(null);
  const { search: urlSearch } = React.useMemo(() => new URLSearchParams(window.location.search), []);
  const [search, setSearch] = useState(new URLSearchParams(window.location.search).get('q') || '');
  const [catFilter,   setCatFilter]   = useState('');   // category _id or ''

  // ── fetch all products ──
  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/products/`);
      setProducts(res.data.data ?? res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch products', toastOpts.error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── fetch products filtered by category ──
  const fetchByCategory = useCallback(async (categoryId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/products/category/${categoryId}`);
      setProducts(res.data.data ?? res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch products', toastOpts.error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── fetch categories ──
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/categories/`);
      setCategories(res.data.data ?? res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ── initial load ──
  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, [fetchAllProducts, fetchCategories]);

  // ── when category filter changes use the dedicated route ──
  useEffect(() => {
    if (catFilter) {
      fetchByCategory(catFilter);
    } else {
      fetchAllProducts();
    }
  }, [catFilter, fetchByCategory, fetchAllProducts]);

  // ── client-side search on top of server results ──
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── handlers ──
  const handleAdd  = () => { setSelected(null); setIsModalOpen(true); };
  const handleEdit = (p) => { setSelected(p);   setIsModalOpen(true); };

  const handleSave = async (data, id) => {
    try {
      if (id) {
        await axios.put(`${BASE}/products/${id}`, data, {
          withCredentials: true
        });
        toast.success('Product updated ✓', toastOpts.success);
      } else {
       await axios.post(`${BASE}/products/`, data, {
              withCredentials: true
       });
        toast.success('Product added ✓', toastOpts.success);
      }
      // refresh: re-use current filter
      catFilter ? fetchByCategory(catFilter) : fetchAllProducts();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Save failed — ' + (err.response?.data?.message ?? err.message), toastOpts.error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${BASE}/products/${toDelete._id}`, {
          withCredentials: true
       });
      toast.success(`"${toDelete.name}" deleted`, toastOpts.success);
      catFilter ? fetchByCategory(catFilter) : fetchAllProducts();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed', toastOpts.error);
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
    
    
    <div className="pp-root">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* ── header ── */}
      <header className="pp-header">
        <div>
          <h1 className="pp-title">Products</h1>
          <p className="pp-sub">Manage your store catalogue</p>
        </div>
        <button className="btn-cta" onClick={handleAdd}>
          <Plus size={15} /> Add product
        </button>
      </header>

      {/* ── stats ── */}
      {!loading && products.length > 0 && <StatsBar products={products} />}

      {/* ── search + category pills ── */}
      <div className="pp-toolbar">
        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={12} />
            </button>
          )}
        </div>

        <div className="result-count">
          <BarChart2 size={13} />
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── category pills ── */}
      <CategoryPills
        categories={categories}
        active={catFilter}
        onChange={setCatFilter}
      />

      {/* ── grid ── */}
      {loading ? (
        <div className="pp-grid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="pp-empty">
          <div className="empty-icon-wrap"><Package size={30} strokeWidth={1.2} /></div>
          <h3>{search || catFilter ? 'No results found' : 'No products yet'}</h3>
          <p>{search || catFilter ? 'Try adjusting your search or filter' : 'Click "Add product" to get started'}</p>
          {!search && !catFilter && (
            <button className="btn-cta sm" onClick={handleAdd}><Plus size={13} /> Add product</button>
          )}
        </div>
      ) : (
        <div className="pp-grid">
          {filtered.map(p => (
            <ProductCard key={p._id} product={p} onEdit={handleEdit} onDelete={setToDelete} />
          ))}
          {/* add-more tile */}
          <div className="prod-add-tile" onClick={handleAdd} role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}>
            <div className="add-ring"><Plus size={20} /></div>
            <span>Add product</span>
          </div>
        </div>
      )}

      {/* ── modals ── */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={selected}
        categories={categories}
      />

      <ConfirmDelete
        product={toDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setToDelete(null)}
      />
    </div>
    </>
  );
};

export default ProductsPage;
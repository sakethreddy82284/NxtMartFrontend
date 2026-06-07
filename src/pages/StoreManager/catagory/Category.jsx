import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, X, Search,
  LayoutGrid, ImageOff, AlertTriangle
} from 'lucide-react';
import './category.css';
import axios from 'axios';

// ─────────────────────────────────────────────
// Helpers
const BASE_URL = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'https://nxtmartbackend-2-q25g.onrender.com' : 'http://localhost:2000';
// ─────────────────────────────────────────────
const toastOpts = {
  success: { className: 'toast-success', iconTheme: { primary: '#166534', secondary: '#fff' } },
  error:   { className: 'toast-error',   iconTheme: { primary: '#991b1b', secondary: '#fff' } },
};

// ─────────────────────────────────────────────
// 1. Skeleton loader card
// ─────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton skeleton-foot" />
  </div>
);

// ─────────────────────────────────────────────
// 2. Category Card (grid view) — hover reveals overlay with name + actions
// ─────────────────────────────────────────────
const CategoryCard = ({ category, onEdit, onDelete }) => (
  <div className="category-card">
    {/* Image fills entire card */}
    <div className="category-image-wrapper">
      {category.icon ? (
        <img
          src={category.icon}
          alt={category.name}
          className="category-image"
          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div className="category-no-image" style={{ display: category.icon ? 'none' : 'flex' }}>
        <div className="no-image-icon"><ImageOff size={18} strokeWidth={1.4} /></div>
        <span>No image</span>
      </div>
    </div>

    {/* Hover overlay — slides up from bottom */}
    <div className="category-hover-overlay">
      <span className="overlay-name">{category.name}</span>
      <div className="overlay-actions">
        <button
          className="overlay-btn edit"
          title="Edit"
          onClick={(e) => { e.stopPropagation(); onEdit(category); }}
        >
          <Edit2 size={13} />
          <span>Edit</span>
        </button>
        <button
          className="overlay-btn delete"
          title="Delete"
          onClick={(e) => { e.stopPropagation(); onDelete(category); }}
        >
          <Trash2 size={13} />
          <span>Delete</span>
        </button>
      </div>
    </div>

    {/* Always-visible footer with name */}
    <div className="category-info">
      <span className="category-name">{category.name}</span>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 3. Add / Edit Modal
// ─────────────────────────────────────────────
const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
  const [name,  setName]  = useState('');
  const [image, setImage] = useState('');
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(category?.name  ?? '');
      setImage(category?.icon ?? '');
      setImgErr(false);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) return;
    onSave({ name: name.trim(), image: image.trim() }, category?._id);
  };

  const isEditing = Boolean(category);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-text">
            <h2>{isEditing ? 'Edit category' : 'New category'}</h2>
            <p>{isEditing ? 'Update the details below' : 'Fill in the details to create a category'}</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name <span className="label-required">*</span></label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Fruits"
              maxLength={50}
              required
              autoFocus
            />
            <div className="input-hint">2–50 characters, must be unique</div>
          </div>

          <div className="form-group">
            <label>
              Image URL{' '}
              <span className="label-optional">(optional)</span>
            </label>
            <input
              type="url"
              className="input-field"
              value={image}
              onChange={(e) => { setImage(e.target.value); setImgErr(false); }}
              placeholder="https://example.com/image.jpg"
            />
            {image && (
              <div className="img-preview">
                {imgErr ? (
                  <span className="img-preview-error">Could not load preview</span>
                ) : (
                  <img src={image} alt="Preview" onError={() => setImgErr(true)} />
                )}
              </div>
            )}
            <div className="input-hint">Paste any publicly accessible image URL</div>
          </div>

          <div className="modal-divider" />

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              {isEditing ? <><Edit2 size={13} /> Update</> : <><Plus size={13} /> Add category</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 4. Confirm Delete Dialog
// ─────────────────────────────────────────────
const ConfirmDelete = ({ category, onConfirm, onCancel }) => {
  if (!category) return null;
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrap">
          <AlertTriangle size={22} strokeWidth={1.8} />
        </div>
        <h3>Delete category?</h3>
        <p>
          <strong>"{category.name}"</strong> will be permanently removed.
          This action cannot be undone.
        </p>
        <div className="confirm-actions">
          <button className="btn-secondary" onClick={onCancel}>Keep it</button>
          <button className="btn-danger" onClick={onConfirm}>
            <Trash2 size={13} /> Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 5. Main Page
// ─────────────────────────────────────────────
const CategoriesPage = () => {
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [toDelete,    setToDelete]    = useState(null);
  const [search,      setSearch]      = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/categories/`);
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch categories', toastOpts.error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd  = ()  => { setSelected(null); setIsModalOpen(true); };
  const handleEdit = (c) => { setSelected(c);    setIsModalOpen(true); };

  const handleSave = async (data, id) => {
  try {
    if (id) {
      await axios.put(
        `${BASE_URL}/categories/${id}`,
        {
          name: data.name,
          icon: data.image,
        },
        {
          withCredentials: true, // ✅ correct place
        }
      );

      toast.success('Category updated', toastOpts.success);

    } else {
      await axios.post(
        `${BASE_URL}/categories`,
        {
          name: data.name,
          icon: data.image,
        },
        {
          withCredentials: true, // ✅ add here also
        }
      );

      toast.success('Category added', toastOpts.success);
    }

    fetchCategories();
    setIsModalOpen(false);

  } catch (error) {
    console.error(error);
    toast.error('Save failed', toastOpts.error);
  }
};

  const handleDeleteRequest = (c) => setToDelete(c);

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${BASE_URL}/categories/${toDelete._id}`,
      {
        withCredentials: true
      }
      );
      toast.success(`"${toDelete.name}" removed`, toastOpts.success);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error('Delete failed', toastOpts.error);
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="categories-page">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="categories-header">
        <div className="categories-header-left">
          <h1>Categories</h1>
          <p>Manage your store's product categories</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={14} /> Add category
        </button>
      </div>

      {/* Search + stats */}
      <div className="categories-search-wrap">
        <div className="search-input-wrap">
          <Search size={14} />
          <input
            type="text"
            className="search-input"
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={12} />
            </button>
          )}
        </div>

        <div className="stats-row">
          <div className="stat-chip">
            <span className="stat-chip-dot green" />
            {categories.length} total
          </div>
          {search && (
            <div className="stat-chip">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Grid content */}
      {loading ? (
        <div className="categories-grid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="categories-grid">
          <div className="empty-state">
            <div className="empty-state-icon"><LayoutGrid size={20} strokeWidth={1.4} /></div>
            <h3>{search ? 'No results found' : 'No categories yet'}</h3>
            <p>{search ? `Nothing matched "${search}"` : 'Click "Add category" to create your first one'}</p>
          </div>
        </div>
      ) : (
        <div className="categories-grid">
          {filtered.map(c => (
            <CategoryCard
              key={c._id}
              category={c}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
          <div className="category-card-add" onClick={handleAdd} role="button" tabIndex={0}>
            <div className="add-circle"><Plus size={16} /></div>
            Add category
          </div>
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={selected}
      />

      <ConfirmDelete
        category={toDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default CategoriesPage;
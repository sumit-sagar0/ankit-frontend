import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../constants/categoryMeta';

export default function EditPaintingModal({ painting, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title:              painting.title || '',
    artist:             painting.artist || '',
    price:              painting.price || '',
    isPor:              (!painting.price || painting.price <= 0),
    category:           painting.category || '',
    availabilityStatus: painting.availabilityStatus || 'AVAILABLE',
    description:        painting.description || '',
    youtubeUrl:         painting.youtubeUrl || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...painting, // Keep existing image URL, likes, etc.
        title: form.title.trim(),
        artist: form.artist.trim() || 'Ankit Kumar',
        price: form.isPor ? 0 : parseFloat(form.price) || 0,
        category: form.category.toUpperCase().trim(),
        availabilityStatus: form.availabilityStatus,
        description: form.description.trim(),
        youtubeUrl: form.youtubeUrl.trim(),
      };

      const res = await axios.put(`${API_BASE}/${painting.id}`, payload);
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update painting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--white)', padding: 30, borderRadius: 24, width: '100%', maxWidth: 500,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative',
          maxHeight: '90vh', overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--slate-400)' }}
        >
          ×
        </button>

        <h3 style={{ fontSize: '1.4rem', color: 'var(--slate-800)', marginBottom: 20 }}>Edit Artwork</h3>
        
        {error && <div style={{ color: '#be123c', background: '#ffe4e6', padding: 10, borderRadius: 8, marginBottom: 20, fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="studio-label" style={{ marginTop: 0 }}>Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="studio-input" required />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="studio-label" style={{ marginTop: 0 }}>Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="studio-input" disabled={form.isPor} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', marginTop: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isPor} onChange={(e) => setForm(p => ({ ...p, isPor: e.target.checked, price: '' }))} />
                Price on Request
              </label>
            </div>
            <div style={{ flex: 1 }}>
              <label className="studio-label" style={{ marginTop: 0 }}>Status</label>
              <select name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange} className="studio-input">
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold Out</option>
              </select>
            </div>
          </div>

          <div>
            <label className="studio-label" style={{ marginTop: 0 }}>Category</label>
            <input type="text" name="category" value={form.category} onChange={handleChange} className="studio-input" placeholder="e.g. ANIME, MANDALA" required />
          </div>

          <div>
            <label className="studio-label" style={{ marginTop: 0 }}>YouTube Link</label>
            <input type="text" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} className="studio-input" placeholder="e.g. https://youtu.be/..." />
          </div>

          <div>
            <label className="studio-label" style={{ marginTop: 0 }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="studio-input" rows={3} />
          </div>

          <button type="submit" className="upload-btn" disabled={loading} style={{ marginTop: 10 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

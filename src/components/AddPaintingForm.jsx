import React, { useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { API_BASE } from '../constants/categoryMeta';
import { API_URL } from '../config/env';

/* ═══════════════════════════════════════════════════════════════════════════
   AddPaintingForm — Creator Portal upload form
   Supports direct image file upload → backend saves → imageUrl stored in DB
   Props:
     onSuccess  {(message: string) => void}  — called after a successful POST
   ═══════════════════════════════════════════════════════════════════════════ */

const UPLOAD_URL   = `${API_URL}/api/upload/image`;

const INITIAL_FORM = {
  title:              '',
  artist:             '',
  price:              '',
  isPor:              false,
  category:           '',
  availabilityStatus: 'AVAILABLE',
  description:        '',
  youtubeUrl:         '',
  imageUrl:           '',
};

export default function AddPaintingForm({ onSuccess }) {
  const [form,          setForm]         = useState(INITIAL_FORM);
  const [loading,       setLoading]      = useState(false);
  const [imgUploading,  setImgUploading] = useState(false);
  const [error,         setError]        = useState('');
  const [previewSrc,    setPreviewSrc]   = useState(null);  // local blob preview
  const [imgFileName,   setImgFileName]  = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  /* ── Image selected → upload to backend immediately ── */
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    setPreviewSrc(URL.createObjectURL(file));
    setImgFileName(file.name);
    setImgUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = res.data.imageUrl;
      setForm((prev) => ({ ...prev, imageUrl }));
    } catch (err) {
      setError('Image upload failed. Is the backend server running?');
      setPreviewSrc(null);
      setImgFileName('');
    } finally {
      setImgUploading(false);
    }
  };

    const handleCheckboxChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    if (error) setError('');
  };

  const removeImage = () => {
    setPreviewSrc(null);
    setImgFileName('');
    setForm((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.artist.trim() || (!form.isPor && !form.price)) {
      setError('Title, Artist, and Price are required (unless Price on Request is selected).');
      return;
    }
    if (imgUploading) {
      setError('Uploading image - please wait a moment!');
      return;
    }

    setLoading(true);
    try {
      await axios.post(API_BASE, {
        title:              form.title,
        artist:             form.artist,
        price:              form.isPor ? 0 : parseFloat(form.price),
        category:           form.category,
        availabilityStatus: form.availabilityStatus,
        description:        form.description,
        youtubeUrl:         form.youtubeUrl || null,
        imageUrl:           form.imageUrl || null,
      });

      setForm(INITIAL_FORM);
      setPreviewSrc(null);
      setImgFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onSuccess('Masterpiece Uploaded to Studio Gallery! 🎨');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to connect to backend. Is the server running?'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background:    'var(--white)',
        border:        '1px solid var(--slate-100)',
        borderRadius:  'var(--radius-xl)',
        boxShadow:     'var(--shadow-lg)',
        padding:       '36px 32px 40px',
        position:      'relative',
        overflow:      'hidden',
        animation:     'fadeSlideUp 0.7s ease 0.15s both',
      }}
    >
      {/* ── Top accent stripe ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 4, background: 'var(--gradient-blue)',
        borderRadius: '24px 24px 0 0',
      }} />

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '4px 12px', borderRadius: 999, marginBottom: 14,
          background: 'rgba(37,99,235,0.07)',
          border: '1.5px solid rgba(37,99,235,0.18)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--blue-600)', display: 'inline-block',
            animation: 'activeDot 2s ease-in-out infinite',
          }} />
          <span className="font-mono" style={{
            fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.12em', color: 'var(--blue-600)',
            textTransform: 'uppercase',
          }}>Admin Panel</span>
        </div>

        <h2 className="font-sora" style={{
          fontSize: '1.3rem', fontWeight: 800,
          color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: 6,
        }}>
          🎨 New Painting Upload
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
          Fill in the details below to add a new artwork to your live studio gallery.
        </p>
      </div>

      {/* ── Error alert ── */}
      {error && (
        <div style={{
          padding: '11px 15px', borderRadius: 8, marginBottom: 16,
          background: 'rgba(244,63,94,0.07)',
          border: '1.5px solid rgba(244,63,94,0.3)',
          color: '#be123c', fontSize: '0.8rem', lineHeight: 1.5,
        }}>
          ✕ {error}
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} autoComplete="off">

        {/* ════ IMAGE UPLOAD ZONE ════ */}
        <label className="studio-label">Painting Photo *</label>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="aa-image-file"
        />

        {previewSrc ? (
          /* Preview state */
          <div style={{
            position:     'relative',
            borderRadius: 'var(--radius-md)',
            overflow:     'hidden',
            border:       '2px solid rgba(37,99,235,0.25)',
            marginBottom: 18,
            background:   '#f8fafc',
          }}>
            <Image
              src={previewSrc}
              alt="Preview"
              width={220} height={220}
              unoptimized
              style={{
                width: '100%', maxHeight: 220, height: 'auto',
                objectFit: 'contain', display: 'block',
              }}
            />

            {/* Upload loading overlay */}
            {imgUploading && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(255,255,255,0.85)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '3px solid rgba(37,99,235,0.2)',
                  borderTopColor: 'var(--blue-600)',
                  animation: 'spinRing 0.8s linear infinite',
                }} />
                <span style={{
                  fontSize: '0.78rem', fontWeight: 600,
                  color: 'var(--blue-600)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>Uploading to server...</span>
              </div>
            )}

            {/* Uploaded success bar */}
            {!imgUploading && form.imageUrl && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(16,185,129,0.9)',
                backdropFilter: 'blur(4px)',
                padding: '6px 12px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>✅</span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  color: '#fff', fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.04em', flex: 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {imgFileName} - Saved to server!
                </span>
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    background: 'rgba(255,255,255,0.2)', border: 'none',
                    color: '#fff', fontSize: 14, cursor: 'pointer',
                    borderRadius: 4, padding: '1px 6px',
                  }}
                >✕</button>
              </div>
            )}
          </div>
        ) : (
          /* Drop zone */
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border:        '2px dashed rgba(37,99,235,0.25)',
              borderRadius:  'var(--radius-md)',
              padding:       '32px 20px',
              textAlign:     'center',
              marginBottom:  18,
              background:    'rgba(37,99,235,0.025)',
              cursor:        'pointer',
              transition:    'all 0.22s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = 'rgba(37,99,235,0.05)';
              e.currentTarget.style.borderColor  = 'rgba(37,99,235,0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = 'rgba(37,99,235,0.025)';
              e.currentTarget.style.borderColor  = 'rgba(37,99,235,0.25)';
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
            <div style={{
              fontSize: '0.88rem', fontWeight: 700,
              color: 'var(--blue-600)', marginBottom: 4,
            }}>
              Click to choose a photo
            </div>
            <div style={{
              fontSize: '0.74rem', color: 'var(--slate-400)',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              JPG, PNG, WEBP · Max 10 MB
            </div>
          </div>
        )}

        {/* Title */}
        <label className="studio-label" htmlFor="aa-title">Painting Title *</label>
        <input
          id="aa-title" name="title" className="studio-input"
          placeholder="e.g. Demon Slayer — Tanjiro's Resolve"
          value={form.title} onChange={handleChange}
        />

        {/* Artist */}
        <label className="studio-label" htmlFor="aa-artist">Artist Name *</label>
        <input
          id="aa-artist" name="artist" className="studio-input"
          placeholder="e.g. Ankit Kumar"
          value={form.artist} onChange={handleChange}
        />

        {/* Price + Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="studio-label" htmlFor="aa-price" style={{ marginBottom: 0 }}>Price (₹) *</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isPor"
                  checked={form.isPor}
                  onChange={handleCheckboxChange}
                  style={{ width: 14, height: 14, cursor: 'pointer', accentColor: 'var(--blue-600)' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>User decides</span>
              </label>
            </div>
            <input
              id="aa-price" name="price" type="number"
              min="0" step="0.01" className="studio-input"
              placeholder={form.isPor ? "Price on Request" : "4999"}
              value={form.isPor ? "" : form.price}
              onChange={handleChange}
              disabled={form.isPor}
              style={{ backgroundColor: form.isPor ? 'var(--slate-50)' : '#fff', cursor: form.isPor ? 'not-allowed' : 'text' }}
            />
          </div>
          <div>
            <label className="studio-label" htmlFor="aa-category">Category</label>
            <select
              id="aa-category" name="category"
              className="studio-input"
              value={form.category} onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="ANIME SKETCH">Anime Sketch</option>
              <option value="ACRYLIC">Acrylic</option>
              <option value="WATERCOLOR">Watercolor</option>
              <option value="OIL">Oil Painting</option>
              <option value="DIGITAL">Digital Art</option>
              <option value="CHARCOAL">Charcoal</option>
              <option value="SHONEN">Shonen</option>
              <option value="SEINEN">Seinen</option>
              <option value="SHOJO">Shōjo</option>
              <option value="ISEKAI">Isekai</option>
              <option value="MECHA">Mecha</option>
              <option value="SLICE">Slice of Life</option>
            </select>
          </div>
        </div>

        {/* Availability */}
        <label className="studio-label" htmlFor="aa-status">Availability</label>
        <select
          id="aa-status" name="availabilityStatus"
          className="studio-input"
          value={form.availabilityStatus} onChange={handleChange}
        >
          <option value="AVAILABLE">● Available</option>
          <option value="SOLD">◆ Sold Out</option>
          <option value="RESERVED">◈ Reserved</option>
        </select>

        {/* Description */}
        <label className="studio-label" htmlFor="aa-description">Description</label>
        <textarea
          id="aa-description" name="description"
          className="studio-input"
          placeholder="Describe the artwork: inspiration, dimensions, medium, size..."
          rows={3}
          value={form.description} onChange={handleChange}
          style={{ resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
        />

        {/* YouTube Link */}
        <label className="studio-label" htmlFor="aa-youtube">YouTube Video Link (Optional)</label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 18, color: '#f00'
          }}>▶</span>
          <input
            id="aa-youtube" name="youtubeUrl" className="studio-input"
            placeholder="e.g. https://youtube.com/watch?v=..."
            value={form.youtubeUrl} onChange={handleChange}
            style={{ paddingLeft: 42 }}
          />
        </div>

        {/* Submit */}
        <button
          id="aa-upload-btn"
          type="submit"
          className="upload-btn"
          disabled={loading || imgUploading}
        >
          {loading ? (
            <span style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10,
            }}>
              <span style={{
                width: 15, height: 15, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                animation: 'spinRing 0.7s linear infinite',
                display: 'inline-block',
              }} />
              Uploading to Gallery…
            </span>
          ) : imgUploading ? (
            '⏳ Uploading image...'
          ) : (
            '⚡ Upload to Studio Gallery'
          )}
        </button>

      </form>
    </div>
  );
}

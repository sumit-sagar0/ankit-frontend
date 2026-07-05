import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/env';

export default function AdminCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommissions = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/commissions`);
      setCommissions(res.data);
    } catch (err) {
      console.error('Failed to fetch commissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCommissions();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/commissions/${id}/status?status=${status}`);
      window.dispatchEvent(new CustomEvent('showGlobalToast', { 
        detail: { message: `Commission request ${status.toLowerCase()}!`, type: 'success' } 
      }));
      fetchCommissions(); // refresh
    } catch (err) {
      console.error('Failed to update status:', err);
      window.dispatchEvent(new CustomEvent('showGlobalToast', { 
        detail: { message: 'Error updating commission status', type: 'error' } 
      }));
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate-500)' }}>Loading requests...</div>;
  }

  if (commissions.length === 0) {
    return (
      <div style={{ 
        padding: '60px 40px', 
        textAlign: 'center', 
        background: 'var(--white)', 
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'floatY 3s ease-in-out infinite' }}>🎨</div>
        <h3 className="font-sora" style={{ fontSize: '1.2rem', color: 'var(--slate-800)', marginBottom: 8, fontWeight: 700 }}>No Commission Requests Yet</h3>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', maxWidth: 300, margin: '0 auto' }}>
          When clients submit new painting requests, they will appear right here for your review.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {commissions.map(req => (
        <div key={req.id} style={{
          background: 'var(--white)',
          padding: 24,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--slate-100)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <h3 className="font-sora" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)' }}>{req.name}</h3>
              <a href={`mailto:${req.email}`} style={{ fontSize: '0.85rem', color: 'var(--blue-600)', textDecoration: 'none' }}>{req.email}</a>
            </div>
            <span style={{
              padding: '4px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
              background: req.status === 'PENDING' ? 'rgba(245,158,11,0.1)' : req.status === 'ACCEPTED' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
              color: req.status === 'PENDING' ? '#d97706' : req.status === 'ACCEPTED' ? '#059669' : '#e11d48'
            }}>
              {req.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: '0.8rem' }}><strong style={{ color: 'var(--slate-700)' }}>Type:</strong> <span style={{ color: 'var(--slate-500)' }}>{req.paintingType}</span></div>
            {req.size && <div style={{ fontSize: '0.8rem' }}><strong style={{ color: 'var(--slate-700)' }}>Size:</strong> <span style={{ color: 'var(--slate-500)' }}>{req.size}</span></div>}
            {req.budget && <div style={{ fontSize: '0.8rem' }}><strong style={{ color: 'var(--slate-700)' }}>Budget:</strong> <span style={{ color: 'var(--slate-500)' }}>₹{req.budget}</span></div>}
            {req.deadline && <div style={{ fontSize: '0.8rem' }}><strong style={{ color: 'var(--slate-700)' }}>Deadline:</strong> <span style={{ color: 'var(--slate-500)' }}>{req.deadline}</span></div>}
          </div>

          {req.reference && (
            <div style={{ fontSize: '0.8rem', marginBottom: 8 }}>
              <strong style={{ color: 'var(--slate-700)' }}>Reference:</strong>{' '}
              <a href={req.reference} target="_blank" rel="noreferrer" style={{ color: 'var(--blue-500)' }}>View Link 🔗</a>
            </div>
          )}

          {req.message && (
            <div style={{
              fontSize: '0.8rem', color: 'var(--slate-600)', padding: 12,
              background: 'var(--snow)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-100)'
            }}>
              {req.message}
            </div>
          )}

          {/* Actions - Advanced Tracking */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--snow)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-100)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)' }}>Update Status:</span>
            <select
              value={req.status}
              onChange={(e) => updateStatus(req.id, e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--slate-200)',
                background: 'var(--white)',
                color: 'var(--slate-800)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="PENDING">PENDING (Reviewing)</option>
              <option value="ACCEPTED">ACCEPTED (Approved)</option>
              <option value="IN_PROGRESS">IN PROGRESS (Painting)</option>
              <option value="COMPLETED">COMPLETED (Ready to ship)</option>
              <option value="SHIPPED">SHIPPED (On its way)</option>
              <option value="REJECTED">REJECTED (Declined)</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
